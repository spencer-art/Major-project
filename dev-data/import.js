const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const Suit = require('./../models/suitModel');
const Reviews = require('./../models/reviewModel');
// const User = require("./../models/userModel");

dotenv.config({
    path: "./config.env",
});

// Connect to db
// mongoose.connect('mongodb://localhost/The_Suits_Store');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     console.log('Connected to MongoDB');
// });

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connection successful!"));

// READ JSON FILE
// const suits = JSON.parse(fs.readFileSync(`${__dirname}/suits.json`, "utf-8"));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        // await Suit.create(suits);
        //   await User.create(users, {
        //    validateBeforeSave: false,
        //   });
        await Reviews.create(reviews, {
            validateBeforeSave: false,
        });
        console.log("Data successfully loaded!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        //await Suit.deleteMany();
        await User.deleteMany();
        //await Reviews.deleteMany();
        console.log("Data successfully deleted!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}