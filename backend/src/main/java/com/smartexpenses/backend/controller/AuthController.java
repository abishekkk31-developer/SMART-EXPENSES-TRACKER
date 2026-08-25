package com.s.backend.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.s.backend.entity.User;
import com.s.backend.service.JwtService;
import com.s.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // =========================================
    // REGISTER
    // =========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user
    ) {

        try {

            User registeredUser =
                    userService.registerUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            new UserResponse(
                                    registeredUser
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================================
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        try {

            User user =
                    userService
                            .findByEmail(
                                    request.getEmail()
                            )
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "Invalid email or password"
                                            )
                            );

            boolean passwordMatches =
                    userService.checkPassword(
                            request.getPassword(),
                            user.getPassword()
                    );

            if (!passwordMatches) {

                return ResponseEntity
                        .status(
                                HttpStatus.UNAUTHORIZED
                        )
                        .body(
                                "Invalid email or password"
                        );
            }

            String token =
                    jwtService.generateToken(
                            user
                    );

            return ResponseEntity.ok(
                    new LoginResponse(
                            token,
                            new UserResponse(user)
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            e.getMessage()
                    );
        }
    }

    // =========================================
    // GET CURRENT USER
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
                                    () ->
                                            new RuntimeException(
                                                    "User not found"
                                            )
                            );

            return ResponseEntity.ok(
                    new UserResponse(user)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.NOT_FOUND
                    )
                    .body(
                            e.getMessage()
                    );
        }
    }

    // =========================================
    // UPDATE CURRENT USER
    // =========================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody User updatedUser,
            Principal principal
    ) {

        try {

            User user =
                    userService
                            .findByEmail(
                                    principal.getName()
                            )
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "User not found"
                                            )
                            );

            user.setName(
                    updatedUser.getName()
            );

            User savedUser =
                    userService.updateUser(
                            user
                    );

            return ResponseEntity.ok(
                    new UserResponse(
                            savedUser
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.BAD_REQUEST
                    )
                    .body(
                            e.getMessage()
                    );
        }
    }

    // =========================================
    // LOGIN REQUEST
    // =========================================

    public static class LoginRequest {

        private String email;
        private String password;

        public LoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(
                String email
        ) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(
                String password
        ) {
            this.password = password;
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
    // LOGIN RESPONSE
    // =========================================

    public static class LoginResponse {

        private String token;
        private UserResponse user;

        public LoginResponse(
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