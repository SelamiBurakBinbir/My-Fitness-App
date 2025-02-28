/************************************************************
 * client/src/pages/Progress.js
 ************************************************************/
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "../styles/CommonStyles.css";
import "./Modal.css"; // Modal CSS

function Progress() {
  const [progressData, setProgressData] = useState([]);
  const [formData, setFormData] = useState({
    measurement_type: "",
    measurement_value: "",
    measurement_date: "",
  });

  // Modal görünürlüğü
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get("/progress");
      setProgressData(response.data);
    } catch (error) {
      console.error("Get progress error:", error);
    }
  };

  const openModal = () => {
    setFormData({
      measurement_type: "",
      measurement_value: "",
      measurement_date: "",
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  // Form input değişimi
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // “Save” -> POST /progress
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/progress", formData);
      setShowModal(false);
      fetchProgress();
    } catch (error) {
      console.error("Create progress error:", error);
    }
  };

  const handleDelete = async (progress_id) => {
    try {
      await axios.delete(`/progress/${progress_id}`);
      fetchProgress();
    } catch (error) {
      console.error("Delete progress error:", error);
    }
  };

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: "url('/images/progress.jpg')" }}
    >
      <div className="container">
        <h2 className="section-title">My Progress</h2>

        <button className="submit-btn" onClick={openModal}>
          Add Progress
        </button>

        <ul className="item-list" style={{ marginTop: "1rem" }}>
          {progressData.length === 0 ? (
            <li>No progress data yet.</li>
          ) : (
            progressData.map((p) => (
              <li key={p.progress_id}>
                <div>
                  <strong>{p.measurement_type}</strong>
                  {" - "}
                  {p.measurement_value}
                  {" on "}
                  {new Date(p.measurement_date).toLocaleDateString()}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p.progress_id)}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Modal for Add Progress */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Progress</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Measurement Type</label>
                  <input
                    name="measurement_type"
                    placeholder="e.g. weight, body_fat..."
                    value={formData.measurement_type}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Measurement Value</label>
                  <input
                    name="measurement_value"
                    type="number"
                    step="0.1"
                    value={formData.measurement_value}
                    onChange={handleChange}
                    placeholder="e.g. 65.0"
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    name="measurement_date"
                    type="date"
                    value={formData.measurement_date}
                    onChange={handleChange}
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

export default Progress;
