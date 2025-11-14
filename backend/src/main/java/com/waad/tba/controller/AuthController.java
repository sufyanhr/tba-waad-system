package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.dto.LoginRequest;
import com.waad.tba.dto.LoginResponse;
import com.waad.tba.dto.RegisterRequest;
import com.waad.tba.model.User;
import com.waad.tba.service.AuthService;
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
