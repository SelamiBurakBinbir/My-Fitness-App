/************************************************************
 * client/src/pages/MealPlans.js
 ************************************************************/
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "../styles/CommonStyles.css";
import "./MealPlans.css";
import "./Modal.css"; // Modal CSS

function MealPlans() {
  const [mealPlans, setMealPlans] = useState([]);
  const [newPlanTitle, setNewPlanTitle] = useState("");

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mealEntries, setMealEntries] = useState([]);
  const [mealFormData, setMealFormData] = useState({
    meal_type: "",
    meal_desc: "",
  });

  // “Add Meal” form görünürlüğü
  const [showAddMealForm, setShowAddMealForm] = useState(false);

  // Modal: “Add Meal Plan”
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const result = await axios.get("/meal-plans");
      setMealPlans(result.data);
    } catch (error) {
      console.error("Get meal plans error:", error);
    }
  };

  // Modal Açma/Kapama
  const openMealPlanModal = () => {
    setNewPlanTitle("");
    setShowMealPlanModal(true);
  };
  const closeMealPlanModal = () => {
    setShowMealPlanModal(false);
  };

  // “Create Meal Plan” (modal form)
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!newPlanTitle.trim()) {
      alert("Please enter a plan title.");
      return;
    }
    try {
      await axios.post("/meal-plans", { title: newPlanTitle });
      setShowMealPlanModal(false);
      fetchMealPlans();
    } catch (error) {
      console.error("Create meal plan error:", error);
    }
  };

  // BAŞLIĞA TIKLAMA: planı seç, verileri getir, formu kapat
  const handleHeadingClick = async (plan) => {
    try {
      setSelectedPlan(plan);
      setShowAddMealForm(false);
      const response = await axios.get(`/meal-plans/${plan.meal_plan_id}`);
      setMealEntries(response.data.meals);
    } catch (error) {
      console.error("Get meal plan detail error:", error);
    }
  };

  // “Add” BUTONUNA TIKLAMA:
  // Eğer aynı plan seçiliyse sadece formu aç/kapa,
  // değilse planı seçip verileri getir ve formu aç.
  const handleShowMealForm = async (plan) => {
    if (selectedPlan && selectedPlan.meal_plan_id === plan.meal_plan_id) {
      setShowAddMealForm((prev) => !prev);
    } else {
      try {
        setSelectedPlan(plan);
        const response = await axios.get(`/meal-plans/${plan.meal_plan_id}`);
        setMealEntries(response.data.meals);
        setShowAddMealForm(true);
      } catch (error) {
        console.error("Get meal plan detail error:", error);
      }
    }
  };

  // Plan sil
  const handleDeleteMealPlan = async (meal_plan_id) => {
    try {
      await axios.delete(`/meal-plans/${meal_plan_id}`);
      if (selectedPlan && selectedPlan.meal_plan_id === meal_plan_id) {
        setSelectedPlan(null);
        setMealEntries([]);
      }
      fetchMealPlans();
    } catch (error) {
      console.error("Delete meal plan error:", error);
    }
  };

  // Meal form input
  const handleMealChange = (e) => {
    setMealFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Yeni meal ekle
  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    if (!mealFormData.meal_type.trim()) {
      alert("Please enter a meal type.");
      return;
    }
    try {
      await axios.post(
        `/meal-plans/${selectedPlan.meal_plan_id}/meals`,
        mealFormData
      );
      const response = await axios.get(
        `/meal-plans/${selectedPlan.meal_plan_id}`
      );
      setMealEntries(response.data.meals);
      setMealFormData({ meal_type: "", meal_desc: "" });
    } catch (error) {
      console.error("Create meal entry error:", error);
    }
  };

  // Meal sil
  const handleDeleteMealEntry = async (meal_entry_id) => {
    try {
      await axios.delete(
        `/meal-plans/${selectedPlan.meal_plan_id}/meals/${meal_entry_id}`
      );
      const response = await axios.get(
        `/meal-plans/${selectedPlan.meal_plan_id}`
      );
      setMealEntries(response.data.meals);
    } catch (error) {
      console.error("Delete meal entry error:", error);
    }
  };

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: "url('/images/meal.avif')" }}
    >
      <div className="container">
        <h2 className="section-title">My Meal Plans</h2>

        <button className="submit-btn" onClick={openMealPlanModal}>
          Add Meal Plan
        </button>

        <ul className="item-list" style={{ marginTop: "1rem" }}>
          {mealPlans.length === 0 ? (
            <li>No meal plan data yet.</li>
          ) : (
            mealPlans.map((plan) => (
              <li key={plan.meal_plan_id}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleHeadingClick(plan)}
                >
                  <strong className="hoverUnderline">{plan.title}</strong>
                  {/* (id: {plan.meal_plan_id}) */}
                </div>
                <div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMealPlan(plan.meal_plan_id)}
                  >
                    Delete
                  </button>
                  <button
                    className="small-btn"
                    onClick={() => handleShowMealForm(plan)}
                  >
                    Add
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {selectedPlan && (
          <div style={{ marginTop: "2rem" }}>
            <h3>
              Meal Plan: {selectedPlan.title}
              {/* (id: {selectedPlan.meal_plan_id}) */}
            </h3>

            {mealEntries.length === 0 ? (
              <p>No meals yet.</p>
            ) : (
              <ul className="item-list">
                {mealEntries.map((me) => (
                  <li key={me.meal_entry_id}>
                    <div>
                      <strong>{me.meal_type}:</strong> {me.meal_desc}
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteMealEntry(me.meal_entry_id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {showAddMealForm && (
              <div style={{ marginTop: "1rem" }}>
                <h4 class="addSomething">Add a Meal</h4>
                <form onSubmit={handleAddMeal}>
                  <div className="form-group">
                    <label>Meal Type</label>
                    <input
                      name="meal_type"
                      value={mealFormData.meal_type}
                      onChange={handleMealChange}
                      placeholder="Breakfast, Lunch..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Meal Description</label>
                    <input
                      name="meal_desc"
                      value={mealFormData.meal_desc}
                      onChange={handleMealChange}
                      placeholder="Describe the meal"
                    />
                  </div>
                  <div className="button-row">
                    <button type="submit" className="submit-btn small-save">
                      Save Meal
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Modal for Add Meal Plan */}
        {showMealPlanModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Meal Plan</h3>
              <form onSubmit={handleCreatePlan}>
                <div className="form-group">
                  <label>Plan Title</label>
                  <input
                    value={newPlanTitle}
                    onChange={(e) => setNewPlanTitle(e.target.value)}
                    placeholder="e.g. Weekly Diet..."
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
                  onClick={closeMealPlanModal}
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

export default MealPlans;
