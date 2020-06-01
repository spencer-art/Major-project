const express = require('express');
const reviewController = require('../controller/reviewController');
const authController = require('../controller/authController');

const router = express.Router({
    mergeParams: true
});

router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.createReviews);


module.exports = router;