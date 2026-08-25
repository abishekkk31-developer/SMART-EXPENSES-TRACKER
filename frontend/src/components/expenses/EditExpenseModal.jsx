import { useState } from "react";
import { X } from "lucide-react";

function EditExpenseModal({ expense, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: expense.id,
    amount: expense.amount || "",
    category: expense.category || "Food & Dining",
    description: expense.description || "",
    date: expense.date
      ? expense.date.split("T")[0]
      : "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <div className="edit-modal-overlay">

      <div className="edit-expense-modal">

        <div className="edit-modal-header">

          <div>
            <h2>Edit Expense</h2>

            <p>Update your expense details.</p>
          </div>

          <button
            type="button"
            className="edit-close-button"
            onClick={onClose}
          >
            <X size={22} />
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="edit-form-group">

            <label>Amount</label>

            <div className="edit-input-wrapper">

              <span>₹</span>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="1"
                step="0.01"
                required
              />

            </div>

          </div>

          <div className="edit-form-group">

            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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

              <option value="Bills">
                Bills
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

          <div className="edit-form-group">

            <label>Description</label>

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

          </div>

          <div className="edit-form-group">

            <label>Date</label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

          </div>

          <div className="edit-modal-actions">

            <button
              type="button"
              className="edit-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-button"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditExpenseModal;