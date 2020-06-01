const multer = require('multer');
const sharp = require('sharp');
const Suit = require('../models/suitModel');
const APIFeatures = require('./../utils/apifeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadSuitImages = upload.fields([{
        name: 'imageCover',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 3
    }
]);
exports.resizeSuitImages = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

    // 1) Cover image
    req.body.imageCover = `suit-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(450, 720)
        .toFormat('jpeg')
        .jpeg({
            quality: 90
        })
        .toFile(`public/images/suits/${req.body.imageCover}`);

    // 2) Images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `suit-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(480, 600)
                .toFormat('jpeg')
                .jpeg({
                    quality: 90
                })
                .toFile(`public/images/suits/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
});

exports.aliasTopSuits = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price';
    req.query.fields = 'name,price';
    next();
};


exports.getAllsuits =
    catchAsync(async (req, res, next) => {
        //EXECUTE QUERY
        const features = new APIFeatures(Suit.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const suits = await features.query;
        res.status(200).json({
            message: "success",
            results: suits.length,
            data: {
                suits
            }
        });
    });



exports.createSuits = catchAsync(async (req, res, next) => {
    const newSuit = await Suit.create(req.body);
    res.status(201).json({
        message: "success",
        data: {
            suits: newSuit
        }

    });

});

exports.getSuit = catchAsync(async (req, res, next) => {
    const suits = await (await Suit.findById(req.params.id).populate('reviews'));
    if (!suits) {
        return next(new AppError('No item found with that ID', 404));
    }

    res.status(201).json({
        message: "success",
        data: {
            suits
        }

    });

});

exports.updateSuit = catchAsync(async (req, res, next) => {
    const suits = await Suit.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    if (!suits) {
        return next(new AppError('No product found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            suits
        }
    });
});


exports.deleteSuit = catchAsync(async (req, res, next) => {
    await Suit.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });

});