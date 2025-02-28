/************************************************************
 * server/controllers/habitsController.js
 ************************************************************/
const pool = require("../dbConfig");

module.exports = {
  /**
   * Kullanıcının tüm alışkanlıklarını getir
   */
  getHabits: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const result = await pool.query(
        "SELECT * FROM habits WHERE user_id = $1",
        [userId]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Get habits error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Yeni bir alışkanlık oluştur
   */
  createHabit: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { habit_name } = req.body;

      const newHabit = await pool.query(
        `INSERT INTO habits (user_id, habit_name)
         VALUES ($1, $2)
         RETURNING *`,
        [userId, habit_name]
      );

      return res.status(201).json(newHabit.rows[0]);
    } catch (error) {
      console.error("Create habit error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Bir alışkanlığı sil
   */
  deleteHabit: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const habitId = req.params.habit_id;

      // Kullanıcıya ait mi kontrol et
      const check = await pool.query(
        "SELECT * FROM habits WHERE habit_id = $1 AND user_id = $2",
        [habitId, userId]
      );
      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Habit not found or not yours" });
      }

      await pool.query("DELETE FROM habits WHERE habit_id = $1", [habitId]);

      return res.status(200).json({ message: "Habit deleted" });
    } catch (error) {
      console.error("Delete habit error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Belirli alışkanlığın tüm gün kayıtlarını getir
   */
  getHabitTracking: async (req, res) => {
    try {
      const habitId = req.params.habit_id;
      const userId = req.user.user_id;

      // Kullanıcıya ait mi kontrol
      const check = await pool.query(
        "SELECT * FROM habits WHERE habit_id = $1 AND user_id = $2",
        [habitId, userId]
      );
      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Habit not found or not yours" });
      }

      const tracking = await pool.query(
        "SELECT * FROM habit_tracking WHERE habit_id = $1 ORDER BY track_date DESC",
        [habitId]
      );

      return res.status(200).json(tracking.rows);
    } catch (error) {
      console.error("Get habit tracking error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Belirli bir gün için alışkanlık kaydı ekle veya güncelle
   */
  upsertHabitTracking: async (req, res) => {
    try {
      const habitId = req.params.habit_id;
      const userId = req.user.user_id;
      const { track_date, status } = req.body; // status: boolean

      // Kullanıcıya ait mi kontrol
      const check = await pool.query(
        "SELECT * FROM habits WHERE habit_id = $1 AND user_id = $2",
        [habitId, userId]
      );
      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Habit not found or not yours" });
      }

      // Aynı tarihte kayıt var mı?
      const existing = await pool.query(
        "SELECT * FROM habit_tracking WHERE habit_id = $1 AND track_date = $2",
        [habitId, track_date]
      );

      if (existing.rows.length === 0) {
        // Insert
        const newRecord = await pool.query(
          `INSERT INTO habit_tracking (habit_id, track_date, status)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [habitId, track_date, status]
        );
        return res.status(201).json(newRecord.rows[0]);
      } else {
        // Update
        const updatedRecord = await pool.query(
          `UPDATE habit_tracking
           SET status = $1
           WHERE tracking_id = $2
           RETURNING *`,
          [status, existing.rows[0].tracking_id]
        );
        return res.status(200).json(updatedRecord.rows[0]);
      }
    } catch (error) {
      console.error("Habit tracking error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
