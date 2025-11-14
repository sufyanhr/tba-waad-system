package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.dto.LoginRequest;
import com.waad.tba.dto.LoginResponse;
import com.waad.tba.dto.RegisterRequest;
import com.waad.tba.model.User;
import com.waad.tba.model.User.Role;
import com.waad.tba.security.JwtTokenProvider;
import com.waad.tba.service.AuthService;
import com.waad.tba.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // Find user by email or phone
        User user = userService.findByEmailOrPhone(request.getIdentifier());

        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        // Check Active
        if (!user.getActive()) {
            return ResponseEntity.status(403).body("User is not active");
        }

        // Prevent access if no roles assigned
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            return ResponseEntity.status(403).body("User has no assigned role");
        }

        // Prevent access for non-allowed roles:
        if (user.getRoles().contains(Role.MEMBER)) {
            // لاحقًا سنعمل واجهة خاصة للمؤمنين
            // لكن الآن نسمح لهم بالدخول فقط لو أردت ذلك
        }

        // Generate JWT token using username
        String token = jwtTokenProvider.generateToken(user.getUsername());

        return ResponseEntity.ok(new LoginResponse(token, "Bearer", user));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully", user));
    }
}
