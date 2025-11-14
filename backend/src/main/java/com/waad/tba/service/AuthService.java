package com.waad.tba.service;

import com.waad.tba.dto.RegisterRequest;
import com.waad.tba.exception.BadRequestException;
import com.waad.tba.model.Organization;
import com.waad.tba.model.Provider;
import com.waad.tba.model.User;
import com.waad.tba.repository.OrganizationRepository;
import com.waad.tba.repository.ProviderRepository;
import com.waad.tba.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;

    // ❗ لم يعد لدينا login هنا — AuthController يملك login كامل
    // ----------------------------------------------

    @Transactional
    public User register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setActive(true);

        // Roles
        Set<User.Role> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String role : request.getRoles()) {
                roles.add(User.Role.valueOf(role.toUpperCase()));
            }
        } else {
            // Default role
            roles.add(User.Role.MEMBER);
        }
        user.setRoles(roles);

        // Organization
        if (request.getOrganizationId() != null) {
            Organization organization = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new BadRequestException("Organization not found"));
            user.setOrganization(organization);
        }

        // Provider
        if (request.getProviderId() != null) {
            Provider provider = providerRepository.findById(request.getProviderId())
                    .orElseThrow(() -> new BadRequestException("Provider not found"));
            user.setProvider(provider);
        }

        return userRepository.save(user);
    }
}
