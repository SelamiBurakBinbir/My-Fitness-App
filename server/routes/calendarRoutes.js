/************************************************************
 * server/routes/calendarRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   GET /api/calendar
 * @desc    Tüm takvim notlarını (entries) getir
 */
router.get("/", authMiddleware, calendarController.getCalendarEntries);

/**
 * @route   POST /api/calendar
 * @desc    Yeni bir takvim notu oluştur
 */
router.post("/", authMiddleware, calendarController.createCalendarEntry);

/**
 * @route   DELETE /api/calendar/:calendar_id
 * @desc    Belirli bir takvim notunu sil
 */
router.delete(
  "/:calendar_id",
  authMiddleware,
  calendarController.deleteCalendarEntry
);

module.exports = router;
