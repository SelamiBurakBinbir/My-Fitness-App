/************************************************************
 * client/src/pages/Habits.js
 ************************************************************/
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "../styles/CommonStyles.css";
import "./Habits.css"; // Modal ve tablo stil
import "./Modal.css"; // Genel modal stil (ayrıca ekledik)

function Habits() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");

  const [selectedHabit, setSelectedHabit] = useState(null);
  const [habitTracking, setHabitTracking] = useState([]);
  const [trackingFormData, setTrackingFormData] = useState({
    track_date: "",
    status: false,
  });

  // “Add Tracking” form görünürlüğü
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  // **Modal** görünürlüğü (Add Habit modal)
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("Fetch habits error:", error);
    }
  };

  // Modal Açma/Kapama
  const openAddHabitModal = () => {
    setNewHabitName("");
    setShowAddHabitModal(true);
  };

  const closeAddHabitModal = () => {
    setShowAddHabitModal(false);
  };

  // Yeni habit ekle (Modal form submit)
  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      alert("Please enter a habit name.");
      return;
    }
    try {
      await axios.post("/habits", { habit_name: newHabitName });
      setNewHabitName("");
      setShowAddHabitModal(false);
      fetchHabits();
    } catch (error) {
      console.error("Create habit error:", error);
    }
  };

  // (1) Başlığa tıklanırsa: seçili habit’i ata, tracking verisini getir, formu kapat
  const handleHeadingClick = async (habit) => {
    try {
      setSelectedHabit(habit);
      setShowTrackingForm(false);

      const response = await axios.get(`/habits/${habit.habit_id}/tracking`);
      setHabitTracking(response.data);
    } catch (error) {
      console.error("Fetch habit tracking error:", error);
    }
  };

  // (2) "Add" butonuna tıklanırsa:
  //    - Eğer aynı habit seçiliyse sadece formun görünürlüğünü değiştir (toggle).
  //    - Eğer farklı bir habit seçiliyse veya hiç seçili değilse önce habit'i seçip tracking verisini alır, ardından formu açar.
  const handleShowTrackingForm = async (habit) => {
    if (selectedHabit && selectedHabit.habit_id === habit.habit_id) {
      setShowTrackingForm((prev) => !prev);
    } else {
      try {
        setSelectedHabit(habit);
        const response = await axios.get(`/habits/${habit.habit_id}/tracking`);
        setHabitTracking(response.data);
        setShowTrackingForm(true);
      } catch (error) {
        console.error("Fetch habit tracking error:", error);
      }
    }
  };

  // Habit sil
  const handleDeleteHabit = async (habit_id) => {
    try {
      await axios.delete(`/habits/${habit_id}`);
      if (selectedHabit && selectedHabit.habit_id === habit_id) {
        setSelectedHabit(null);
        setHabitTracking([]);
      }
      fetchHabits();
    } catch (error) {
      console.error("Delete habit error:", error);
    }
  };

  // Tracking form inputları
  const handleTrackingChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setTrackingFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setTrackingFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Tracking kaydet
  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHabit) return;
    if (!trackingFormData.track_date) {
      alert("Please select a date for tracking.");
      return;
    }
    try {
      await axios.post(`/habits/${selectedHabit.habit_id}/tracking`, {
        track_date: trackingFormData.track_date,
        status: trackingFormData.status,
      });
      const response = await axios.get(
        `/habits/${selectedHabit.habit_id}/tracking`
      );
      setHabitTracking(response.data);
      setTrackingFormData({ track_date: "", status: false });
    } catch (error) {
      console.error("Habit tracking error:", error);
    }
  };

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: "url('/images/habits.jpg')" }}
    >
      <div className="container">
        <h2 className="section-title">My Habits</h2>

        {/* "Add Habit" Butonu (Modal açar) */}
        <button className="submit-btn" onClick={openAddHabitModal}>
          Add Habit
        </button>

        {/* Alışkanlık Listesi */}
        <ul className="item-list" style={{ marginTop: "1rem" }}>
          {habits.length === 0 ? (
            <li>No habit data yet.</li>
          ) : (
            habits.map((habit) => (
              <li key={habit.habit_id}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleHeadingClick(habit)}
                >
                  <strong className="hoverUnderline">{habit.habit_name}</strong>
                </div>
                <div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteHabit(habit.habit_id)}
                  >
                    Delete
                  </button>
                  <button
                    className="small-btn"
                    onClick={() => handleShowTrackingForm(habit)}
                  >
                    Add
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {selectedHabit && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Habit Tracking for: {selectedHabit.habit_name}</h3>
            {habitTracking.length === 0 ? (
              <p>No tracking data yet.</p>
            ) : (
              <table className="habit-tracking-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {habitTracking.map((t) => (
                    <tr key={t.tracking_id}>
                      <td>
                        {t.track_date
                          ? new Date(t.track_date).toLocaleDateString()
                          : ""}
                      </td>
                      <td>{t.status ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Add Tracking Form */}
            {showTrackingForm && (
              <div style={{ marginTop: "1rem" }}>
                <h4 class="addSomething">Add Tracking</h4>
                <form onSubmit={handleTrackingSubmit}>
                  <div className="form-group">
                    <label>Date:</label>
                    <input
                      type="date"
                      name="track_date"
                      value={trackingFormData.track_date}
                      onChange={handleTrackingChange}
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <label>Status (Completed ?):</label>
                    <input
                      type="checkbox"
                      name="status"
                      checked={trackingFormData.status}
                      onChange={handleTrackingChange}
                      style={{
                        width: "30px",
                        height: "30px",
                      }}
                    />
                  </div>
                  <div className="button-row">
                    <button type="submit" className="submit-btn">
                      Save Tracking
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* MODAL: Add Habit */}
        {showAddHabitModal && (
          <div className="modal-overlay">
            <div className="modal-content habit-modal">
              <h3>Add a New Habit</h3>
              <form onSubmit={handleCreateHabit}>
                <div className="form-group">
                  <label>Habit Name:</label>
                  <input
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="e.g. Drink water"
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
                  onClick={closeAddHabitModal}
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

export default Habits;
