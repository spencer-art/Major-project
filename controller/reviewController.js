const Reviews = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");


exports.getReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.suitId) filter = {
        suit: req.params.suitId
    };
    const reviews = await Reviews.find(filter);

    res.status(200).json({
        message: 'success',
        data: {
            reviews
        }
    });

});

exports.createReviews = catchAsync(async (req, res, next) => {
    //nested routes
    if (!req.body.suit) req.body.suit = req.params.suitId;
    req.body.user = req.user.id;

    const newReviews = await Reviews.create(req.body);
    res.status(200).json({
        message: 'success',
        data: {
            reviews: newReviews
        }
    });

});