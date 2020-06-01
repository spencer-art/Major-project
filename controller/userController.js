const multer = require("multer");
const sharp = require("sharp");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
 if (file.mimetype.startsWith("image")) {
  cb(null, true);
 } else {
  cb(new AppError("Not an image! Please upload only images.", 400), false);
 }
};

const upload = multer({
 storage: multerStorage,
 fileFilter: multerFilter
});
exports.uploadUserPhoto = upload.single("photo");
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
 if (!req.file) return next();

 req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

 await sharp(req.file.buffer)
  .resize(500, 500)
  .toFormat("jpeg")
  .jpeg({quality: 90})
  .toFile(`public/images/users/${req.file.filename}`);

 next();
});

const filterObj = (obj, ...allowedFields) => {
 const newObj = {};
 Object.keys(obj).forEach(el => {
  if (allowedFields.includes(el)) newObj[el] = obj[el];
 });
 return newObj;
};
exports.getMe = (req, res, next) => {
 req.params.id = req.user.id;
 next();
};
exports.getAllUsers = catchAsync(async (req, res) => {
 const users = await User.find();

 // SEND RESPONSE
 res.status(200).json({
  status: "success",
  results: users.length,
  data: {
   users
  }
 });
});

exports.getUser = catchAsync(async (req, res, next) => {
 const users = await await User.findById(req.params.id);
 if (!users) {
  return next(new AppError("No item found with that ID", 404));
 }

 res.status(201).json({
  message: "success",
  data: {
   users
  }
 });
});

exports.updateMe = catchAsync(async (req, res, next) => {
 console.log(req.file);
 console.log(req.body);

 // 1) Create error if user POSTs password data
 if (req.body.password || req.body.passwordConfirm) {
  return next(
   new AppError(
    "This route is not for password updates. Please use /updateMyPassword.",
    400
   )
  );
 }
 // 2) Filtered out unwanted fields names that are not allowed to be updated
 const filteredBody = filterObj(req.body, "name", "email");
 if (req.file) filteredBody.photo = req.file.filename;

 // 3) Update user document
 const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
  new: true,
  runValidators: true
 });

 res.status(200).json({
  status: "success",
  data: {
   user: updatedUser
  }
 });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
 await User.findByIdAndDelete(req.user.id, {
  active: false
 });

 res.status(204).json({
  status: "success",
  data: null
 });
});

exports.createUser = (req, res) => {
 res.status(500).json({
  status: "error",
  message: "This route is not yet defined! use /signup instead"
 });
};
exports.updateUser = catchAsync(async (req, res) => {
 res.status(500).json({
  status: "error",
  message: "This route is not yet defined!"
 });
});
exports.deleteUser = catchAsync(async (req, res) => {
 res.status(500).json({
  status: "error",
  message: "This route is not yet defined!"
 });
});
