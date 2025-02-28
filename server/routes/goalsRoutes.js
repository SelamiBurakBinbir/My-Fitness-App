/************************************************************
 * server/routes/goalsRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();

// Controller
const goalsController = require("../controllers/goalsController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   GET /api/goals
 * @desc    Kullanıcının tüm hedeflerini getir
 */
router.get("/", authMiddleware, goalsController.getGoals);

/**
 * @route   POST /api/goals
 * @desc    Yeni hedef oluştur
 */
router.post("/", authMiddleware, goalsController.createGoal);

/**
 * @route   PUT /api/goals/:goal_id
 * @desc    Belirli bir hedefi güncelle
 */
router.put("/:goal_id", authMiddleware, goalsController.updateGoal);

/**
 * @route   DELETE /api/goals/:goal_id
 * @desc    Bir hedefi sil
 */
router.delete("/:goal_id", authMiddleware, goalsController.deleteGoal);

module.exports = router;
