package com.s.backend.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.s.backend.entity.User;
import com.s.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================
    // REGISTER USER
    // =========================================

    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException(
                    "Email already registered"
            );
        }

        if (
                user.getRole() == null ||
                user.getRole().isBlank()
        ) {
            user.setRole("USER");
        }

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }

    // =========================================
    // FIND USER BY EMAIL
    // =========================================

    public Optional<User> findByEmail(
            String email
    ) {

        return userRepository.findByEmail(email);
    }

    // =========================================
    // CHECK PASSWORD
    // =========================================

    public boolean checkPassword(
            String rawPassword,
            String encodedPassword
    ) {

        return passwordEncoder.matches(
                rawPassword,
                encodedPassword
        );
    }

    // =========================================
    // UPDATE USER
    // =========================================

    public User updateUser(User user) {

        return userRepository.save(user);
    }

    // =========================================
    // UPDATE PROFILE
    // =========================================

    public User updateProfile(
            String currentEmail,
            String name,
            String newEmail
    ) {

        User user =
                userRepository
                        .findByEmail(currentEmail)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        String cleanedEmail =
                newEmail.trim();

        if (
                !cleanedEmail.equalsIgnoreCase(
                        currentEmail
                )
                &&
                userRepository.existsByEmail(
                        cleanedEmail
                )
        ) {

            throw new RuntimeException(
                    "Email is already registered"
            );
        }

        user.setName(name.trim());
        user.setEmail(cleanedEmail);

        return userRepository.save(user);
    }

    // =========================================
    // CHANGE PASSWORD
    // =========================================

    public void changePassword(
            String email,
            String currentPassword,
            String newPassword
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        boolean passwordMatches =
                passwordEncoder.matches(
                        currentPassword,
                        user.getPassword()
                );

        if (!passwordMatches) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepository.save(user);
    }
}