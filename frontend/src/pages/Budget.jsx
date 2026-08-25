import { useEffect, useState } from "react";

import {
  formatCurrency,
  getCurrencySettings,
} from "../utils/currency";

import {
  Plus,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Utensils,
  Car,
  ShoppingBag,
  Film,
  MoreVertical,
} from "lucide-react";

import { getExpenses } from "../api/expenseApi";

import "../styles/budget.css";

function Budget() {
  // ==========================================
  // STATE
  // ==========================================

  const [showBudgetForm, setShowBudgetForm] =
    useState(false);

  const [monthlyBudget, setMonthlyBudget] =
    useState(() => {
      const savedBudget =
        localStorage.getItem(
          "monthlyBudget"
        );

      return savedBudget
        ? Number(savedBudget)
        : 30000;
    });

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [budgetAlertsEnabled, setBudgetAlertsEnabled] =
    useState(true);

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  // ==========================================
  // CURRENCY SYMBOL
  // ==========================================

  const getCurrencySymbol = () => {
    const currency =
      getCurrencySettings();

    const symbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };

    return (
      symbols[currency] || "₹"
    );
  };

  // ==========================================
  // LOAD SETTINGS
  // ==========================================

  const loadSettings = () => {
    const savedSettings =
      localStorage.getItem(
        "expenseTrackerSettings"
      );

    if (!savedSettings) {
      setBudgetAlertsEnabled(true);
      setNotificationsEnabled(true);
      return;
    }

    try {
      const parsedSettings =
        JSON.parse(savedSettings);

      setBudgetAlertsEnabled(
        parsedSettings.budgetAlerts !== false
      );

      setNotificationsEnabled(
        parsedSettings.notifications !== false
      );

    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );

      setBudgetAlertsEnabled(true);
      setNotificationsEnabled(true);
    }
  };

  // ==========================================
  // LOAD EXPENSES
  // ==========================================

  const loadExpenses = async () => {
    try {
      setLoading(true);

      const data =
        await getExpenses();

      setExpenses(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Failed to load expenses:",
        error
      );

      setExpenses([]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PAGE DATA
  // ==========================================

  useEffect(() => {
    loadExpenses();
    loadSettings();

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
    // REFRESH SETTINGS WHEN WINDOW FOCUSES
    // ========================================

    const handleFocus = () => {
      loadSettings();
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
  // CURRENT MONTH
  // ==========================================

  const currentDate = new Date();

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();

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
  // TOTAL SPENT
  // ==========================================

  const totalSpent =
    thisMonthExpenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );

  // ==========================================
  // REMAINING BUDGET
  // ==========================================

  const remainingBudget =
    monthlyBudget -
    totalSpent;

  // ==========================================
  // BUDGET PERCENTAGE
  // ==========================================

  const budgetPercentage =
    monthlyBudget > 0
      ? (totalSpent /
          monthlyBudget) *
        100
      : 0;

  const safeBudgetPercentage =
    Math.min(
      Math.max(
        budgetPercentage,
        0
      ),
      100
    );

  // ==========================================
  // CATEGORY CONFIGURATION
  // ==========================================

  const categoryConfig = [
    {
      name: "Food & Dining",
      budget: 8000,
      icon: Utensils,
    },

    {
      name: "Transportation",
      budget: 5000,
      icon: Car,
    },

    {
      name: "Shopping",
      budget: 5000,
      icon: ShoppingBag,
    },

    {
      name: "Entertainment",
      budget: 3000,
      icon: Film,
    },
  ];

  // ==========================================
  // CATEGORY SPENDING
  // ==========================================

  const categories =
    categoryConfig.map(
      (category) => {

        const spent =
          thisMonthExpenses
            .filter(
              (expense) =>
                expense.category ===
                category.name
            )
            .reduce(
              (total, expense) =>
                total +
                Number(
                  expense.amount || 0
                ),
              0
            );

        return {
          ...category,
          spent,
        };
      }
    );

  // ==========================================
  // CREATE BUDGET NOTIFICATION
  // ==========================================

  useEffect(() => {
    if (
      loading ||
      monthlyBudget <= 0 ||
      !budgetAlertsEnabled ||
      !notificationsEnabled ||
      budgetPercentage < 80
    ) {
      return;
    }

    try {
      const savedNotifications =
        localStorage.getItem(
          "expenseTrackerNotifications"
        );

      let notifications = [];

      if (savedNotifications) {
        try {
          notifications =
            JSON.parse(
              savedNotifications
            );

          if (
            !Array.isArray(
              notifications
            )
          ) {
            notifications = [];
          }

        } catch {
          notifications = [];
        }
      }

      const alertType =
        remainingBudget < 0
          ? "Budget Exceeded"
          : "Budget Alert";

      const alertMessage =
        remainingBudget < 0
          ? `You are over budget by ${formatCurrency(
              Math.abs(
                remainingBudget
              )
            )}.`
          : `You have used ${budgetPercentage.toFixed(
              0
            )}% of your monthly budget.`;

      const notificationId =
        `budget-${currentYear}-${currentMonth}-${alertType}`;

      const alreadyExists =
        notifications.some(
          (notification) =>
            notification.id ===
            notificationId
        );

      if (alreadyExists) {
        return;
      }

      const newNotification = {
        id: notificationId,

        title: alertType,

        message: alertMessage,

        createdAt:
          new Date().toISOString(),

        read: false,
      };

      const updatedNotifications = [
        newNotification,
        ...notifications,
      ].slice(0, 20);

      localStorage.setItem(
        "expenseTrackerNotifications",
        JSON.stringify(
          updatedNotifications
        )
      );

      window.dispatchEvent(
        new Event(
          "notificationsUpdated"
        )
      );

    } catch (error) {
      console.error(
        "Failed to create budget notification:",
        error
      );
    }

  }, [
    loading,
    budgetAlertsEnabled,
    notificationsEnabled,
    budgetPercentage,
    remainingBudget,
    monthlyBudget,
    currentMonth,
    currentYear,
  ]);

  // ==========================================
  // SAVE BUDGET
  // ==========================================

  const handleSaveBudget = (
    event
  ) => {
    event.preventDefault();

    const formData =
      new FormData(
        event.currentTarget
      );

    const amount =
      Number(
        formData.get("budget")
      );

    if (
      !amount ||
      amount <= 0
    ) {
      return;
    }

    setMonthlyBudget(
      amount
    );

    localStorage.setItem(
      "monthlyBudget",
      amount.toString()
    );

    setShowBudgetForm(
      false
    );
  };

  return (
    <div className="budget-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="budget-page-header">

        <div>

          <h1>
            Budget
          </h1>

          <p>
            Set and manage your monthly
            spending limits.
          </p>

        </div>

        <button
          type="button"
          className="budget-add-button"
          onClick={() =>
            setShowBudgetForm(
              true
            )
          }
        >

          <Plus size={18} />

          <span>
            Set Budget
          </span>

        </button>

      </div>

      {/* ======================================
          OVERVIEW CARDS
      ====================================== */}

      <div className="budget-overview-grid">

        {/* MONTHLY BUDGET */}

        <div className="budget-overview-card">

          <div className="budget-card-icon budget-icon">

            <Wallet size={20} />

          </div>

          <div>

            <span>
              Monthly Budget
            </span>

            <strong>
              {formatCurrency(
                monthlyBudget
              )}
            </strong>

          </div>

        </div>

        {/* TOTAL SPENT */}

        <div className="budget-overview-card">

          <div className="budget-card-icon spent-icon">

            <TrendingUp size={20} />

          </div>

          <div>

            <span>
              Total Spent
            </span>

            <strong>
              {formatCurrency(
                totalSpent
              )}
            </strong>

          </div>

        </div>

        {/* REMAINING */}

        <div className="budget-overview-card">

          <div className="budget-card-icon remaining-icon">

            <Wallet size={20} />

          </div>

          <div>

            <span>
              Remaining
            </span>

            <strong>
              {formatCurrency(
                Math.max(
                  remainingBudget,
                  0
                )
              )}
            </strong>

          </div>

        </div>

      </div>

      {/* ======================================
          MONTHLY PROGRESS
      ====================================== */}

      <div className="budget-progress-card">

        <div className="budget-progress-header">

          <div>

            <h2>
              Monthly Spending
            </h2>

            <p>
              You have used{" "}
              {budgetPercentage.toFixed(
                1
              )}
              % of your budget.
            </p>

          </div>

          <strong>
            {budgetPercentage.toFixed(
              1
            )}
            %
          </strong>

        </div>

        <div className="budget-progress-track">

          <div
            className="budget-progress-fill"
            style={{
              width:
                `${safeBudgetPercentage}%`,
            }}
          />

        </div>

        <div className="budget-progress-footer">

          <span>

            {formatCurrency(
              totalSpent
            )}
            {" "}
            spent

          </span>

          <span>

            {formatCurrency(
              monthlyBudget
            )}
            {" "}
            budget

          </span>

        </div>

      </div>

      {/* ======================================
          CATEGORY BUDGETS
      ====================================== */}

      <div className="category-budget-container">

        <div className="category-budget-header">

          <div>

            <h2>
              Category Budgets
            </h2>

            <p>
              Track spending across your
              categories.
            </p>

          </div>

        </div>

        <div className="category-budget-list">

          {loading && (

            <p
              style={{
                padding: "20px",
              }}
            >
              Loading expenses...
            </p>

          )}

          {!loading &&
            categories.map(
              (category) => {

                const Icon =
                  category.icon;

                const percentage =
                  category.budget > 0
                    ? Math.min(
                        (
                          category.spent /
                          category.budget
                        ) * 100,
                        100
                      )
                    : 0;

                const remaining =
                  category.budget -
                  category.spent;

                return (

                  <div
                    className="category-budget-row"
                    key={
                      category.name
                    }
                  >

                    <div className="category-budget-info">

                      <div className="category-budget-icon">

                        <Icon size={18} />

                      </div>

                      <div>

                        <h3>
                          {category.name}
                        </h3>

                        <p>

                          {formatCurrency(
                            category.spent
                          )}

                          {" "}
                          of{" "}

                          {formatCurrency(
                            category.budget
                          )}

                        </p>

                      </div>

                    </div>

                    <div className="category-budget-progress">

                      <div className="category-progress-track">

                        <div
                          className="category-progress-fill"
                          style={{
                            width:
                              `${percentage}%`,
                          }}
                        />

                      </div>

                      <span>
                        {percentage.toFixed(
                          0
                        )}
                        %
                      </span>

                    </div>

                    <div className="category-budget-remaining">

                      {remaining >= 0 ? (

                        <>

                          <span>
                            Remaining
                          </span>

                          <strong>
                            {formatCurrency(
                              remaining
                            )}
                          </strong>

                        </>

                      ) : (

                        <>

                          <span>
                            Over Budget
                          </span>

                          <strong>
                            {formatCurrency(
                              Math.abs(
                                remaining
                              )
                            )}
                          </strong>

                        </>

                      )}

                    </div>

                    <button
                      type="button"
                      className="category-budget-menu"
                    >

                      <MoreVertical
                        size={18}
                      />

                    </button>

                  </div>

                );
              }
            )}

        </div>

      </div>

      {/* ======================================
          BUDGET ALERT
      ====================================== */}

      {budgetAlertsEnabled &&
        budgetPercentage >= 80 && (

          <div className="budget-alert">

            <AlertTriangle
              size={20}
            />

            <div>

              <strong>
                {remainingBudget < 0
                  ? "Budget Exceeded"
                  : "Budget Alert"}
              </strong>

              <p>

                You have used{" "}
                {budgetPercentage.toFixed(
                  0
                )}
                % of your monthly budget.

                {" "}

                {remainingBudget < 0
                  ? `You are over budget by ${formatCurrency(
                      Math.abs(
                        remainingBudget
                      )
                    )}.`
                  : "Consider reducing spending to stay within your limit."}

              </p>

            </div>

          </div>

        )}

      {/* ======================================
          SET BUDGET MODAL
      ====================================== */}

      {showBudgetForm && (

        <div
          className="budget-modal-overlay"
          onClick={() =>
            setShowBudgetForm(
              false
            )
          }
        >

          <div
            className="budget-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="budget-modal-header">

              <div>

                <h2>
                  Set Monthly Budget
                </h2>

                <p>
                  Define your spending limit
                  for this month.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowBudgetForm(
                    false
                  )
                }
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleSaveBudget
              }
            >

              <label>
                Monthly Budget
              </label>

              <div className="budget-input-wrapper">

                <span>
                  {getCurrencySymbol()}
                </span>

                <input
                  name="budget"
                  type="number"
                  min="1"
                  defaultValue={
                    monthlyBudget
                  }
                  required
                />

              </div>

              <div className="budget-modal-actions">

                <button
                  type="button"
                  className="budget-cancel-button"
                  onClick={() =>
                    setShowBudgetForm(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="budget-save-button"
                >
                  Save Budget
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Budget;