/************************************************************
 * server/controllers/userController.js
 ************************************************************/
const pool = require("../dbConfig");

module.exports = {
  // Profili getirme
  getProfile: async (req, res) => {
    try {
      const userId = req.user.user_id; // JWT'den geliyor
      const userQuery = await pool.query(
        "SELECT user_id, name, email, age, height, weight FROM users WHERE user_id = $1",
        [userId]
      );

      if (userQuery.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(userQuery.rows[0]);
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // Profili güncelleme
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { name, age, height, weight } = req.body;

      const updatedUser = await pool.query(
        `UPDATE users
         SET name = $1,
             age = $2,
             height = $3,
             weight = $4,
             updated_at = NOW()
         WHERE user_id = $5
         RETURNING user_id, name, email, age, height, weight`,
        [name, age, height, weight, userId]
      );

      if (updatedUser.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser.rows[0],
      });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.user.user_id;

      // Önce var mı diye kontrol et
      const checkUser = await pool.query(
        "SELECT user_id FROM users WHERE user_id = $1",
        [userId]
      );
      if (checkUser.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Sil
      await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);

      return res.status(200).json({ message: "User account deleted" });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
