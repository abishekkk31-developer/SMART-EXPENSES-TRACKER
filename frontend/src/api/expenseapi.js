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
  try {
    const response =
      await API.get("/expenses");

    return response.data;

  } catch (error) {
    console.error(
      "GET EXPENSES ERROR:",
      error
    );

    throw error;
  }
};

// ==========================================
// ADD EXPENSE
// ==========================================

export const addExpense = async (
  expenseData
) => {
  try {
    const response =
      await API.post(
        "/expenses",
        expenseData
      );

    notifyExpensesUpdated();

    return response.data;

  } catch (error) {
    console.error(
      "ADD EXPENSE ERROR:",
      error
    );

    throw error;
  }
};

// ==========================================
// UPDATE EXPENSE
// ==========================================

export const updateExpense = async (
  id,
  expenseData
) => {
  try {
    const response =
      await API.put(
        `/expenses/${id}`,
        expenseData
      );

    notifyExpensesUpdated();

    return response.data;

  } catch (error) {
    console.error(
      "UPDATE EXPENSE ERROR:",
      error
    );

    throw error;
  }
};

// ==========================================
// DELETE EXPENSE
// ==========================================

export const deleteExpense = async (
  id
) => {
  try {
    const response =
      await API.delete(
        `/expenses/${id}`
      );

    notifyExpensesUpdated();

    return response.data;

  } catch (error) {
    console.error(
      "DELETE EXPENSE ERROR:",
      error
    );

    throw error;
  }
};