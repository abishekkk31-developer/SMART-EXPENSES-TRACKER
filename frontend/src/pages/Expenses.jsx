import { useEffect, useState } from "react";

import { formatCurrency } from "../utils/currency";

import {
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../api/expenseApi";

import {
  Plus,
  Search,
  Filter,
  Utensils,
  Car,
  ShoppingBag,
  Film,
  MoreVertical,
} from "lucide-react";

import AddExpenseModal from "../components/expenses/AddExpenseModal";
import DeleteExpenseModal from "../components/expenses/DeleteExpenseModal";
import EditExpenseModal from "../components/expenses/EditExpenseModal";

import "../styles/Expenses.css";

function Expenses() {
  // ==========================================
  // STATE
  // ==========================================

  const [showAddExpense, setShowAddExpense] =
    useState(false);

  const [expenseToDelete, setExpenseToDelete] =
    useState(null);

  const [expenseToEdit, setExpenseToEdit] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // GET ICON BASED ON CATEGORY
  // ==========================================

  const getExpenseIcon = (category) => {
    switch (category) {
      case "Food & Dining":
        return Utensils;

      case "Transportation":
        return Car;

      case "Shopping":
        return ShoppingBag;

      case "Entertainment":
        return Film;

      default:
        return MoreVertical;
    }
  };

  // ==========================================
  // LOAD EXPENSES
  // ==========================================

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getExpenses();

      const expenseList =
        Array.isArray(data)
          ? data
          : [];

      const expensesWithIcons =
        expenseList.map(
          (expense) => ({
            ...expense,
            icon: getExpenseIcon(
              expense.category
            ),
          })
        );

      setExpenses(
        expensesWithIcons
      );

    } catch (error) {
      console.error(
        "Error loading expenses:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to load expenses"
      );

      setExpenses([]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA + GLOBAL SYNC
  // ==========================================

  useEffect(() => {
    loadExpenses();

    // ========================================
    // REFRESH WHEN EXPENSE CHANGES
    // ========================================

    const handleExpensesUpdated = () => {
      loadExpenses();
    };

    window.addEventListener(
      "expensesUpdated",
      handleExpensesUpdated
    );

    // ========================================
    // REFRESH WHEN WINDOW GETS FOCUS
    // ========================================

    const handleFocus = () => {
      loadExpenses();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "expensesUpdated",
        handleExpensesUpdated
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  // ==========================================
  // UPDATE EXPENSE
  // ==========================================

  const handleUpdateExpense = async (
    updatedExpense
  ) => {
    try {
      const savedExpense =
        await updateExpense(
          updatedExpense.id,
          {
            category:
              updatedExpense.category,

            description:
              updatedExpense.description,

            amount:
              Number(
                updatedExpense.amount
              ),

            date:
              updatedExpense.date,
          }
        );

      const expenseWithIcon = {
        ...savedExpense,

        icon: getExpenseIcon(
          savedExpense.category
        ),
      };

      setExpenses(
        (previousExpenses) =>
          previousExpenses.map(
            (expense) =>
              expense.id ===
              savedExpense.id
                ? expenseWithIcon
                : expense
          )
      );

      setExpenseToEdit(null);

    } catch (error) {
      console.error(
        "Error updating expense:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update expense"
      );
    }
  };

  // ==========================================
  // DELETE EXPENSE
  // ==========================================

  const handleDeleteExpense =
    async () => {
      if (!expenseToDelete) {
        return;
      }

      try {
        await deleteExpense(
          expenseToDelete.id
        );

        setExpenses(
          (previousExpenses) =>
            previousExpenses.filter(
              (expense) =>
                expense.id !==
                expenseToDelete.id
            )
        );

        setExpenseToDelete(null);

      } catch (error) {
        console.error(
          "Error deleting expense:",
          error
        );

        alert(
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to delete expense"
        );
      }
    };

  // ==========================================
  // FILTER EXPENSES
  // ==========================================

  const filteredExpenses =
    expenses.filter(
      (expense) => {
        const category =
          expense.category || "";

        const description =
          expense.description || "";

        const search =
          searchTerm
            .toLowerCase()
            .trim();

        const matchesSearch =
          category
            .toLowerCase()
            .includes(search) ||
          description
            .toLowerCase()
            .includes(search);

        const matchesCategory =
          selectedCategory ===
            "All" ||
          category ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  // ==========================================
  // TOTAL EXPENSES
  // ==========================================

  const totalExpenses =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );

  // ==========================================
  // THIS MONTH EXPENSES
  // ==========================================

  const currentDate =
    new Date();

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();

  const thisMonthExpenses =
    expenses
      .filter(
        (expense) => {
          if (!expense.date) {
            return false;
          }

          const expenseDate =
            new Date(
              expense.date
            );

          if (
            Number.isNaN(
              expenseDate.getTime()
            )
          ) {
            return false;
          }

          return (
            expenseDate.getMonth() ===
              currentMonth &&
            expenseDate.getFullYear() ===
              currentYear
          );
        }
      )
      .reduce(
        (total, expense) =>
          total +
          Number(
            expense.amount || 0
          ),
        0
      );

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="expenses-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="expenses-page-header">

        <div>

          <h1>
            Expenses
          </h1>

          <p>
            Track and manage your expenses.
          </p>

        </div>

        <button
          type="button"
          className="expenses-add-button"
          onClick={() =>
            setShowAddExpense(true)
          }
        >

          <Plus size={18} />

          <span>
            Add Expense
          </span>

        </button>

      </div>

      {/* ======================================
          FILTER TOOLBAR
      ====================================== */}

      <div className="expenses-toolbar">

        <div className="expenses-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>

        <div className="expenses-filter-wrapper">

          <Filter size={17} />

          <select
            value={
              selectedCategory
            }
            onChange={(event) =>
              setSelectedCategory(
                event.target.value
              )
            }
          >

            <option value="All">
              All Categories
            </option>

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

      </div>

      {/* ======================================
          EXPENSE SUMMARY
      ====================================== */}

      <div className="expenses-summary">

        <div className="expense-summary-item">

          <span>
            Total Expenses
          </span>

          <strong>
            {formatCurrency(
              totalExpenses
            )}
          </strong>

        </div>

        <div className="expense-summary-item">

          <span>
            This Month
          </span>

          <strong>
            {formatCurrency(
              thisMonthExpenses
            )}
          </strong>

        </div>

        <div className="expense-summary-item">

          <span>
            Transactions
          </span>

          <strong>
            {expenses.length}
          </strong>

        </div>

      </div>

      {/* ======================================
          EXPENSE TABLE
      ====================================== */}

      <div className="expenses-container">

        <div className="expenses-container-header">

          <div>

            <h2>
              All Expenses
            </h2>

            <p>
              Your recent transactions
            </p>

          </div>

        </div>

        <div className="expenses-list">

          {/* TABLE HEADER */}

          <div className="expense-table-header">

            <span>
              Expense
            </span>

            <span>
              Date
            </span>

            <span>
              Amount
            </span>

            <span />

          </div>

          {/* LOADING */}

          {loading && (

            <div className="no-expenses">

              <p>
                Loading expenses...
              </p>

            </div>

          )}

          {/* ERROR */}

          {!loading &&
            error && (

              <div className="no-expenses">

                <h3>
                  Unable to load expenses
                </h3>

                <p>
                  {error}
                </p>

              </div>

            )}

          {/* NO EXPENSES */}

          {!loading &&
            !error &&
            filteredExpenses.length ===
              0 && (

              <div className="no-expenses">

                <Search size={24} />

                <h3>
                  No expenses found
                </h3>

                <p>
                  Try adding an expense
                  or changing your filters.
                </p>

              </div>

            )}

          {/* EXPENSE ROWS */}

          {!loading &&
            !error &&
            filteredExpenses.map(
              (expense) => {

                const Icon =
                  expense.icon ||
                  getExpenseIcon(
                    expense.category
                  );

                return (

                  <div
                    className="expense-table-row"
                    key={
                      expense.id
                    }
                  >

                    {/* EXPENSE INFO */}

                    <div className="expense-table-info">

                      <div className="expense-table-icon">

                        <Icon size={18} />

                      </div>

                      <div>

                        <h3>
                          {expense.category ||
                            "Expense"}
                        </h3>

                        <p>
                          {expense.description ||
                            "No description"}
                        </p>

                      </div>

                    </div>

                    {/* DATE */}

                    <div className="expense-date">

                      {formatDate(
                        expense.date
                      )}

                    </div>

                    {/* AMOUNT */}

                    <div className="expense-table-amount">

                      {formatCurrency(
                        expense.amount
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="expense-actions">

                      <button
                        type="button"
                        className="expense-edit-button"
                        onClick={() =>
                          setExpenseToEdit(
                            expense
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="expense-menu-button"
                        onClick={() =>
                          setExpenseToDelete(
                            expense
                          )
                        }
                        title="Delete expense"
                      >

                        <MoreVertical
                          size={18}
                        />

                      </button>

                    </div>

                  </div>
                );
              }
            )}

        </div>

      </div>

      {/* ======================================
          ADD EXPENSE MODAL
      ====================================== */}

      {showAddExpense && (

        <AddExpenseModal
          onClose={() =>
            setShowAddExpense(
              false
            )
          }
          onExpenseAdded={() => {
            loadExpenses();
          }}
        />

      )}

      {/* ======================================
          DELETE EXPENSE MODAL
      ====================================== */}

      {expenseToDelete && (

        <DeleteExpenseModal
          expense={
            expenseToDelete
          }

          onClose={() =>
            setExpenseToDelete(
              null
            )
          }

          onConfirm={
            handleDeleteExpense
          }
        />

      )}

      {/* ======================================
          EDIT EXPENSE MODAL
      ====================================== */}

      {expenseToEdit && (

        <EditExpenseModal
          expense={
            expenseToEdit
          }

          onClose={() =>
            setExpenseToEdit(
              null
            )
          }

          onSave={
            handleUpdateExpense
          }

        />

      )}

    </div>
  );
}

export default Expenses;