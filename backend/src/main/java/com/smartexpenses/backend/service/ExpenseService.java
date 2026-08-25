package com.s.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.s.backend.entity.Expense;
import com.s.backend.entity.User;
import com.s.backend.repository.ExpenseRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository
    ) {
        this.expenseRepository =
                expenseRepository;
    }

    // =========================================
    // CREATE EXPENSE
    // =========================================

    public Expense addExpense(
            Expense expense,
            User user
    ) {

        validateExpense(expense);

        expense.setCategory(
                expense.getCategory().trim()
        );

        expense.setDescription(
                expense.getDescription().trim()
        );

        expense.setAmount(
                expense.getAmount().setScale(
                        2,
                        java.math.RoundingMode.HALF_UP
                )
        );

        expense.setDate(
                expense.getDate().trim()
        );

        expense.setUser(user);

        return expenseRepository.save(
                expense
        );
    }

    // =========================================
    // GET USER EXPENSES
    // =========================================

    public List<Expense> getExpensesByUser(
            User user
    ) {

        return expenseRepository.findByUser(
                user
        );
    }

    // =========================================
    // UPDATE EXPENSE
    // =========================================

    public Expense updateExpense(
            Long expenseId,
            Expense updatedExpense,
            User user
    ) {

        validateExpense(updatedExpense);

        Expense existingExpense =
                expenseRepository
                        .findById(expenseId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Expense not found"
                                        )
                        );

        verifyOwnership(
                existingExpense,
                user
        );

        existingExpense.setCategory(
                updatedExpense
                        .getCategory()
                        .trim()
        );

        existingExpense.setDescription(
                updatedExpense
                        .getDescription()
                        .trim()
        );

        existingExpense.setAmount(
                updatedExpense
                        .getAmount()
                        .setScale(
                                2,
                                java.math.RoundingMode.HALF_UP
                        )
        );

        existingExpense.setDate(
                updatedExpense
                        .getDate()
                        .trim()
        );

        return expenseRepository.save(
                existingExpense
        );
    }

    // =========================================
    // DELETE EXPENSE
    // =========================================

    public void deleteExpense(
            Long expenseId,
            User user
    ) {

        Expense expense =
                expenseRepository
                        .findById(expenseId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Expense not found"
                                        )
                        );

        verifyOwnership(
                expense,
                user
        );

        expenseRepository.delete(
                expense
        );
    }

    // =========================================
    // VALIDATION
    // =========================================

    private void validateExpense(
            Expense expense
    ) {

        if (expense == null) {
            throw new RuntimeException(
                    "Expense data is required"
            );
        }

        if (
                expense.getCategory() == null ||
                expense.getCategory()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Category is required"
            );
        }

        if (
                expense.getDescription() == null ||
                expense.getDescription()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Description is required"
            );
        }

        if (expense.getAmount() == null) {

            throw new RuntimeException(
                    "Amount is required"
            );
        }

        if (
                expense.getAmount()
                        .compareTo(
                                BigDecimal.ZERO
                        ) <= 0
        ) {

            throw new RuntimeException(
                    "Amount must be greater than zero"
            );
        }

        if (
                expense.getDate() == null ||
                expense.getDate()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Date is required"
            );
        }
    }

    // =========================================
    // OWNERSHIP CHECK
    // =========================================

    private void verifyOwnership(
            Expense expense,
            User user
    ) {

        if (
                expense.getUser() == null ||
                user == null ||
                !expense
                        .getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            throw new RuntimeException(
                    "You are not allowed to access this expense"
            );
        }
    }
}