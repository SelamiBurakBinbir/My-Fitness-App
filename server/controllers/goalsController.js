/************************************************************
 * server/controllers/goalsController.js
 ************************************************************/
const pool = require("../dbConfig");

module.exports = {
  /**
   * Kullanıcının tüm hedeflerini getir
   */
  getGoals: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const result = await pool.query(
        "SELECT * FROM goals WHERE user_id = $1",
        [userId]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Get goals error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Yeni hedef oluştur
   */
  createGoal: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { goal_type, target_value, current_value, end_date } = req.body;

      const newGoal = await pool.query(
        `INSERT INTO goals (user_id, goal_type, target_value, current_value, end_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, goal_type, target_value, current_value, end_date]
      );

      return res.status(201).json(newGoal.rows[0]);
    } catch (error) {
      console.error("Create goal error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Belirli bir hedefi güncelle
   */
  updateGoal: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const goalId = req.params.goal_id;
      const { goal_type, target_value, current_value, end_date } = req.body;

      // Kullanıcıya ait mi kontrol
      const check = await pool.query(
        "SELECT * FROM goals WHERE goal_id = $1 AND user_id = $2",
        [goalId, userId]
      );
      if (check.rows.length === 0) {
        return res.status(404).json({ message: "Goal not found or not yours" });
      }

      const updatedGoal = await pool.query(
        `UPDATE goals
         SET goal_type = $1,
             target_value = $2,
             current_value = $3,
             end_date = $4
         WHERE goal_id = $5
         RETURNING *`,
        [goal_type, target_value, current_value, end_date, goalId]
      );

      return res.status(200).json(updatedGoal.rows[0]);
    } catch (error) {
      console.error("Update goal error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Bir hedefi sil
   */
  deleteGoal: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const goalId = req.params.goal_id;

      // Kullanıcıya ait mi kontrol
      const check = await pool.query(
        "SELECT * FROM goals WHERE goal_id = $1 AND user_id = $2",
        [goalId, userId]
      );
      if (check.rows.length === 0) {
        return res.status(404).json({ message: "Goal not found or not yours" });
      }

      await pool.query("DELETE FROM goals WHERE goal_id = $1", [goalId]);
      return res.status(200).json({ message: "Goal deleted" });
    } catch (error) {
      console.error("Delete goal error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
