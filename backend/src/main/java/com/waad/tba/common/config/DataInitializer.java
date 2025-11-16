package com.waad.tba.common.config;

import com.waad.tba.modules.rbac.entity.Permission;
import com.waad.tba.modules.rbac.entity.Role;
import com.waad.tba.modules.rbac.entity.User;
import com.waad.tba.modules.rbac.repository.PermissionRepository;
import com.waad.tba.modules.rbac.repository.RoleRepository;
import com.waad.tba.modules.rbac.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void init() {
        if (permissionRepository.count() > 0) {
            log.info("Data already initialized, skipping seed");
            return;
        }

        log.info("Initializing seed data...");

        // Create permissions
        List<Permission> permissions = Arrays.asList(
                createPermission("rbac.view", "View RBAC settings"),
                createPermission("rbac.manage", "Manage RBAC settings"),
                createPermission("user.view", "View users"),
                createPermission("user.manage", "Manage users"),
                createPermission("role.view", "View roles"),
                createPermission("role.manage", "Manage roles"),
                createPermission("permission.view", "View permissions"),
                createPermission("permission.manage", "Manage permissions"),
                createPermission("insurance.view", "View insurance companies"),
                createPermission("insurance.manage", "Manage insurance companies"),
                createPermission("reviewer.view", "View reviewer companies"),
                createPermission("reviewer.manage", "Manage reviewer companies"),
                createPermission("employer.view", "View employers"),
                createPermission("employer.manage", "Manage employers"),
                createPermission("member.view", "View members"),
                createPermission("member.manage", "Manage members"),
                createPermission("visit.view", "View visits"),
                createPermission("visit.manage", "Manage visits"),
                createPermission("claim.view", "View claims"),
                createPermission("claim.manage", "Manage claims"),
                createPermission("claim.approve", "Approve claims"),
                createPermission("claim.reject", "Reject claims"),
                createPermission("dashboard.view", "View dashboard")
        );
        permissionRepository.saveAll(permissions);

        // Create ADMIN role with all permissions
        Role adminRole = Role.builder()
                .name("ADMIN")
                .description("Administrator with full access")
                .permissions(new HashSet<>(permissions))
                .build();
        roleRepository.save(adminRole);

        // Create MANAGER role with limited permissions
        Set<Permission> managerPermissions = new HashSet<>();
        permissions.forEach(p -> {
            if (!p.getName().contains(".manage") || p.getName().startsWith("claim.") || p.getName().startsWith("member.")) {
                managerPermissions.add(p);
            }
        });
        Role managerRole = Role.builder()
                .name("MANAGER")
                .description("Manager with limited management access")
                .permissions(managerPermissions)
                .build();
        roleRepository.save(managerRole);

        // Create USER role with view-only permissions
        Set<Permission> userPermissions = new HashSet<>();
        permissions.forEach(p -> {
            if (p.getName().contains(".view")) {
                userPermissions.add(p);
            }
        });
        Role userRole = Role.builder()
                .name("USER")
                .description("Regular user with view access")
                .permissions(userPermissions)
                .build();
        roleRepository.save(userRole);

        // Create admin user
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .fullName("System Administrator")
                .email("admin@tba-waad.com")
                .active(true)
                .roles(new HashSet<>(Arrays.asList(adminRole)))
                .build();
        userRepository.save(admin);

        log.info("Seed data initialized successfully: {} permissions, 3 roles, 1 user", permissions.size());
    }

    private Permission createPermission(String name, String description) {
        return Permission.builder()
                .name(name)
                .description(description)
                .build();
    }
}
