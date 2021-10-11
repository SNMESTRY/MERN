const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  resetPassword,
  updateUserPassword,

} = require("../controller/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/reset/:token").put(resetPassword);

router.route("/password/update").put(isAuthenticatedUser ,updateUserPassword);
//add me

module.exports = router;
