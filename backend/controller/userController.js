const ErrorHander = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");

//register user

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { Name, Email, Password, Phone, Address } = req.body;

  const user = await User.create({
    Name,
    Email,
    Password,
    Phone,
    Address,
  });

  //call jwt token
  sendToken(user, 201, res);
});

//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { Email, Password } = req.body;

  //checking if user has given password and email both
  if (!Email || !Password) {
    return next(new ErrorHander("Please enter email and password", 400));
  }

  const user = await User.findOne({ Email }).select("+Password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = user.comparePassword(Password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//Logout user
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
  });

  if (!user) {
    return next(new ErrorHander("Invalid reset password token", 400));
  }

  if (req.body.Password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password doesn't match", 400));
  }

  user.Password = req.body.Password;

  await user.save();

  sendToken(user, 200, res);
});

//get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Password user details
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+Password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Incorrect old password", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("Password not matched", 400));
  }

  user.Password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});
