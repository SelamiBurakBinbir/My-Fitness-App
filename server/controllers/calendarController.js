/************************************************************
 * server/controllers/calendarController.js
 ************************************************************/
const pool = require("../dbConfig");

module.exports = {
  /**
   * Tüm calendar entries'i getir
   */
  getCalendarEntries: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const calendarData = await pool.query(
        `SELECT calendar_id, user_id, calendar_date, note
         FROM calendar
         WHERE user_id = $1
         ORDER BY calendar_date ASC`,
        [userId]
      );
      return res.status(200).json(calendarData.rows);
    } catch (error) {
      console.error("Get calendar error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Yeni bir takvim notu oluştur
   */
  createCalendarEntry: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { calendar_date, note } = req.body;

      const newCalEntry = await pool.query(
        `INSERT INTO calendar (user_id, calendar_date, note)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, calendar_date, note]
      );

      return res.status(201).json(newCalEntry.rows[0]);
    } catch (error) {
      console.error("Calendar create error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Takvim notunu sil
   */
  deleteCalendarEntry: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const calendarId = req.params.calendar_id;

      // Not gerçekten bu kullanıcıya mı ait?
      const check = await pool.query(
        "SELECT * FROM calendar WHERE calendar_id = $1 AND user_id = $2",
        [calendarId, userId]
      );
      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Calendar entry not found or not yours" });
      }

      await pool.query("DELETE FROM calendar WHERE calendar_id = $1", [
        calendarId,
      ]);
      return res.status(200).json({ message: "Calendar entry deleted" });
    } catch (error) {
      console.error("Delete calendar error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
