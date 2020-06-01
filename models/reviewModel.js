const mongoose = require('mongoose');
const Suit = require('./suitModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    suit: {
        type: mongoose.Schema.ObjectId,
        ref: 'Suit',
        required: [true, 'Review must belong to a product.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

reviewSchema.index({
    tour: 1,
    user: 1
}, {
    unique: true
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });

    next();
});


const Reviews = mongoose.model("Reviews", reviewSchema);
module.exports = Reviews;