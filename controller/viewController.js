const Suit = require("./../models/suitModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getHome = catchAsync(async (req, res, next) => {
    res.status(200).render("home", {
        suit: "The oxford grey",
    });
});

exports.getOverview = catchAsync(async (req, res, next) => {
    //1.get data from collections
    const suits = await Suit.find();

    //2.build a template
    //3.render that template using data from 1.
    res.status(200).render("overview", {
        title: "All Suits",
        suits,
    });
});

exports.getSuit = catchAsync(async (req, res, next) => {
    //1.get data from collection
    const suits = await Suit.findOne({
        slug: req.params.slug,
    }).populate({
        path: "reviews",
        fields: "review rating user",
    });

    if (!suits) {
        return next(new AppError("There is no product with that name.", 404));
    }

    res.status(200).render("suit", {
        title: `${suits.name} Suit`,
        suits,
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render("login", {
        title: "Log into your account",
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render("account", {
        title: "Your account",
    });
};

exports.getSignUpForm = (req, res) => {
    res.status(200).render("signup", {
        title: "Sign Up for your account",
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id, {
            name: req.body.name,
            email: req.body.email,
        }, {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).render("account", {
        title: "Your account",
        user: updatedUser,
    });
});

exports.getOrders = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const orders = await Order.find({
        user: req.user.id,
    });

    // 2) Find tours with the returned IDs
    const suitIDs = orders.map((el) => el.suits);
    const suits = await Suit.find({
        _id: {
            $in: suitIDs,
        },
    });

    res.status(200).render("overview", {
        title: "My Orders",
        suits,
    });
});
exports.createProduct = catchAsync(async (req, res, next) => {
    const newSuit = await Suit.create(req.body.suits);
    res.status(200).render("manage_suits", {
        title: "create your product",
        suits: newSuit,
    });
});
exports.updateProduct = catchAsync(async (req, res, next) => {
    const suits = await Suit.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    if (!suits) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).render('update', {
        title: "update your product",
        suits,
    });
});

exports.deleteProduct = function (req, res) {
    var id = req.params.id;
    Suit.findByIdAndRemove(id, function (err) {
        console.log(err);
    });
    res.redirect("/overview");
};

exports.getForgot = (req, res) => {
    res.status(200).render("forgot", {
        title: "Forgot password",
    });
};

exports.getAbout = catchAsync(async (req, res, next) => {
    res.status(200).render("about", {
        title: "About Us"
    });
});
exports.getContact = catchAsync(async (req, res, next) => {
    res.status(200).render("contact", {
        title: "Contact Us"
    });
});