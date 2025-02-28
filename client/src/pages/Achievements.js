/************************************************************
 * client/src/pages/Achievements.js
 ************************************************************/
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "../styles/CommonStyles.css";
import "./Modal.css"; // Modal CSS

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [formData, setFormData] = useState({
    achievement_type: "",
    description: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get("/achievements");
      setAchievements(response.data);
    } catch (error) {
      console.error("Fetch achievements error:", error);
    }
  };

  const openModal = () => {
    setFormData({ achievement_type: "", description: "" });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Boş alan kontrolü
    if (!formData.achievement_type.trim()) {
      alert("Please enter an achievement title.");
      return;
    }

    try {
      await axios.post("/achievements", formData);
      fetchAchievements();
      setShowModal(false);
    } catch (error) {
      console.error("Create achievement error:", error);
    }
  };

  const handleDelete = async (achievement_id) => {
    try {
      await axios.delete(`/achievements/${achievement_id}`);
      fetchAchievements();
    } catch (error) {
      console.error("Delete achievement error:", error);
    }
  };

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: "url('/images/achievements.webp')" }}
    >
      <div className="container">
        <h2 className="section-title">My Achievements</h2>

        <button className="submit-btn" onClick={openModal}>
          Add Achievement
        </button>

        <ul className="item-list" style={{ marginTop: "1rem" }}>
          {achievements.length === 0 ? (
            <li>No achievements data yet.</li>
          ) : (
            achievements.map((ach) => (
              <li key={ach.achievement_id}>
                <span>
                  <strong>{ach.achievement_type}</strong> -{" "}
                  {ach.description ?? "No description"} (Date:{" "}
                  {new Date(ach.achievement_date).toLocaleDateString()})
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(ach.achievement_id)}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Achievement</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Achievement Type</label>
                  <input
                    name="achievement_type"
                    value={formData.achievement_type}
                    onChange={handleChange}
                    placeholder="e.g. Streak, Record..."
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Short description"
                  />
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  style={{ width: "100%" }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={closeModal}
                  style={{ width: "100%" }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Achievements;
