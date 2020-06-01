const express = require("express");
const orderController = require("../controller/orderController");
const authController = require("../controller/authController");
const router = express.Router();



router.use(authController.protect);

router.get('/checkout-session/:suitId', orderController.getCheckoutSession);



module.exports = router;