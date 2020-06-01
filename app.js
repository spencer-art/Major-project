const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const compression = require("compression");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const suitRoutes = require("./routes/suits");
const viewRoutes = require("./routes/viewRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const reviewRouter = require("./routes/reviewsRoute");

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(
    bodyparser.json({
        limit: "10kb",
    })
);
app.use(
    bodyparser.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
//sessions middleware
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 180 * 60 * 1000,
        },
    })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: ["price"],
    })
);
//Handling CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "*");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
        res.status(200).json({});
    }
    next();
});

app.use(compression());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    //console.log(req.cookies);
    next();
});
//view engine setup
app.set("views", path.join((__dirname, "views")));
app.set("view engine", "pug");

//set public folder
app.use(express.static(path.join(__dirname, "/public")));

app.get("*", function (req, res, next) {
    res.locals.cart = req.session.cart;
    next();
});
app.use("/", viewRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/suits", suitRoutes);
app.use("/api/v1/orders", orderRouter);
app.use("/reviews", reviewRouter);

//unhandled routes
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;