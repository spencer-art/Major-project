const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    suits: {
        type: mongoose.Schema.ObjectId,
        ref: 'Suit',
        required: [true, 'Orders must belong to a Product!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'orders must belong to a User!']
    },
    price: {
        type: Number,
        require: [true, 'Orders must have a price.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

orderSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'suits',
        select: 'name'
    });
    next();
});

module.exports = mongoose.model('Order', orderSchema);