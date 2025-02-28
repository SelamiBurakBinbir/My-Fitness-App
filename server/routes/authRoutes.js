/************************************************************
 * server/routes/authRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();

// Controller
const authController = require("../controllers/authController");

/**
 * @route   POST /api/auth/register
 * @desc    Yeni kullanıcı kaydı
 */
router.post("/register", authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Kullanıcı girişi
 */
router.post("/login", authController.login);

module.exports = router;
