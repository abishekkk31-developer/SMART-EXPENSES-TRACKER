package com.s.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.s.backend.entity.Expense;
import com.s.backend.entity.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Get all expenses belonging to one specific user
    List<Expense> findByUser(User user);

}