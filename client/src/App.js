/************************************************************
 * client/src/App.js
 ************************************************************/
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Goals from "./pages/Goals";
import CalendarPage from "./pages/CalendarPage";
import Achievements from "./pages/Achievements";
import Habits from "./pages/Habits";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import Workouts from "./pages/Workouts";
import MealPlans from "./pages/MealPlans";
import Progress from "./pages/Progress";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("fitness_app_token")
  );

  // LOGOUT: token sil + isLoggedIn = false
  const handleLogout = () => {
    localStorage.removeItem("fitness_app_token");
    setIsLoggedIn(false);
  };

  // (Opsiyonel) LOGIN: token ekleyince isLoggedIn = true
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/home.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* Navbar’a isLoggedIn ve onLogout veriyoruz */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/register" element={<Register />} />
        {/* Private Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              {/* Profile'a da onLogout prop'u gönderebiliriz */}
              <Profile onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <CalendarPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <PrivateRoute>
              <Achievements />
            </PrivateRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <PrivateRoute>
              <Habits />
            </PrivateRoute>
          }
        />
        <Route
          path="/exercises"
          element={
            <PrivateRoute>
              <ExerciseLibrary />
            </PrivateRoute>
          }
        />
        <Route
          path="/workouts"
          element={
            <PrivateRoute>
              <Workouts />
            </PrivateRoute>
          }
        />
        <Route
          path="/meal-plans"
          element={
            <PrivateRoute>
              <MealPlans />
            </PrivateRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <PrivateRoute>
              <Progress />
            </PrivateRoute>
          }
        />
        {/* Root (Default) */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <div
                style={{
                  marginLeft: "20px",
                  marginTop: "20px",
                  color: "#fff",
                  width: "800px",
                }}
              >
                <h2
                  style={{
                    color: "#fff",
                    marginBottom: "20px",
                    fontSize: "40px",
                  }}
                >
                  Welcome back to Fitness App! We're here to support you on your
                  fitness journey.
                </h2>
                <div style={{ fontSize: "20px" }}>
                  <p style={{ marginBottom: "10px" }}>
                    <b>Profile:</b> Manage your personal information.
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <b>Goals:</b> Set and track your fitness objectives.
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <b>Calendar:</b> View your workout and meal schedules.
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <b>Achievements:</b> Review the milestones you've reached.
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <b>Habits:</b> Track your healthy habits.
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <b>Exercises:</b> Browse our exercise library and more.
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <b>Workouts:</b> Create your own workout programs.
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <b>Meal Plans:</b> View your personalized meal plans.
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <b>Progress:</b> Monitor your progress.
                  </p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginLeft: "20px",
                  marginTop: "20px",
                  color: "#fff",
                  width: "900px",
                }}
              >
                <h1
                  style={{
                    color: "#fff",
                    marginBottom: "20px",
                    fontSize: "40px",
                  }}
                >
                  Start Your Healthy Journey Today!
                </h1>
                <h2 style={{ color: "#fff", marginBottom: "20px" }}>
                  Looking to achieve your personal fitness and health goals with
                  ease? You’ve come to the right place with Fitness App! Whether
                  you're a beginner or a fitness enthusiast, our comprehensive
                  tool offers everything you need to stay on track:
                </h2>
                <p style={{ marginBottom: "5px" }}>
                  <b>Personalized Nutrition Plans:</b> Create customized meal
                  plans and manage your daily intake effortlessly.
                </p>

                <p style={{ marginBottom: "5px" }}>
                  <b>Extensive Exercise Library:</b> Explore a wide variety of
                  exercises with detailed descriptions and visuals for all
                  fitness levels.
                </p>

                <p style={{ marginBottom: "5px" }}>
                  <b>Custom Workout Programs:</b> Design and organize workout
                  routines tailored to your specific goals.
                </p>

                <p style={{ marginBottom: "5px" }}>
                  <b>Goal Setting & Progress Tracking:</b> Set your fitness
                  objectives and monitor your progress with intuitive metrics.
                </p>

                <p>
                  <b>Habit Tracking & Rewards:</b> Build healthy habits and stay
                  motivated with habit trackers and achievement rewards.
                </p>
                <h3 style={{ color: "#fff", marginTop: "20px" }}>
                  Experience a user-friendly interface optimized for your
                  computer, making it easy to plan, track, and achieve your
                  health goals from the comfort of your home or office. Ready to
                  take the first step towards a healthier you?{" "}
                  <b>Join Now and Transform Your Life!</b>
                </h3>
              </div>
            )
          }
        />
        ;
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  );
}

export default App;
