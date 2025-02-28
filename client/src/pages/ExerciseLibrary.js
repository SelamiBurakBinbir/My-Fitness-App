/************************************************************
 * client/src/pages/ExerciseLibrary.js
 ************************************************************/
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "../styles/CommonStyles.css";
import "./Modal.css"; // Modal CSS

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    exercise_name: "",
    exercise_desc: "",
    muscle_group: "",
    image_url: "",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get("/exercises");
      setExercises(response.data);
    } catch (error) {
      console.error("Fetch exercises error:", error);
    }
  };

  const openModal = () => {
    setFormData({
      exercise_name: "",
      exercise_desc: "",
      muscle_group: "",
      image_url: "",
    });
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
    try {
      await axios.post("/exercises", formData);
      setShowModal(false);
      fetchExercises();
    } catch (error) {
      console.error("Create exercise error:", error);
    }
  };

  const handleDelete = async (exercise_id) => {
    try {
      await axios.delete(`/exercises/${exercise_id}`);
      fetchExercises();
    } catch (error) {
      console.error("Delete exercise error:", error);
    }
  };

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: "url('/images/exercises.jpg')" }}
    >
      <div className="container">
        <h2 className="section-title">Exercise Library</h2>

        <button className="submit-btn" onClick={openModal}>
          Add Exercise
        </button>

        <ul className="item-list" style={{ marginTop: "1rem" }}>
          {exercises.map((ex) => (
            <li key={ex.exercise_id}>
              <div>
                <strong>{ex.exercise_name}</strong> ({ex.muscle_group || "N/A"})
                {ex.image_url && (
                  <>
                    <br />
                    <img
                      src={ex.image_url}
                      alt={ex.exercise_name}
                      width="100"
                      style={{ marginTop: "0.5rem" }}
                    />
                  </>
                )}
                <br />
                <em>{ex.exercise_desc}</em>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(ex.exercise_id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Exercise</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Exercise Name</label>
                  <input
                    name="exercise_name"
                    value={formData.exercise_name}
                    onChange={handleChange}
                    placeholder="Push-up, Squat..."
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    name="exercise_desc"
                    value={formData.exercise_desc}
                    onChange={handleChange}
                    placeholder="Short description"
                  />
                </div>
                <div className="form-group">
                  <label>Muscle Group</label>
                  <input
                    name="muscle_group"
                    value={formData.muscle_group}
                    onChange={handleChange}
                    placeholder="Chest, Legs, etc."
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="Optional image link"
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

export default ExerciseLibrary;
