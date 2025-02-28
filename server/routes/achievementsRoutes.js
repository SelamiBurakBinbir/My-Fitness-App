/************************************************************
 * server/routes/achievementsRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();
const achievementsController = require("../controllers/achievementsController");
const authMiddleware = require("../middleware/authMiddleware");

// GET achievements
router.get("/", authMiddleware, achievementsController.getAchievements);

// POST achievements
router.post("/", authMiddleware, achievementsController.createAchievement);

// DELETE achievement
router.delete(
  "/:achievement_id",
  authMiddleware,
  achievementsController.deleteAchievement
);

module.exports = router;
