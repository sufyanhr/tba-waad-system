package com.waad.tba.service;

import com.waad.tba.dto.LoginRequest;
import com.waad.tba.dto.LoginResponse;
import com.waad.tba.dto.RegisterRequest;
import com.waad.tba.exception.BadRequestException;
import com.waad.tba.model.User;
import com.waad.tba.repository.InsuranceCompanyRepository;
import com.waad.tba.repository.ProviderRepository;
import com.waad.tba.repository.ReviewCompanyRepository;
import com.waad.tba.repository.UserRepository;
import com.waad.tba.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final InsuranceCompanyRepository insuranceCompanyRepository;
    private final ReviewCompanyRepository reviewCompanyRepository;
    private final ProviderRepository providerRepository;
}
    // باقي الـ Repositories والـ PasswordEncoder و register كما هي...

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // identifier = (username or email or phone)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            throw new BadRequestException("User has no assigned role");
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new BadRequestException("User is not active");
        }

        String token = jwtTokenProvider.generateToken(user.getUsername());

        // 🔹 شكل LoginResponse يجب أن يطابق ما يحتاجه الـ frontend
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(user); // إذا عندك في LoginResponse حقول منفصلة (id, fullName...) عدّل هنا تبعًا لها

        return response;
    }

    @Transactional
    public User register(RegisterRequest request) {

        // التأكد أن البريد أو اسم المستخدم غير مكرر
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // إنشاء المستخدم الجديد
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setActive(true);

        // تعيين الدور
        user.getRoles().add(User.Role.valueOf(request.getRole()));
        // مثال: "ADMIN", "INSURANCE", "PROVIDER" ...

        // الحفظ
        return userRepository.save(user);
    }

}
