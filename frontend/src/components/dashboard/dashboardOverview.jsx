import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getExpenses } from "../../api/expenseApi";
import { formatCurrency } from "../../utils/currency";

import AddExpenseModal from "../expenses/AddExpenseModal";

import "../../styles/dashboard.css";

function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isAddExpenseOpen, setIsAddExpenseOpen] =
    useState(false);

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [monthlyBudget, setMonthlyBudget] =
    useState(30000);

  // ==========================================
  // LOAD MONTHLY BUDGET
  // ==========================================

  const loadBudget = () => {
    const savedBudget =
      localStorage.getItem("monthlyBudget");

    if (savedBudget) {
      const budget = Number(savedBudget);

      setMonthlyBudget(
        Number.isNaN(budget)
          ? 30000
          : budget
      );
    } else {
      setMonthlyBudget(30000);
    }
  };

  // ==========================================
  // LOAD EXPENSES
  // ==========================================

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();

      setExpenses(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(
        "Failed to load expenses:",
        err
      );

      setError(
        "Unable to load expenses."
      );

      setExpenses([]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadExpenses();
    loadBudget();

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
      loadBudget();
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
  // CURRENT DATE
  // ==========================================

  const currentDate = new Date();

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();

  // ==========================================
  // TOTAL EXPENSES
  // ==========================================

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total +
      Number(expense.amount || 0),
    0
  );

  // ==========================================
  // THIS MONTH EXPENSES
  // ==========================================

  const thisMonthExpenses =
    expenses.filter((expense) => {

      if (!expense.date) {
        return false;
      }

      const expenseDate =
        new Date(expense.date);

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
    });

  // ==========================================
  // THIS MONTH TOTAL
  // ==========================================

  const thisMonthTotal =
    thisMonthExpenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount || 0),
      0
    );

  // ==========================================
  // BUDGET CALCULATIONS
  // ==========================================

  const remainingBudget =
    monthlyBudget -
    thisMonthTotal;

  const actualBudgetPercentage =
    monthlyBudget > 0
      ? (thisMonthTotal /
          monthlyBudget) *
        100
      : 0;

  const budgetPercentage =
    Math.min(
      actualBudgetPercentage,
      100
    );

  // ==========================================
  // RECENT EXPENSES
  // ==========================================

  const recentExpenses = [...expenses]
    .filter(
      (expense) => expense.date
    )
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 5);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const expenseDate =
      new Date(date);

    if (
      Number.isNaN(
        expenseDate.getTime()
      )
    ) {
      return "";
    }

    const today = new Date();

    if (
      expenseDate.toDateString() ===
      today.toDateString()
    ) {
      return "Today";
    }

    const yesterday = new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    if (
      expenseDate.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Yesterday";
    }

    return expenseDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  return (
    <div className="dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Welcome back,{" "}
            {user?.name || "User"}!
            {" "}
            Here's your expense overview.
          </p>

        </div>

        <button
          type="button"
          className="add-expense-button"
          onClick={() =>
            setIsAddExpenseOpen(true)
          }
        >

          <Plus size={18} />

          <span>
            Add Expense
          </span>

        </button>

      </div>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="summary-grid">

        {/* TOTAL EXPENSES */}

        <div className="summary-card">

          <div className="summary-card-top">

            <div className="summary-icon expense-icon">

              <IndianRupee size={20} />

            </div>

            <span className="summary-label">

              Total Expenses

            </span>

          </div>

          <h2>
            {formatCurrency(
              totalExpenses
            )}
          </h2>

          <div className="summary-change neutral">

            <TrendingDown size={15} />

            <span>
              Total amount spent
            </span>

          </div>

        </div>

        {/* THIS MONTH */}

        <div className="summary-card">

          <div className="summary-card-top">

            <div className="summary-icon month-icon">

              <TrendingUp size={20} />

            </div>

            <span className="summary-label">

              This Month

            </span>

          </div>

          <h2>
            {formatCurrency(
              thisMonthTotal
            )}
          </h2>

          <div className="summary-change negative">

            <TrendingUp size={15} />

            <span>
              Expenses this month
            </span>

          </div>

        </div>

        {/* REMAINING BUDGET */}

        <div className="summary-card">

          <div className="summary-card-top">

            <div className="summary-icon budget-icon">

              <Wallet size={20} />

            </div>

            <span className="summary-label">

              Remaining Budget

            </span>

          </div>

          <h2>
            {formatCurrency(
              Math.max(
                remainingBudget,
                0
              )
            )}
          </h2>

          {remainingBudget >= 0 ? (

            <div className="summary-change positive">

              <span>

                {actualBudgetPercentage.toFixed(
                  0
                )}
                {" "}
                of budget used

              </span>

            </div>

          ) : (

            <div className="summary-change negative">

              <AlertTriangle size={15} />

              <span>

                {formatCurrency(
                  Math.abs(
                    remainingBudget
                  )
                )}
                {" "}
                over budget

              </span>

            </div>

          )}

        </div>

      </div>

      {/* ======================================
          BUDGET STATUS
      ====================================== */}

      <div className="budget-status-card">

        <div className="budget-status-header">

          <div>

            <h2>
              Monthly Budget
            </h2>

            <p>

              {formatCurrency(
                thisMonthTotal
              )}

              {" "}
              spent of{" "}

              {formatCurrency(
                monthlyBudget
              )}

            </p>

          </div>

          <strong>

            {actualBudgetPercentage.toFixed(
              0
            )}
            %

          </strong>

        </div>

        <div className="dashboard-budget-track">

          <div
            className={`dashboard-budget-fill ${
              actualBudgetPercentage >= 90
                ? "danger"
                : actualBudgetPercentage >= 75
                ? "warning"
                : ""
            }`}
            style={{
              width:
                `${budgetPercentage}%`,
            }}
          />

        </div>

        <div className="budget-status-footer">

          <span>

            Remaining:{" "}

            {formatCurrency(
              Math.max(
                remainingBudget,
                0
              )
            )}

          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/budget")
            }
          >

            Manage Budget

          </button>

        </div>

      </div>

      {/* ======================================
          RECENT EXPENSES
      ====================================== */}

      <div className="recent-expenses">

        <div className="section-header">

          <div>

            <h2>
              Recent Expenses
            </h2>

            <p>
              Your latest transactions
            </p>

          </div>

          <button
            type="button"
            className="view-all-button"
            onClick={() =>
              navigate("/expenses")
            }
          >

            <span>
              View all
            </span>

            <ArrowRight size={16} />

          </button>

        </div>

        <div className="expense-list">

          {/* LOADING */}

          {loading && (

            <p className="dashboard-message">

              Loading expenses...

            </p>

          )}

          {/* ERROR */}

          {!loading &&
            error && (

              <p className="dashboard-message error">

                {error}

              </p>

            )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            recentExpenses.length === 0 && (

              <p className="dashboard-message">

                No expenses yet.
                {" "}
                Add your first expense!

              </p>

            )}

          {/* EXPENSES */}

          {!loading &&
            !error &&
            recentExpenses.map(
              (expense) => (

                <div
                  className="expense-row"
                  key={
                    expense.id ||
                    expense._id
                  }
                >

                  <div className="expense-info">

                    <div className="expense-category-icon">

                      {expense.category
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "E"}

                    </div>

                    <div>

                      <h3>

                        {expense.category ||
                          "Expense"}

                      </h3>

                      <p>

                        {formatDate(
                          expense.date
                        )}

                        {expense.description
                          ? ` · ${expense.description}`
                          : ""}

                      </p>

                    </div>

                  </div>

                  <div className="expense-amount">

                    -{" "}

                    {formatCurrency(
                      Number(
                        expense.amount || 0
                      )
                    )}

                  </div>

                </div>

              )
            )}

        </div>

      </div>

      {/* ======================================
          ADD EXPENSE MODAL
      ====================================== */}

      {isAddExpenseOpen && (

        <AddExpenseModal
          onClose={() => {

            setIsAddExpenseOpen(
              false
            );

            loadExpenses();
            loadBudget();

          }}
        />

      )}

    </div>
  );
}

export default DashboardOverview;