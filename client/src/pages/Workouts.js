/************************************************************
 * client/src/pages/Workouts.js
 ************************************************************/
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "../styles/CommonStyles.css";
import "./Modal.css"; // Modal CSS
import "./Workouts.css";

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkoutName, setNewWorkoutName] = useState("");

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);

  const [exerciseFormData, setExerciseFormData] = useState({
    exercise_id: "",
    sets: 3,
    reps: 10,
    rest_time: 60,
  });

  const [exercises, setExercises] = useState([]);

  // “Add Exercise” form görünürlüğü
  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);

  // **Modal** for “Add Workout”
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  useEffect(() => {
    fetchWorkouts();
    fetchExercises();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get("/workouts");
      setWorkouts(response.data);
    } catch (error) {
      console.error("Fetch workouts error:", error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get("/exercises");
      setExercises(response.data);
    } catch (error) {
      console.error("Fetch exercises error:", error);
    }
  };

  // Modal for "Add Workout"
  const openWorkoutModal = () => {
    setNewWorkoutName("");
    setShowWorkoutModal(true);
  };
  const closeWorkoutModal = () => {
    setShowWorkoutModal(false);
  };

  // Create workout (modal form submit)
  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkoutName.trim()) {
      alert("Please enter a workout name.");
      return;
    }
    try {
      await axios.post("/workouts", { workout_name: newWorkoutName });
      setShowWorkoutModal(false);
      fetchWorkouts();
    } catch (error) {
      console.error("Create workout error:", error);
    }
  };

  // BAŞLIĞA TIKLAMA: workout’u seç, verilerini getir, formu kapat
  const handleHeadingClick = async (workout) => {
    try {
      setSelectedWorkout(workout);
      setShowAddExerciseForm(false);
      const response = await axios.get(`/workouts/${workout.workout_id}`);
      setWorkoutExercises(response.data.exercises);
    } catch (error) {
      console.error("Fetch workout detail error:", error);
    }
  };

  // “Add” BUTONUNA TIKLAMA:
  // Eğer aynı workout seçiliyse sadece formu aç/kapa,
  // değilse workout’u seçip verileri getir ve formu aç.
  const handleShowAddExercise = async (workout) => {
    if (selectedWorkout && selectedWorkout.workout_id === workout.workout_id) {
      setShowAddExerciseForm((prev) => !prev);
    } else {
      try {
        setSelectedWorkout(workout);
        const response = await axios.get(`/workouts/${workout.workout_id}`);
        setWorkoutExercises(response.data.exercises);
        setShowAddExerciseForm(true);
      } catch (error) {
        console.error("Fetch workout detail error:", error);
      }
    }
  };

  // Workout sil
  const handleDeleteWorkout = async (workout_id) => {
    try {
      await axios.delete(`/workouts/${workout_id}`);
      if (selectedWorkout && selectedWorkout.workout_id === workout_id) {
        setSelectedWorkout(null);
        setWorkoutExercises([]);
      }
      fetchWorkouts();
    } catch (error) {
      console.error("Delete workout error:", error);
    }
  };

  // Ekleme formu input değişimi
  const handleExerciseChange = (e) => {
    setExerciseFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Workout’a exercise ekle
  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!selectedWorkout) return;
    if (!exerciseFormData.exercise_id) {
      alert("Please select an exercise.");
      return;
    }
    try {
      await axios.post(`/workouts/${selectedWorkout.workout_id}/exercises`, {
        ...exerciseFormData,
        sets: parseInt(exerciseFormData.sets),
        reps: parseInt(exerciseFormData.reps),
        rest_time: parseInt(exerciseFormData.rest_time),
      });
      const response = await axios.get(
        `/workouts/${selectedWorkout.workout_id}`
      );
      setWorkoutExercises(response.data.exercises);
      setExerciseFormData({
        exercise_id: "",
        sets: 3,
        reps: 10,
        rest_time: 60,
      });
    } catch (error) {
      console.error("Add exercise to workout error:", error);
    }
  };

  // Workout’tan exercise sil
  const handleRemoveExercise = async (we_id) => {
    if (!selectedWorkout) return;
    try {
      await axios.delete(
        `/workouts/${selectedWorkout.workout_id}/exercises/${we_id}`
      );
      const response = await axios.get(
        `/workouts/${selectedWorkout.workout_id}`
      );
      setWorkoutExercises(response.data.exercises);
    } catch (error) {
      console.error("Remove exercise error:", error);
    }
  };

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: "url('/images/workouts.jpg')" }}
    >
      <div className="container">
        <h2 className="section-title">My Workouts</h2>

        <button className="submit-btn" onClick={openWorkoutModal}>
          Add Workout
        </button>

        <ul className="item-list" style={{ marginTop: "1rem" }}>
          {workouts.length === 0 ? (
            <li>No workout data yet.</li>
          ) : (
            workouts.map((wo) => (
              <li key={wo.workout_id}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleHeadingClick(wo)}
                >
                  <strong className="hoverUnderline">{wo.workout_name}</strong>{" "}
                  {/* (id: {wo.workout_id}) */}
                </div>
                <div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteWorkout(wo.workout_id)}
                  >
                    Delete
                  </button>
                  <button
                    className="small-btn"
                    onClick={() => handleShowAddExercise(wo)}
                  >
                    Add
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {selectedWorkout && (
          <div style={{ marginTop: "2rem" }}>
            <h3>
              Workout: {selectedWorkout.workout_name}
              {/* (id: {selectedWorkout.workout_id}) */}
            </h3>

            {workoutExercises.length > 0 ? (
              <ul className="item-list">
                {workoutExercises.map((we) => (
                  <li key={we.we_id}>
                    <div>
                      <strong>{we.exercise_name}</strong> (
                      {we.muscle_group || "N/A"})
                      <br />
                      Sets: {we.sets}, Reps: {we.reps}, Rest: {we.rest_time} sec
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleRemoveExercise(we.we_id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No exercises yet.</p>
            )}

            {showAddExerciseForm && (
              <div style={{ marginTop: "1rem" }}>
                <h4 class="addSomething">Add an Exercise</h4>
                <form onSubmit={handleAddExercise}>
                  <div className="form-group">
                    <label>Select Exercise from Library</label>
                    <select
                      className="small-select"
                      name="exercise_id"
                      value={exerciseFormData.exercise_id}
                      onChange={handleExerciseChange}
                    >
                      <option value="">-- Select an exercise --</option>
                      {exercises.map((ex) => (
                        <option key={ex.exercise_id} value={ex.exercise_id}>
                          {ex.exercise_name} ({ex.muscle_group})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sets</label>
                    <input
                      name="sets"
                      type="number"
                      value={exerciseFormData.sets}
                      onChange={handleExerciseChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Reps</label>
                    <input
                      name="reps"
                      type="number"
                      value={exerciseFormData.reps}
                      onChange={handleExerciseChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Rest Time (sec)</label>
                    <input
                      name="rest_time"
                      type="number"
                      value={exerciseFormData.rest_time}
                      onChange={handleExerciseChange}
                    />
                  </div>
                  <div className="button-row">
                    <button type="submit" className="submit-btn small-save">
                      Save Exercise
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Modal for Add Workout */}
        {showWorkoutModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Workout</h3>
              <form onSubmit={handleCreateWorkout}>
                <div className="form-group">
                  <label>Workout Name</label>
                  <input
                    value={newWorkoutName}
                    onChange={(e) => setNewWorkoutName(e.target.value)}
                    placeholder="e.g. Upper Body..."
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
                  onClick={closeWorkoutModal}
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

export default Workouts;
