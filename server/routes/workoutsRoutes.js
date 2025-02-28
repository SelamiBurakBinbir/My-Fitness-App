/************************************************************
 * server/routes/workoutsRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();
const workoutsController = require("../controllers/workoutsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, workoutsController.getWorkouts);
router.post("/", authMiddleware, workoutsController.createWorkout);
router.get("/:workout_id", authMiddleware, workoutsController.getWorkoutDetail);
router.post(
  "/:workout_id/exercises",
  authMiddleware,
  workoutsController.addExerciseToWorkout
);
router.delete(
  "/:workout_id/exercises/:we_id",
  authMiddleware,
  workoutsController.removeExerciseFromWorkout
);

// Yeni eklenen:
router.delete("/:workout_id", authMiddleware, workoutsController.deleteWorkout);

module.exports = router;
