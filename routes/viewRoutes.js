const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController");
const authController = require('../controller/authController');
const orderController = require("../controller/orderController");



router.get("/",
    orderController.createOrdersCheckout,
    authController.isLoggedIn,
    viewController.getHome
);
router.get("/overview",
    authController.isLoggedIn,
    viewController.getOverview
);
router.get("/suit/:slug",
    authController.isLoggedIn,
    viewController.getSuit
);
router.get("/about",
    viewController.getAbout
);
router.get("/contact",
    viewController.getContact
);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-orders', authController.protect, viewController.getOrders);
router.get('/signup', viewController.getSignUpForm);
router.get('/forgot', viewController.getForgot);
router.get('/suits', authController.protect, viewController.createProduct);
router.get('/update-product/:id', authController.protect, viewController.updateProduct);
router.get('/delete-product/:id', authController.protect, viewController.deleteProduct);


router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
);




module.exports = router;