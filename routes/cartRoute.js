// var express = require('express');
// const Suit = require('../models/suitModel');



// var router = express.Router();
// router.get('/add/:product', function (req, res) {

//     var slug = req.params.product;

//     Suit.findOne({
//         slug: slug
//     }, function (err, p) {
//         if (err)
//             console.log(err);

//         if (typeof req.session.cart == "undefined") {
//             req.session.cart = [];
//             req.session.cart.push({
//                 name: slug,
//                 qty: 1,
//                 price: parseFloat(p.price).toFixed(2),
//             });
//         } else {
//             var cart = req.session.cart;
//             var newItem = true;

//             for (var i = 0; i < cart.length; i++) {
//                 if (cart[i].title == slug) {
//                     cart[i].qty++;
//                     newItem = false;
//                     break;
//                 }
//             }

//             if (newItem) {
//                 cart.push({
//                     name: slug,
//                     qty: 1,
//                     price: parseFloat(p.price).toFixed(2),
//                 });
//             }
//         }

//         console.log(req.session.cart);
//     });

// });


// /*
//  * GET checkout page
//  */
// router.get('/checkout', function (req, res) {

//     if (req.session.cart && req.session.cart.length == 0) {
//         delete req.session.cart;
//         res.redirect('/cart/checkout');
//     } else {
//         res.render('checkout', {
//             title: 'Checkout',
//             cart: req.session.cart
//         });
//     }

// });

// module.exports = router;