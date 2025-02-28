/************************************************************
 * client/src/pages/Profile.js
 ************************************************************/
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/CommonStyles.css";

function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users/profile");
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!profile) return;
    setEditFormData({
      name: profile.name || "",
      age: profile.age ? profile.age.toString() : "",
      height: profile.height ? profile.height.toString() : "",
      weight: profile.weight ? profile.weight.toString() : "",
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!editFormData.name.trim()) {
        alert("Name cannot be empty");
        return;
      }
      await axios.put("/users/profile", {
        name: editFormData.name,
        age: parseInt(editFormData.age) || null,
        height: parseFloat(editFormData.height) || null,
        weight: parseFloat(editFormData.weight) || null,
      });
      fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete("/users/profile");
      // localStorage.removeItem("fitness_app_token"); // ANCAK biz parent'ta da yapıyoruz
      if (onLogout) {
        onLogout(); // <-- App.js'teki handleLogout() tetiklenir => isLoggedIn=false
      }
      navigate("/login");
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Failed to delete account.");
    }
  };

  if (loading) return <div style={{ margin: "2rem" }}>Loading...</div>;
  if (!profile) return <div style={{ margin: "2rem" }}>Profile not found.</div>;

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: "url('/images/profile.jpg')" }}
    >
      <div className="container" style={{ maxWidth: "500px" }}>
        <h2 className="section-title">My Profile</h2>

        {!isEditing && (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Name:</strong> {profile.name}
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Email:</strong> {profile.email}
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Age:</strong> {profile.age || "--"}
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Height:</strong>{" "}
              {typeof profile.height === "number" ||
              !isNaN(Number(profile.height))
                ? `${Number(profile.height).toFixed(1)} cm`
                : "--"}
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Weight:</strong>{" "}
              {typeof profile.weight === "number" ||
              !isNaN(Number(profile.weight))
                ? `${Number(profile.weight).toFixed(1)} kg`
                : "--"}
            </p>
            <button
              className="submit-btn"
              style={{ marginTop: "1rem", marginRight: "0.5rem" }}
              onClick={handleEdit}
            >
              Edit Profile
            </button>
            <button
              className="delete-btn"
              style={{ marginTop: "1rem" }}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        )}

        {isEditing && (
          <form
            onSubmit={handleSave}
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={editFormData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                name="age"
                type="number"
                value={editFormData.age}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input
                name="height"
                type="number"
                step="0.1"
                value={editFormData.height}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                name="weight"
                type="number"
                step="0.1"
                value={editFormData.weight}
                onChange={handleChange}
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button type="submit" className="submit-btn">
                Save
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={handleCancel}
                style={{ marginLeft: "0.5rem" }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
