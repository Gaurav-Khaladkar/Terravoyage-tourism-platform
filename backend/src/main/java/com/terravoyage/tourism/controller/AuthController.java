package com.terravoyage.tourism.controller;

import com.terravoyage.tourism.dto.ApiResponse;
import com.terravoyage.tourism.dto.AuthRequest;
import com.terravoyage.tourism.dto.AuthResponse;
import com.terravoyage.tourism.dto.RegisterRequest;
import com.terravoyage.tourism.security.UserPrincipal;
import com.terravoyage.tourism.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication & User Management", description = "Endpoints for login, registration, and user profiles")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and generate JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Account registered successfully", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user details")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        Map<String, Object> details = Map.of(
                "id", currentUser.getId(),
                "fullName", currentUser.getFullName(),
                "email", currentUser.getUsername(),
                "authorities", currentUser.getAuthorities()
        );
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", details));
    }
}
