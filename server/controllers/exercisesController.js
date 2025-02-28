/************************************************************
 * server/controllers/exercisesController.js
 ************************************************************/
const pool = require("../dbConfig");

module.exports = {
  /**
   * Kullanıcının egzersizlerini getir
   */
  getExercises: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const result = await pool.query(
        "SELECT * FROM exercises WHERE user_id = $1 ORDER BY exercise_name ASC",
        [userId]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Get exercises error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Yeni egzersiz ekle
   */
  createExercise: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { exercise_name, exercise_desc, muscle_group, image_url } =
        req.body;

      // Basit validasyon
      if (!exercise_name) {
        return res.status(400).json({ message: "Exercise name is required." });
      }

      const newExercise = await pool.query(
        `INSERT INTO exercises
         (user_id, exercise_name, exercise_desc, muscle_group, image_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, exercise_name, exercise_desc, muscle_group, image_url]
      );

      return res.status(201).json(newExercise.rows[0]);
    } catch (error) {
      console.error("Create exercise error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Egzersiz sil
   */
  deleteExercise: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const exerciseId = req.params.exercise_id;

      // Kullanıcıya mı ait?
      const check = await pool.query(
        "SELECT * FROM exercises WHERE exercise_id = $1 AND user_id = $2",
        [exerciseId, userId]
      );
      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Exercise not found or not yours" });
      }

      await pool.query("DELETE FROM exercises WHERE exercise_id = $1", [
        exerciseId,
      ]);
      return res.status(200).json({ message: "Exercise deleted" });
    } catch (error) {
      console.error("Delete exercise error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
