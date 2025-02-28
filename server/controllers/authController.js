/************************************************************
 * server/controllers/authController.js
 ************************************************************/
const pool = require("../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "SECRET_KEY_FOR_FITNESS_APP";

// Örnek bir default egzersiz listesi
const defaultExercises = [
  {
    exercise_name: "Push Up",
    exercise_desc: "Classic push-up for chest and triceps",
    muscle_group: "Chest",
    image_url:
      "https://images.squarespace-cdn.com/content/v1/58501b0cf5e23149e5589e12/1585601917653-J791ZN5ZWSK565NIZSS1/1_WZmDgcJO40Va5mVgdfbz7g%402x.jpeg",
  },
  {
    exercise_name: "Squat",
    exercise_desc: "Bodyweight squat for legs and glutes",
    muscle_group: "Legs",
    image_url:
      "https://static.strengthlevel.com/images/exercises/squat/squat-800.jpg",
  },
  {
    exercise_name: "Plank",
    exercise_desc: "Core exercise for abs",
    muscle_group: "Core",
    image_url:
      "https://blog.ssnsports.com.tr/wp-content/uploads/2020/11/plank-egzersizi-nedir.jpg",
  },
  // İstediğiniz sayıda ekleyebilirsiniz
];

module.exports = {
  /**
   * Kullanıcı kayıt (Register)
   */
  register: async (req, res) => {
    try {
      const { name, email, password, age, height, weight } = req.body;

      // Email kullanan var mı kontrol
      const userCheck = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ message: "Email already in use." });
      }

      // Parola hash
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Yeni kullanıcı ekle
      const newUser = await pool.query(
        `INSERT INTO users (name, email, password, age, height, weight)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING user_id, name, email`,
        [name, email, hashedPassword, age, height, weight]
      );

      const createdUser = newUser.rows[0];
      const userId = createdUser.user_id;

      // -- Şimdi varsayılan egzersizleri ekleyelim --
      for (const ex of defaultExercises) {
        await pool.query(
          `INSERT INTO exercises (user_id, exercise_name, exercise_desc, muscle_group, image_url)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            ex.exercise_name,
            ex.exercise_desc,
            ex.muscle_group,
            ex.image_url,
          ]
        );
      }

      return res.status(201).json({
        message: "User registered successfully",
        user: createdUser,
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  /**
   * Kullanıcı giriş (Login)
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const userQuery = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (userQuery.rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = userQuery.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
