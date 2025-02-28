/************************************************************
 * server/routes/mealPlansRoutes.js
 ************************************************************/
const express = require("express");
const router = express.Router();
const mealPlansController = require("../controllers/mealPlansController");
const authMiddleware = require("../middleware/authMiddleware");

// GET all meal plans
router.get("/", authMiddleware, mealPlansController.getMealPlans);
// POST new meal plan
router.post("/", authMiddleware, mealPlansController.createMealPlan);
// GET meal plan detail
router.get(
  "/:meal_plan_id",
  authMiddleware,
  mealPlansController.getMealPlanDetail
);
// POST meal entry
router.post(
  "/:meal_plan_id/meals",
  authMiddleware,
  mealPlansController.addMealToPlan
);

// DELETE meal plan
router.delete(
  "/:meal_plan_id",
  authMiddleware,
  mealPlansController.deleteMealPlan
);

// DELETE meal entry
router.delete(
  "/:meal_plan_id/meals/:meal_entry_id",
  authMiddleware,
  mealPlansController.deleteMealEntry
);

module.exports = router;
