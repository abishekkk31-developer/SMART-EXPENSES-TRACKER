package com.s.backend.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.s.backend.entity.User;
import com.s.backend.service.JwtService;
import com.s.backend.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // =========================================
    // GET CURRENT USER PROFILE
    // =========================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Principal principal
    ) {

        try {

            User user =
                    userService
                            .findByEmail(
                                    principal.getName()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "User not found"
                                    )
                            );

            return ResponseEntity.ok(
                    new UserResponse(user)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================================
    // UPDATE PROFILE
    // =========================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            Principal principal
    ) {

        try {

            if (
                    request.getName() == null ||
                    request.getName().trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Name cannot be empty"
                        );
            }

            if (
                    request.getEmail() == null ||
                    request.getEmail().trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Email cannot be empty"
                        );
            }

            String currentEmail =
                    principal.getName();

            User savedUser =
                    userService.updateProfile(
                            currentEmail,
                            request.getName(),
                            request.getEmail()
                    );

            String newToken =
                    jwtService.generateToken(
                            savedUser
                    );

            return ResponseEntity.ok(
                    new ProfileUpdateResponse(
                            newToken,
                            new UserResponse(
                                    savedUser
                            )
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================
    // CHANGE PASSWORD
    // =========================================

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody PasswordChangeRequest request,
            Principal principal
    ) {

        try {

            if (
                    request.getCurrentPassword() == null ||
                    request.getCurrentPassword().isBlank()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Current password is required"
                        );
            }

            if (
                    request.getNewPassword() == null ||
                    request.getNewPassword().isBlank()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "New password is required"
                        );
            }

            if (
                    request.getNewPassword().length() < 6
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "New password must be at least 6 characters"
                        );
            }

            userService.changePassword(
                    principal.getName(),
                    request.getCurrentPassword(),
                    request.getNewPassword()
            );

            return ResponseEntity.ok(
                    "Password changed successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================
    // PROFILE UPDATE REQUEST
    // =========================================

    public static class ProfileUpdateRequest {

        private String name;
        private String email;

        public ProfileUpdateRequest() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    // =========================================
    // PASSWORD REQUEST
    // =========================================

    public static class PasswordChangeRequest {

        private String currentPassword;
        private String newPassword;

        public PasswordChangeRequest() {
        }

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(
                String currentPassword
        ) {
            this.currentPassword =
                    currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(
                String newPassword
        ) {
            this.newPassword =
                    newPassword;
        }
    }

    // =========================================
    // SAFE USER RESPONSE
    // =========================================

    public static class UserResponse {

        private Long id;
        private String name;
        private String email;

        public UserResponse(User user) {

            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }
    }

    // =========================================
    // PROFILE UPDATE RESPONSE
    // =========================================

    public static class ProfileUpdateResponse {

        private String token;
        private UserResponse user;

        public ProfileUpdateResponse(
                String token,
                UserResponse user
        ) {

            this.token = token;
            this.user = user;
        }

        public String getToken() {
            return token;
        }

        public UserResponse getUser() {
            return user;
        }
    }
}