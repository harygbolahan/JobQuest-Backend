const express = require("express");
const authController = require("./../controllers/auth");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/company/register").post(authController.companySignup);
router.post("/company/login", authController.companyLogin);

router
  .route("/verify/:email/:verificationToken")
  .get(authController.verifyEmailAddress);

router
  .route("/verifyCompany/:email/:verificationToken")
  .get(authController.companyVerifyEmailAddress);

router.route("/forgot-password").post(authController.forgotPassword);

router.route("/company/forgot-password").post(authController.companyForgotPassword);

router
  .route("/resetPassword/:email/:resetToken")
  .patch(authController.resetPassword);

  router
  .route("/company/resetPassword/:email/:resetToken")
  .patch(authController.companyResetPassword);

module.exports = router;
