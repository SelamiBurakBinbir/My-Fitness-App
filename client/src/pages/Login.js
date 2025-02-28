/************************************************************
 * client/src/pages/Login.js
 ************************************************************/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import "./Login.css"; // Stil dosyası

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");
      const response = await axios.post("/auth/login", formData);
      // localStorage token kaydet
      localStorage.setItem("fitness_app_token", response.data.token);

      // App.js içindeki setIsLoggedIn(true) tetiklenecek:
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Profili görüntüle
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong.");
      }
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: "url('/images/loginorregister.jpg')" }}
    >
      <div className="login-form-container">
        <h2>Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
