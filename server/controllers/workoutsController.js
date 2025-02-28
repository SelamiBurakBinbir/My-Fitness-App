/************************************************************
 * server/controllers/workoutsController.js
 ************************************************************/
const pool = require("../dbConfig");

module.exports = {
  /**
   * Kullanıcının tüm workout planlarını getir
   */
  getWorkouts: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const workouts = await pool.query(
        "SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
      return res.status(200).json(workouts.rows);
    } catch (error) {
      console.error("Get workouts error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Yeni bir workout planı oluştur
   */
  createWorkout: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { workout_name } = req.body;

      const newWorkout = await pool.query(
        `INSERT INTO workouts (user_id, workout_name)
         VALUES ($1, $2)
         RETURNING *`,
        [userId, workout_name]
      );

      return res.status(201).json(newWorkout.rows[0]);
    } catch (error) {
      console.error("Create workout error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Belirli bir workout detayını egzersizlerle birlikte getir
   */
  getWorkoutDetail: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const workoutId = req.params.workout_id;

      // Workout kullanıcıya ait mi?
      const workoutCheck = await pool.query(
        "SELECT * FROM workouts WHERE workout_id = $1 AND user_id = $2",
        [workoutId, userId]
      );
      if (workoutCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Workout not found or not yours" });
      }

      // Workout exercises
      const exercises = await pool.query(
        `SELECT we.*, e.exercise_name, e.muscle_group, e.exercise_desc, e.image_url
         FROM workout_exercises we
         JOIN exercises e ON we.exercise_id = e.exercise_id
         WHERE we.workout_id = $1
         ORDER BY we.we_id ASC`,
        [workoutId]
      );

      return res.status(200).json({
        workout: workoutCheck.rows[0],
        exercises: exercises.rows,
      });
    } catch (error) {
      console.error("Get workout detail error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Workout’a egzersiz ekle
   */
  addExerciseToWorkout: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const workoutId = req.params.workout_id;
      const { exercise_id, sets, reps, rest_time } = req.body;

      // Workout kullanıcıya ait mi?
      const workoutCheck = await pool.query(
        "SELECT * FROM workouts WHERE workout_id = $1 AND user_id = $2",
        [workoutId, userId]
      );
      if (workoutCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Workout not found or not yours" });
      }

      const newEntry = await pool.query(
        `INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_time)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [workoutId, exercise_id, sets, reps, rest_time]
      );

      return res.status(201).json(newEntry.rows[0]);
    } catch (error) {
      console.error("Add exercise to workout error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Workout’tan bir egzersizi sil
   */
  removeExerciseFromWorkout: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const workoutId = req.params.workout_id;
      const weId = req.params.we_id;

      // Workout kullanıcıya ait mi?
      const workoutCheck = await pool.query(
        "SELECT * FROM workouts WHERE workout_id = $1 AND user_id = $2",
        [workoutId, userId]
      );
      if (workoutCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Workout not found or not yours" });
      }

      // Egzersiz var mı?
      const exerciseCheck = await pool.query(
        "SELECT * FROM workout_exercises WHERE we_id = $1 AND workout_id = $2",
        [weId, workoutId]
      );
      if (exerciseCheck.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Workout exercise not found for this workout" });
      }

      await pool.query("DELETE FROM workout_exercises WHERE we_id = $1", [
        weId,
      ]);
      return res.status(200).json({ message: "Exercise removed from workout" });
    } catch (error) {
      console.error("Remove exercise from workout error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  deleteWorkout: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const workoutId = req.params.workout_id;

      // Workout kullanıcıya mı ait?
      const check = await pool.query(
        "SELECT * FROM workouts WHERE workout_id = $1 AND user_id = $2",
        [workoutId, userId]
      );
      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Workout not found or not yours" });
      }

      // İlgili kaydı sil
      await pool.query("DELETE FROM workouts WHERE workout_id = $1", [
        workoutId,
      ]);
      return res.status(200).json({ message: "Workout deleted" });
    } catch (error) {
      console.error("Delete workout error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
