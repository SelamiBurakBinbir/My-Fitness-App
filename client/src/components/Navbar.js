/************************************************************
 * client/src/components/Navbar.js
 ************************************************************/
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout(); // parent => localStorage.removeItem + setIsLoggedIn(false)
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link
          to="https://www.linkedin.com/in/selami-burak-binbir-746761234/"
          className="social-links"
        >
          <img src="images/linkedin.png" alt="LinkedIn-icon" height="25px" />
        </Link>
        <Link
          to="https://github.com/SelamiBurakBinbir"
          className="social-links"
        >
          <img src="images/github.png" alt="GitHub-icon" height="25px" />
        </Link>
        <Link className="home-margin" to="/">
          Home
        </Link>
      </div>
      <div className="navbar-right">
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}

        {isLoggedIn && <Link to="/profile">Profile</Link>}
        {isLoggedIn && <Link to="/goals">Goals</Link>}
        {isLoggedIn && <Link to="/calendar">Calendar</Link>}
        {isLoggedIn && <Link to="/achievements">Achievements</Link>}
        {isLoggedIn && <Link to="/habits">Habits</Link>}
        {isLoggedIn && <Link to="/exercises">Exercises</Link>}
        {isLoggedIn && <Link to="/workouts">Workouts</Link>}
        {isLoggedIn && <Link to="/meal-plans">Meal Plans</Link>}
        {isLoggedIn && <Link to="/progress">Progress</Link>}

        {isLoggedIn && (
          <button onClick={handleLogoutClick} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
