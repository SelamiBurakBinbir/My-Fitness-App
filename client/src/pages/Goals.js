/************************************************************
 * client/src/pages/Goals.js
 ************************************************************/
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "../styles/CommonStyles.css";
import "./Modal.css"; // Modal CSS (aşağıda örnek)

function Goals() {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    goal_type: "",
    target_value: "",
    current_value: "",
    end_date: "",
  });

  // Modal görünürlüğü
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get("/goals");
      setGoals(response.data);
    } catch (error) {
      console.error("Fetch goals error:", error);
    }
  };

  // Modal aç/kapa
  const openModal = () => {
    // formu sıfırlayabilirsiniz
    setFormData({
      goal_type: "",
      target_value: "",
      current_value: "",
      end_date: "",
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  // Form input değişimi
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // “Save” -> POST /goals
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/goals", formData);
      setShowModal(false);
      fetchGoals();
    } catch (error) {
      console.error("Create goal error:", error);
    }
  };

  // Silme
  const handleDeleteGoal = async (goal_id) => {
    try {
      await axios.delete(`/goals/${goal_id}`);
      fetchGoals();
    } catch (error) {
      console.error("Delete goal error:", error);
    }
  };

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: "url('/images/goals.jpg')" }}
    >
      <div className="container">
        <h2 className="section-title">My Goals</h2>

        {/* “Add Goal” butonu */}
        <button className="submit-btn" onClick={openModal}>
          Add Goal
        </button>

        {/* Goals List */}
        <ul className="item-list" style={{ marginTop: "1rem" }}>
          {goals.length === 0 ? (
            <li>No goals data yet.</li>
          ) : (
            goals.map((goal) => (
              <li key={goal.goal_id}>
                <div>
                  <strong>{goal.goal_type}</strong> - Current:{" "}
                  {goal.current_value} / Target: {goal.target_value}{" "}
                  {goal.end_date &&
                    `(End: ${new Date(goal.end_date).toLocaleDateString()})`}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteGoal(goal.goal_id)}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add a New Goal</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Goal Type:</label>
                  <input
                    name="goal_type"
                    value={formData.goal_type}
                    onChange={handleChange}
                    placeholder="e.g. weight_loss, muscle_gain"
                  />
                </div>
                <div className="form-group">
                  <label>Target Value:</label>
                  <input
                    name="target_value"
                    type="number"
                    step="0.1"
                    value={formData.target_value}
                    onChange={handleChange}
                    placeholder="e.g. 70.0"
                  />
                </div>
                <div className="form-group">
                  <label>Current Value:</label>
                  <input
                    name="current_value"
                    type="number"
                    step="0.1"
                    value={formData.current_value}
                    onChange={handleChange}
                    placeholder="e.g. 75.0"
                  />
                </div>
                <div className="form-group">
                  <label>End Date:</label>
                  <input
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
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

export default Goals;
