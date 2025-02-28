/************************************************************
 * server/routes/userRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Profil bilgisi getirme
router.get("/profile", authMiddleware, userController.getProfile);

// Profil bilgisi güncelleme
router.put("/profile", authMiddleware, userController.updateProfile);

// Kullanıcı silme (Delete account)
router.delete("/profile", authMiddleware, userController.deleteUser);

module.exports = router;
