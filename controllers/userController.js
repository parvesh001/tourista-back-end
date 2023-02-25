const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
  let filteredObj = {};
  for (let key in obj) {
    if (allowedFields.includes(key)) filteredObj[key] = obj[key];
  }
  return filteredObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Check if password and confirm password are there
  if (req.body.newPassword || req.body.newPasswordConfirm) {
    return next(
      new AppError(
        `This route is to update user's email or name not for password`,
        400
      )
    );
  }
  //2)Filter out not-allowed fileds
  const filteredObj = filterObj(req.body, 'name', 'email');
  //3)Update email or name (using findByIdAndUpdate to avoid extra validations which require fields)
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true,
  });
  //4) Send back response
  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  //1) Get User and update active status to false
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json({ status: 'success', results: users.length, data: { users } });
});

exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined!' });
};
exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined!' });
};
exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined!' });
};
exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined!' });
};
