/************************************************************
 * server/controllers/mealPlansController.js
 ************************************************************/
const pool = require("../dbConfig");

module.exports = {
  /**
   * Kullanıcının tüm beslenme planlarını getir
   */
  getMealPlans: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const result = await pool.query(
        "SELECT * FROM meal_plans WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Get meal plans error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Yeni bir beslenme planı oluştur
   */
  createMealPlan: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { title } = req.body;

      const newPlan = await pool.query(
        `INSERT INTO meal_plans (user_id, title)
         VALUES ($1, $2)
         RETURNING *`,
        [userId, title]
      );

      return res.status(201).json(newPlan.rows[0]);
    } catch (error) {
      console.error("Create meal plan error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Belirli bir beslenme planının detaylarını (içindeki öğünlerle) getir
   */
  getMealPlanDetail: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const planId = req.params.meal_plan_id;

      // Plan kullanıcıya ait mi?
      const planCheck = await pool.query(
        "SELECT * FROM meal_plans WHERE meal_plan_id = $1 AND user_id = $2",
        [planId, userId]
      );
      if (planCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Meal plan not found or not yours" });
      }

      const meals = await pool.query(
        "SELECT * FROM meal_entries WHERE meal_plan_id = $1 ORDER BY meal_entry_id ASC",
        [planId]
      );

      return res.status(200).json({
        mealPlan: planCheck.rows[0],
        meals: meals.rows,
      });
    } catch (error) {
      console.error("Get meal plan detail error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Beslenme planına öğün ekle
   */
  addMealToPlan: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const planId = req.params.meal_plan_id;
      const { meal_type, meal_desc } = req.body;

      // Plan kullanıcıya ait mi?
      const planCheck = await pool.query(
        "SELECT * FROM meal_plans WHERE meal_plan_id = $1 AND user_id = $2",
        [planId, userId]
      );
      if (planCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Meal plan not found or not yours" });
      }

      const newMeal = await pool.query(
        `INSERT INTO meal_entries (meal_plan_id, meal_type, meal_desc)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [planId, meal_type, meal_desc]
      );

      return res.status(201).json(newMeal.rows[0]);
    } catch (error) {
      console.error("Create meal entry error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  deleteMealPlan: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const mealPlanId = req.params.meal_plan_id;

      // Kullanıcıya mı ait?
      const check = await pool.query(
        "SELECT * FROM meal_plans WHERE meal_plan_id = $1 AND user_id = $2",
        [mealPlanId, userId]
      );
      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Meal plan not found or not yours" });
      }

      // Planı sil
      await pool.query("DELETE FROM meal_plans WHERE meal_plan_id = $1", [
        mealPlanId,
      ]);
      return res.status(200).json({ message: "Meal plan deleted" });
    } catch (error) {
      console.error("Delete meal plan error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Bir meal entry'i silme
   */
  deleteMealEntry: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const mealPlanId = req.params.meal_plan_id;
      const mealEntryId = req.params.meal_entry_id;

      // Plan kullanıcıya ait mi?
      const planCheck = await pool.query(
        "SELECT * FROM meal_plans WHERE meal_plan_id = $1 AND user_id = $2",
        [mealPlanId, userId]
      );
      if (planCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Meal plan not found or not yours" });
      }

      // Entry sil
      await pool.query(
        "DELETE FROM meal_entries WHERE meal_entry_id = $1 AND meal_plan_id = $2",
        [mealEntryId, mealPlanId]
      );
      return res.status(200).json({ message: "Meal entry deleted" });
    } catch (error) {
      console.error("Delete meal entry error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
