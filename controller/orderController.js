const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Suit = require("../models/suitModel");
const Order = require("../models/orderModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked suit
    const suits = await Suit.findById(req.params.suitId);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${req.protocol}://${req.get('host')}/?suits=${req.params.suitId}&user=${req.user.id}&price=${suits.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/suits/${suits.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.suitId,
        line_items: [{
                name: `${suits.name} Suit`,
                description: suits.description,
                images: [`${suits.imageCover}`],
                amount: suits.price * 100,
                currency: 'inr',
                quantity: 1
            }

        ]
    });

    // 3) Create session as response
    res.status(200).json({
        status: "success",
        session
    });
});
exports.createOrdersCheckout = catchAsync(async (req, res, next) => {
    // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
    const {
        suits,
        user,
        price
    } = req.query;

    if (!suits && !user && !price) return next();
    await Order.create({
        suits,
        user,
        price
    });

    res.redirect(req.originalUrl.split('?')[0]);
});