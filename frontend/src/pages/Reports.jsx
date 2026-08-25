import { useEffect, useState } from "react";

import { formatCurrency } from "../utils/currency";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Utensils,
  Car,
  ShoppingBag,
  Film,
  MoreVertical,
} from "lucide-react";

import { getExpenses } from "../api/expenseApi";

import "../styles/reports.css";

function Reports() {
  // ==========================================
  // STATE
  // ==========================================

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD EXPENSES
  // ==========================================

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getExpenses();

      setExpenses(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(
        "Failed to load reports:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load report data."
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
  // CURRENT DATE
  // ==========================================

  const now = new Date();

  const currentMonth =
    now.getMonth();

  const currentYear =
    now.getFullYear();

  const monthName =
    now.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );

  // ==========================================
  // THIS MONTH EXPENSES
  // ==========================================

  const thisMonthExpenses =
    expenses.filter(
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
    );

  // ==========================================
  // TOTAL SPENDING
  // ==========================================

  const totalSpending =
    thisMonthExpenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );

  // ==========================================
  // AVERAGE DAILY SPENDING
  // ==========================================

  const currentDay =
    now.getDate();

  const averageDaily =
    currentDay > 0
      ? totalSpending /
        currentDay
      : 0;

  // ==========================================
  // CATEGORY ICON
  // ==========================================

  const getCategoryIcon = (
    category
  ) => {

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
  // CATEGORY TOTALS
  // ==========================================

  const categoryMap = {};

  thisMonthExpenses.forEach(
    (expense) => {

      const category =
        expense.category ||
        "Other";

      if (
        !categoryMap[category]
      ) {
        categoryMap[category] =
          0;
      }

      categoryMap[category] +=
        Number(
          expense.amount || 0
        );
    }
  );

  const categories =
    Object.entries(
      categoryMap
    )
      .map(
        ([name, amount]) => ({

          name,

          amount,

          percentage:
            totalSpending > 0
              ? Math.round(
                  (amount /
                    totalSpending) *
                    100
                )
              : 0,

          icon:
            getCategoryIcon(
              name
            ),
        })
      )
      .sort(
        (a, b) =>
          b.amount -
          a.amount
      );

  // ==========================================
  // HIGHEST CATEGORY
  // ==========================================

  const highestCategory =
    categories.length > 0
      ? categories[0]
      : null;

  // ==========================================
  // TOTAL TRANSACTIONS
  // ==========================================

  const totalTransactions =
    thisMonthExpenses.length;

  return (
    <div className="reports-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="reports-header">

        <div>

          <h1>
            Reports
          </h1>

          <p>
            Analyze your spending for{" "}
            {monthName}.
          </p>

        </div>

      </div>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="report-summary-grid">

        {/* TOTAL SPENDING */}

        <div className="report-card">

          <div className="report-icon">

            <Wallet size={20} />

          </div>

          <span>
            Total Spending
          </span>

          <strong>
            {formatCurrency(
              totalSpending
            )}
          </strong>

          <small>
            {monthName}
          </small>

        </div>

        {/* AVERAGE DAILY */}

        <div className="report-card">

          <div className="report-icon">

            <TrendingDown
              size={20}
            />

          </div>

          <span>
            Average Daily
          </span>

          <strong>
            {formatCurrency(
              Math.round(
                averageDaily
              )
            )}
          </strong>

          <small>
            Average spending per day
          </small>

        </div>

        {/* HIGHEST CATEGORY */}

        <div className="report-card">

          <div className="report-icon">

            <TrendingUp
              size={20}
            />

          </div>

          <span>
            Highest Category
          </span>

          <strong>

            {highestCategory
              ? highestCategory.name
              : "No data"}

          </strong>

          <small>

            {highestCategory
              ? `${formatCurrency(
                  highestCategory.amount
                )} spent`
              : "Add expenses to see data"}

          </small>

        </div>

        {/* TRANSACTIONS */}

        <div className="report-card">

          <div className="report-icon">

            <MoreVertical
              size={20}
            />

          </div>

          <span>
            Transactions
          </span>

          <strong>
            {totalTransactions}
          </strong>

          <small>
            Expenses recorded this month
          </small>

        </div>

      </div>

      {/* ======================================
          CATEGORY REPORT
      ====================================== */}

      <div className="reports-container">

        <div className="reports-container-header">

          <div>

            <h2>
              Spending by Category
            </h2>

            <p>
              Your expense breakdown
              for {monthName}.
            </p>

          </div>

        </div>

        <div className="category-report-list">

          {/* LOADING */}

          {loading && (

            <div className="no-report-data">

              Loading report data...

            </div>

          )}

          {/* ERROR */}

          {!loading &&
            error && (

              <div className="no-report-data report-error">

                {error}

              </div>

            )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            categories.length === 0 && (

              <div className="no-report-data">

                No expenses found for{" "}
                {monthName}.

              </div>

            )}

          {/* CATEGORY DATA */}

          {!loading &&
            !error &&
            categories.map(
              (category) => {

                const Icon =
                  category.icon;

                return (

                  <div
                    className="category-report-row"
                    key={
                      category.name
                    }
                  >

                    <div className="category-report-info">

                      <div className="category-report-icon">

                        <Icon size={18} />

                      </div>

                      <div>

                        <h3>
                          {category.name}
                        </h3>

                        <p>

                          {formatCurrency(
                            category.amount
                          )}

                        </p>

                      </div>

                    </div>

                    <div className="category-report-progress">

                      <div className="report-progress-track">

                        <div
                          className="report-progress-fill"
                          style={{
                            width:
                              `${category.percentage}%`,
                          }}
                        />

                      </div>

                      <span>

                        {category.percentage}%

                      </span>

                    </div>

                  </div>

                );
              }
            )}

        </div>

      </div>

    </div>
  );
}

export default Reports;