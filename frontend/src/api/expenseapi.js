import API from "./AuthApi";

// ==========================================
// EXPENSE UPDATED EVENT
// ==========================================

const notifyExpensesUpdated = () => {
  window.dispatchEvent(
    new Event("expensesUpdated")
  );
};

// ==========================================
// GET ALL EXPENSES
// ==========================================

export const getExpenses = async () => {
  const response = await API.get(
    "/api/expenses"
  );

  return response.data;
};

// ==========================================
// ADD EXPENSE
// ==========================================

export const addExpense = async (
  expenseData
) => {
  const response = await API.post(
    "/api/expenses",
    expenseData
  );

  notifyExpensesUpdated();

  return response.data;
};

// ==========================================
// UPDATE EXPENSE
// ==========================================

export const updateExpense = async (
  id,
  expenseData
) => {
  const response = await API.put(
    `/api/expenses/${id}`,
    expenseData
  );

  notifyExpensesUpdated();

  return response.data;
};

// ==========================================
// DELETE EXPENSE
// ==========================================

export const deleteExpense = async (
  id
) => {
  const response = await API.delete(
    `/api/expenses/${id}`
  );

  notifyExpensesUpdated();

  return response.data;
};