/************************************************************
 * client/src/pages/CalendarPage.js
 ************************************************************/
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Paketle gelen CSS
import axios from "../utils/axiosInstance";
import "../styles/CommonStyles.css"; // Ortak stiller
import "./CalendarPage.css"; // Modal ve takvim ek stiller

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null); // Başlangıçta null
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");
  const [calendarEntries, setCalendarEntries] = useState([]);

  useEffect(() => {
    fetchCalendarEntries();
  }, []);

  // Tüm notları çek
  const fetchCalendarEntries = async () => {
    try {
      const response = await axios.get("/calendar");
      setCalendarEntries(response.data);
    } catch (error) {
      console.error("Get calendar entries error:", error);
    }
  };

  // Takvimde bir güne tıklayınca SADECE selectedDate güncellenir
  const handleDayClick = (date) => {
    setSelectedDate(date);
    // Otomatik modal açmıyoruz
  };

  // “Add Note” butonuna basınca modal açalım (eğer gün seçilmişse)
  const handleOpenModal = () => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }
    setNote("");
    setShowModal(true);
  };

  // Modal içinde “Save” -> not ekle
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      alert("Please enter a note.");
      return;
    }
    if (!selectedDate) {
      alert("No date selected.");
      setShowModal(false);
      return;
    }

    try {
      // Orijinal: const calendar_date = selectedDate.toISOString().split("T")[0];

      // 1) getTime() -> ms cinsinden epoch
      // 2) getTimezoneOffset() -> dakikalar cinsinden
      // 3) Düzeltilmiş Date oluşturup "YYYY-MM-DD" formatına çevir
      const localDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      await axios.post("/calendar", {
        calendar_date: localDate,
        note,
      });

      fetchCalendarEntries();
      setShowModal(false);
    } catch (error) {
      console.error("Add note error:", error);
    }
  };

  // Not sil
  const handleDelete = async (calendar_id) => {
    try {
      await axios.delete(`/calendar/${calendar_id}`);
      fetchCalendarEntries();
    } catch (error) {
      console.error("Delete note error:", error);
    }
  };

  // Seçili güne ait notlar
  let notesForSelectedDate = [];
  if (selectedDate) {
    const selectedDateStr = selectedDate.toISOString().split("T")[0];
    notesForSelectedDate = calendarEntries.filter((entry) => {
      const entryDateStr = new Date(entry.calendar_date)
        .toISOString()
        .split("T")[0];
      return entryDateStr === selectedDateStr;
    });
  }

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: "url('/images/calendar.jpg')" }}
    >
      <div className="container" style={{ maxWidth: "600px" }}>
        <h2 className="section-title">My Calendar</h2>

        <div className="calendar-container">
          <Calendar onClickDay={handleDayClick} value={selectedDate} />
        </div>

        {/* Buton: Add Note */}
        <div style={{ marginTop: "1rem" }}>
          <button className="submit-btn" onClick={handleOpenModal}>
            Add Note
          </button>
        </div>

        {/* Seçili güne ait notlar */}
        {selectedDate && (
          <div style={{ marginTop: "2rem" }}>
            <h4>Notes for: {selectedDate.toDateString()}</h4>
            {notesForSelectedDate.length === 0 ? (
              <p>No notes for this date.</p>
            ) : (
              <ul className="item-list">
                {notesForSelectedDate.map((entry) => (
                  <li key={entry.calendar_id}>
                    <div>{entry.note}</div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(entry.calendar_id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Note for {selectedDate?.toDateString()}</h3>
              <form onSubmit={handleAddNote}>
                <div className="form-group">
                  <label>Note:</label>
                  {/* Multiline <textarea> */}
                  <textarea
                    rows="5"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write your note here..."
                    style={{ width: "100%", resize: "vertical" }}
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setShowModal(false)}
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

export default CalendarPage;
