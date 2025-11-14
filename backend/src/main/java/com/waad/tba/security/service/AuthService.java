package com.waad.tba.security.service;

import com.waad.tba.security.dto.LoginRequest;
import com.waad.tba.security.dto.LoginResponse;
import com.waad.tba.security.dto.RegisterRequest;
import com.waad.tba.security.model.User;
import com.waad.tba.security.repository.UserRepository;
import com.waad.tba.core.exception.BadRequestException;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import com.waad.tba.modules.providers.repository.ProviderRepository;
import com.waad.tba.modules.insurance.repository.ReviewCompanyRepository;
import com.waad.tba.rbac.model.Role;
import com.waad.tba.rbac.service.RoleService;
import com.waad.tba.rbac.service.UserRoleService;
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
    private final RoleService roleService;
    private final UserRoleService userRoleService;

    // باقي الـ Repositories والـ PasswordEncoder و register كما هي...

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // identifier = (username or email or phone)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        if (user.getUserRoles() == null || user.getUserRoles().isEmpty() || 
            user.getActiveRoles().isEmpty()) {
            throw new BadRequestException("User has no assigned active role");
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new BadRequestException("User is not active");
        }

        String token = jwtTokenProvider.generateToken(user);

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

        // الحفظ أولاً
        User savedUser = userRepository.save(user);

        // تعيين الأدوار
        try {
            if (request.getRoles() != null && !request.getRoles().isEmpty()) {
                for (String roleName : request.getRoles()) {
                    Role role = roleService.getRoleByName(roleName);
                    userRoleService.assignRoleToUser(savedUser.getId(), role.getId());
                }
            }
        } catch (Exception e) {
            // إذا لم يتم العثور على الدور، لا نفعل شيء أو نرمي استثناء
            throw new RuntimeException("Invalid role in roles list");
        }

        return savedUser;
    }
}
