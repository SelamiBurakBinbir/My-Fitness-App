/************************************************************
 * server/routes/habitsRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();

// Controller
const habitsController = require("../controllers/habitsController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   GET /api/habits
 * @desc    Kullanıcının tüm alışkanlıklarını getir
 */
router.get("/", authMiddleware, habitsController.getHabits);

/**
 * @route   POST /api/habits
 * @desc    Yeni bir alışkanlık oluştur
 */
router.post("/", authMiddleware, habitsController.createHabit);

/**
 * @route   DELETE /api/habits/:habit_id
 * @desc    Bir alışkanlığı sil
 */
router.delete("/:habit_id", authMiddleware, habitsController.deleteHabit);

/**
 * @route   GET /api/habits/:habit_id/tracking
 * @desc    Belirli alışkanlığın tüm gün kayıtlarını getir
 */
router.get(
  "/:habit_id/tracking",
  authMiddleware,
  habitsController.getHabitTracking
);

/**
 * @route   POST /api/habits/:habit_id/tracking
 * @desc    Belirli bir gün için alışkanlık kaydı ekle veya güncelle
 */
router.post(
  "/:habit_id/tracking",
  authMiddleware,
  habitsController.upsertHabitTracking
);

module.exports = router;
