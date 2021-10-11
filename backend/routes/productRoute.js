const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

//create first route
router.route("/products").get(isAuthenticatedUser, getAllProducts);
router.route("/product/new").post(createProduct);
router.route("/product/:id").put(updateProduct).delete(deleteProduct);

module.exports = router;
