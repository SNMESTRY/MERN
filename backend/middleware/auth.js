const ErrorHander = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//req res
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookie;

  if (!token) {
    return next(new ErrorHander("Please login to access this resourse", 401));
  }
  const decodedData = jwt.veryfy(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      new ErrorHander(
        `Role: ${req.user.role} is not allowed to access thi resourse`
      );
    }
    next();
  };
};
