package com.waad.tba.modules.auth.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.auth.dto.ForgotPasswordRequest;
import com.waad.tba.modules.auth.dto.LoginRequest;
import com.waad.tba.modules.auth.dto.LoginResponse;
import com.waad.tba.modules.auth.dto.RegisterRequest;
import com.waad.tba.modules.auth.dto.ResetPasswordRequest;
import com.waad.tba.modules.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs for user authentication, registration, and password reset")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description = "Authenticates user credentials and returns a JWT token with user information."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Bad Request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class), examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\n  \"status\": \"error\",\n  \"code\": \"VALIDATION_ERROR\",\n  \"message\": \"Username is required\",\n  \"timestamp\": \"2025-01-01T10:00:00Z\",\n  \"path\": \"/api/auth/login\"\n}"))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class), examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\n  \"status\": \"error\",\n  \"code\": \"INVALID_CREDENTIALS\",\n  \"message\": \"Invalid username or password\",\n  \"timestamp\": \"2025-01-01T10:00:00Z\",\n  \"path\": \"/api/auth/login\"\n}"))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Not Found", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal Server Error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class), examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\n  \"status\": \"error\",\n  \"code\": \"INTERNAL_ERROR\",\n  \"message\": \"Unexpected server error\",\n  \"timestamp\": \"2025-01-01T10:00:00Z\",\n  \"path\": \"/api/auth/login\"\n}")))
    })
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Login credentials")
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(
            summary = "User registration",
            description = "Registers a new user and returns JWT token with the created user information."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Registration successful"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<LoginResponse>> register(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Registration details")
            @Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    @GetMapping("/me")
    @Operation(
            summary = "Get current user",
            description = "Returns the currently authenticated user's profile information."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User info retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<LoginResponse.UserInfo>> getCurrentUser(
            @Parameter(name = "Authorization", description = "Bearer JWT token", required = true)
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        LoginResponse.UserInfo userInfo = authService.getCurrentUser(token);
        return ResponseEntity.ok(ApiResponse.success(userInfo));
    }

    @PostMapping("/forgot-password")
    @Operation(
        summary = "Request password reset OTP",
        description = "Sends a one-time password (OTP) to the user's email to verify password reset."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Reset OTP sent"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid email"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Request containing the user's email address")
            @Valid @RequestBody ForgotPasswordRequest request) {
        authService.sendResetOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status("success")
                .message("Reset OTP sent to your email")
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PostMapping("/reset-password")
    @Operation(
        summary = "Reset password",
        description = "Resets the user's password after verifying the OTP."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid OTP or request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Request containing email, OTP, and new password")
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status("success")
                .message("Password reset successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
