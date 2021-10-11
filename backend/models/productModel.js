const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product name"],
  },
  description: {
    type: String,
    required: [true, "Please Enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product price"],
    maxLength: [8, "Price can not exceed 8 characters"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  Images: [
    {
      type: String,
      required: true,
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter product category "],
  },
  stock: {
    type: String,
    required: [true, "Please Enter product stock "],
    maxLength: [4, "Price can not exceed 4 characters"],
    default: 1,
  },
  numOfReview: {
    type: String,
    default: 0,
  },
  review: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
