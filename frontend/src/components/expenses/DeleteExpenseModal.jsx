import { AlertTriangle, X } from "lucide-react";

function DeleteExpenseModal({
  expense,
  onClose,
  onConfirm,
}) {
  if (!expense) {
    return null;
  }

  return (
    <div className="delete-modal-overlay">

      <div className="delete-modal">

        {/* Header */}

        <div className="delete-modal-header">

          <div className="delete-warning-icon">
            <AlertTriangle size={22} />
          </div>

          <button
            type="button"
            className="delete-modal-close"
            onClick={onClose}
          >
            <X size={19} />
          </button>

        </div>

        {/* Content */}

        <div className="delete-modal-content">

          <h2>
            Delete Expense?
          </h2>

          <p>
            Are you sure you want to delete this expense?
            This action cannot be undone.
          </p>

          <div className="delete-expense-preview">

            <div>

              <strong>
                {expense.category}
              </strong>

              <span>
                {expense.description}
              </span>

            </div>

            <strong>
              ₹{Number(expense.amount).toLocaleString("en-IN")}
            </strong>

          </div>

        </div>

        {/* Actions */}

        <div className="delete-modal-actions">

          <button
            type="button"
            className="delete-cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-confirm-button"
            onClick={onConfirm}
          >
            Delete Expense
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteExpenseModal;