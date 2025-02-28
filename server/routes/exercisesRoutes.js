/************************************************************
 * server/routes/exercisesRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const exercisesController = require("../controllers/exercisesController");

/**
 * GET /api/exercises
 * Sadece giriş yapan kullanıcıya ait egzersizler
 */
router.get("/", authMiddleware, exercisesController.getExercises);

/**
 * POST /api/exercises
 * Yeni egzersiz ekleme (kullanıcının kendine ait)
 */
router.post("/", authMiddleware, exercisesController.createExercise);

/**
 * DELETE /api/exercises/:exercise_id
 */
router.delete(
  "/:exercise_id",
  authMiddleware,
  exercisesController.deleteExercise
);

module.exports = router;
