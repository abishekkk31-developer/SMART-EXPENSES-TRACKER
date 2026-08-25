import { useState } from "react";

import { X } from "lucide-react";

import { addExpense } from "../../api/expenseapi";

function AddExpenseModal({
  onClose,
  onExpenseAdded,
}) {
  const [formData, setFormData] =
    useState({
      amount: "",
      category: "Food & Dining",
      description: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );
  };

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    // ========================================
    // VALIDATION
    // ========================================

    if (
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      setError(
        "Please enter a valid amount."
      );

      return;
    }

    if (
      !formData.description.trim()
    ) {
      setError(
        "Please enter a description."
      );

      return;
    }

    if (!formData.date) {
      setError(
        "Please select a date."
      );

      return;
    }

    setLoading(true);

    try {
      const expenseData = {
        category:
          formData.category,

        description:
          formData.description.trim(),

        amount:
          Number(formData.amount),

        date:
          formData.date,
      };

      const newExpense =
        await addExpense(
          expenseData
        );

      if (onExpenseAdded) {
        onExpenseAdded(
          newExpense
        );
      }

      onClose();

    } catch (err) {
      console.error(
        "ADD EXPENSE ERROR:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to add expense. Please try again.";

      setError(
        typeof errorMessage ===
          "string"
          ? errorMessage
          : "Failed to add expense. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="expense-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="modal-header">

          <div>

            <h2>
              Add New Expense
            </h2>

            <p>
              Add a new transaction to your expenses.
            </p>

          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
        >

          {/* AMOUNT */}

          <div className="input-group">

            <label>
              Amount
            </label>

            <div className="input-wrapper">

              <span>
                ₹
              </span>

              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={
                  formData.amount
                }
                onChange={
                  handleChange
                }
                min="1"
                step="0.01"
                required
              />

            </div>

          </div>

          {/* CATEGORY */}

          <div className="input-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={
                formData.category
              }
              onChange={
                handleChange
              }
              required
            >

              <option value="Food & Dining">
                Food & Dining
              </option>

              <option value="Transportation">
                Transportation
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Entertainment">
                Entertainment
              </option>

              <option value="Bills & Utilities">
                Bills & Utilities
              </option>

              <option value="Health">
                Health
              </option>

              <option value="Education">
                Education
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* DESCRIPTION */}

          <div className="input-group">

            <label>
              Description
            </label>

            <input
              type="text"
              name="description"
              placeholder="Enter description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          {/* DATE */}

          <div className="input-group">

            <label>
              Date
            </label>

            <input
              type="date"
              name="date"
              value={
                formData.date
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          {/* ACTIONS */}

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-expense-button"
              disabled={loading}
            >
              {loading
                ? "Adding..."
                : "Add Expense"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddExpenseModal;