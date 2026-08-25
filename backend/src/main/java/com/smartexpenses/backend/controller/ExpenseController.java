package com.s.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.s.backend.entity.Expense;
import com.s.backend.entity.User;
import com.s.backend.repository.UserRepository;
import com.s.backend.service.ExpenseService;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;

    public ExpenseController(
            ExpenseService expenseService,
            UserRepository userRepository
    ) {

        this.expenseService =
                expenseService;

        this.userRepository =
                userRepository;
    }

    // =========================================
    // CURRENT USER
    // =========================================

    private User getCurrentUser(
            Principal principal
    ) {

        if (principal == null) {
            throw new RuntimeException(
                    "Authentication required"
            );
        }

        return userRepository
                .findByEmail(
                        principal.getName()
                )
                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "User not found"
                                )
                );
    }

    // =========================================
    // CREATE
    // =========================================

    @PostMapping
    public ResponseEntity<?> addExpense(
            @RequestBody Expense expense,
            Principal principal
    ) {

        try {

            User user =
                    getCurrentUser(principal);

            Expense savedExpense =
                    expenseService.addExpense(
                            expense,
                            user
                    );

            return ResponseEntity
                    .status(
                            HttpStatus.CREATED
                    )
                    .body(savedExpense);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================
    // READ
    // =========================================

    @GetMapping
    public ResponseEntity<?> getExpenses(
            Principal principal
    ) {

        try {

            User user =
                    getCurrentUser(principal);

            List<Expense> expenses =
                    expenseService
                            .getExpensesByUser(
                                    user
                            );

            return ResponseEntity.ok(
                    expenses
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.NOT_FOUND
                    )
                    .body(e.getMessage());
        }
    }

    // =========================================
    // UPDATE
    // =========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expense,
            Principal principal
    ) {

        try {

            User user =
                    getCurrentUser(principal);

            Expense updatedExpense =
                    expenseService.updateExpense(
                            id,
                            expense,
                            user
                    );

            return ResponseEntity.ok(
                    updatedExpense
            );

        } catch (RuntimeException e) {

            String message =
                    e.getMessage();

            if (
                    "Expense not found"
                            .equals(message)
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.NOT_FOUND
                        )
                        .body(message);
            }

            if (
                    message != null &&
                    message.contains(
                            "not allowed"
                    )
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.FORBIDDEN
                        )
                        .body(message);
            }

            return ResponseEntity
                    .badRequest()
                    .body(message);
        }
    }

    // =========================================
    // DELETE
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(
            @PathVariable Long id,
            Principal principal
    ) {

        try {

            User user =
                    getCurrentUser(principal);

            expenseService.deleteExpense(
                    id,
                    user
            );

            return ResponseEntity.ok(
                    "Expense deleted successfully"
            );

        } catch (RuntimeException e) {

            String message =
                    e.getMessage();

            if (
                    "Expense not found"
                            .equals(message)
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.NOT_FOUND
                        )
                        .body(message);
            }

            if (
                    message != null &&
                    message.contains(
                            "not allowed"
                    )
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.FORBIDDEN
                        )
                        .body(message);
            }

            return ResponseEntity
                    .badRequest()
                    .body(message);
        }
    }
}