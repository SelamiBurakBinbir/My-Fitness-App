/************************************************************
 * server/controllers/progressController.js
 ************************************************************/
const pool = require("../dbConfig");

module.exports = {
  /**
   * Kullanıcının tüm ölçümlerini getir
   */
  getProgress: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const result = await pool.query(
        "SELECT * FROM progress WHERE user_id = $1 ORDER BY measurement_date DESC",
        [userId]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Get progress error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Yeni bir ölçüm ekle
   */
  createProgress: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { measurement_type, measurement_value, measurement_date } =
        req.body;

      const newProgress = await pool.query(
        `INSERT INTO progress (user_id, measurement_type, measurement_value, measurement_date)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, measurement_type, measurement_value, measurement_date]
      );

      return res.status(201).json(newProgress.rows[0]);
    } catch (error) {
      console.error("Create progress error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  deleteProgress: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const progressId = req.params.progress_id;

      // Kullanıcıya ait mi?
      const check = await pool.query(
        "SELECT * FROM progress WHERE progress_id = $1 AND user_id = $2",
        [progressId, userId]
      );
      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Progress record not found or not yours" });
      }

      await pool.query("DELETE FROM progress WHERE progress_id = $1", [
        progressId,
      ]);
      return res.status(200).json({ message: "Progress record deleted" });
    } catch (error) {
      console.error("Delete progress error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
