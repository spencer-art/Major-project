const express = require("express");
const suitController = require("../controller/suitController");
const authController = require("../controller/authController");
const reviewRouter = require('../routes/reviewsRoute');
const router = express.Router();

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
router.use('/:suitId/reviews', reviewRouter);

router
    .route('/top-5-cheap')
    .get(suitController.aliasTopSuits, suitController.getAllsuits);

router
    .route("/")
    .get(suitController.getAllsuits)
    .post(authController.protect,
        authController.restrictTo('admin'),
        suitController.uploadSuitImages,
        suitController.resizeSuitImages,
        suitController.createSuits)


router
    .route("/:id")
    .get(suitController.getSuit)
    .patch(authController.protect,
        authController.restrictTo('admin'),
        suitController.uploadSuitImages,
        suitController.resizeSuitImages,
        suitController.updateSuit)
    .delete(authController.protect,
        authController.restrictTo('admin'),
        suitController.deleteSuit
    );


module.exports = router;