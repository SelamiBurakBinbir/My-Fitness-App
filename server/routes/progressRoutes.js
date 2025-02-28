/************************************************************
 * server/routes/progressRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

// GET all progress
router.get("/", authMiddleware, progressController.getProgress);
// POST new progress
router.post("/", authMiddleware, progressController.createProgress);

// DELETE progress
router.delete(
  "/:progress_id",
  authMiddleware,
  progressController.deleteProgress
);

module.exports = router;
