/************************************************************
 * server/controllers/achievementsController.js
 ************************************************************/
const pool = require("../dbConfig");

module.exports = {
  /**
   * Tüm kullanıcı başarılarını getir
   */
  getAchievements: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const result = await pool.query(
        "SELECT * FROM achievements WHERE user_id = $1 ORDER BY achievement_date DESC",
        [userId]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Get achievements error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Yeni bir başarı ekle
   */
  createAchievement: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { achievement_type, description } = req.body;

      const newAchievement = await pool.query(
        `INSERT INTO achievements (user_id, achievement_type, description)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, achievement_type, description]
      );

      return res.status(201).json(newAchievement.rows[0]);
    } catch (error) {
      console.error("Create achievement error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  deleteAchievement: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const achievementId = req.params.achievement_id;

      // Achievement kullanıcıya ait mi kontrol
      const check = await pool.query(
        "SELECT * FROM achievements WHERE achievement_id = $1 AND user_id = $2",
        [achievementId, userId]
      );
      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Achievement not found or not yours" });
      }

      await pool.query("DELETE FROM achievements WHERE achievement_id = $1", [
        achievementId,
      ]);
      return res.status(200).json({ message: "Achievement deleted" });
    } catch (error) {
      console.error("Delete achievement error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
