const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password",authController.forgotPassword)
router.post("/reset-password",authController.resetPassword)

module.exports = router;
