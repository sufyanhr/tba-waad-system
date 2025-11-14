package com.waad.tba.security.controller;

import com.waad.tba.core.dto.ApiResponse;
import com.waad.tba.security.dto.LoginRequest;
import com.waad.tba.security.dto.LoginResponse;
import com.waad.tba.security.dto.RegisterRequest;
import com.waad.tba.security.model.User;
import com.waad.tba.security.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully", user));
    }
}
