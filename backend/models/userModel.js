const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Please enter your Name"],
    maxlength: [30, "Nmae can not exceed 30 characters"],
    minlength: [4, "Name should have more then 4 characters"],
  },
  Email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid Email"],
  },
  Password: {
    type: String,
    required: [true, "Please enter your Password"],
    minlength: [6, "Password should be greater then 6 characters"],
    select: false, //it won't show password in find()
  },
  Phone: {
    type: Number,
    required: [true, "Please enter your Phone number"],
  },
  Address: {
    type: String,
    required: [true, "Please enter your Address"],
    maxlength: [60, "Name can not exceed 60 characters"],
    minlength: [4, "Name should have more then 4 characters"],
  },
  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
});

//hashing ---
userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) {
    next();
  }
  this.Password = await bcrypt.hash(this.Password, 10); //hashing password
});

//JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

//Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
  //Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding to user schema ---sha256 algo
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
