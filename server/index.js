/************************************************************
 * server/index.js
 * Ana Express sunucusu.
 ************************************************************/
require("dotenv").config(); // .env dosyasını okuyabilmek için
const express = require("express");
const cors = require("cors");
const app = express();

// .env üzerinden okunacak değişkenler
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET; // Örnek kullanım

// Orta katmanlar (middleware)
app.use(cors());
app.use(express.json());

// Rota dosyaları
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const goalsRoutes = require("./routes/goalsRoutes");
const achievementsRoutes = require("./routes/achievementsRoutes");
const habitsRoutes = require("./routes/habitsRoutes");
const exercisesRoutes = require("./routes/exercisesRoutes");
const workoutsRoutes = require("./routes/workoutsRoutes");
const mealPlansRoutes = require("./routes/mealPlansRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const progressRoutes = require("./routes/progressRoutes");

/**
 * Sağlık kontrolü (health check) veya basit test endpoint’i
 */
app.get("/", (req, res) => {
  res.send("Fitness App API is running...");
});

/**
 * Rota tanımlamaları
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/habits", habitsRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/meal-plans", mealPlansRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/progress", progressRoutes);

/**
 * Sunucuyu başlat
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`JWT_SECRET (for reference): ${JWT_SECRET}`);
});
