package com.waad.tba.common.config;

import com.waad.tba.modules.rbac.entity.Permission;
import com.waad.tba.modules.rbac.entity.Role;
import com.waad.tba.modules.rbac.entity.User;
import com.waad.tba.modules.rbac.repository.PermissionRepository;
import com.waad.tba.modules.rbac.repository.RoleRepository;
import com.waad.tba.modules.rbac.repository.UserRepository;
import com.waad.tba.security.AppPermission;
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

        // Create permissions from AppPermission enum + legacy permissions
        List<Permission> newPermissions = Arrays.asList(
                // AppPermission enum values
                createPermission(AppPermission.MANAGE_SYSTEM_SETTINGS.name(), AppPermission.MANAGE_SYSTEM_SETTINGS.getDescription()),
                createPermission(AppPermission.MANAGE_USERS.name(), AppPermission.MANAGE_USERS.getDescription()),
                createPermission(AppPermission.MANAGE_ROLES.name(), AppPermission.MANAGE_ROLES.getDescription()),
                createPermission(AppPermission.MANAGE_MEMBERS.name(), AppPermission.MANAGE_MEMBERS.getDescription()),
                createPermission(AppPermission.MANAGE_EMPLOYERS.name(), AppPermission.MANAGE_EMPLOYERS.getDescription()),
                createPermission(AppPermission.MANAGE_PROVIDERS.name(), AppPermission.MANAGE_PROVIDERS.getDescription()),
                createPermission(AppPermission.MANAGE_CLAIMS.name(), AppPermission.MANAGE_CLAIMS.getDescription()),
                createPermission(AppPermission.MANAGE_VISITS.name(), AppPermission.MANAGE_VISITS.getDescription()),
                createPermission(AppPermission.MANAGE_REPORTS.name(), AppPermission.MANAGE_REPORTS.getDescription()),
                
                // Legacy permissions (for backward compatibility)
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
        List<Permission> permissions = permissionRepository.saveAll(newPermissions);

        // Create SUPER_ADMIN role with ALL permissions
        Role superAdminRole = Role.builder()
                .name("SUPER_ADMIN")
                .description("Super Administrator with full system access")
                .permissions(new HashSet<>(permissions))
                .build();
        roleRepository.save(superAdminRole);
        log.info("Created SUPER_ADMIN role with {} permissions", permissions.size());

        // Create ADMIN role with most permissions (except MANAGE_SYSTEM_SETTINGS)
        Set<Permission> adminPermissions = new HashSet<>(permissions);
        adminPermissions.removeIf(p -> p.getName().equals("MANAGE_SYSTEM_SETTINGS"));
        Role adminRole = Role.builder()
                .name("ADMIN")
                .description("Administrator with full access")
                .permissions(adminPermissions)
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

        // Create super admin user with SUPER_ADMIN role
        if (!userRepository.existsByEmail("admin@tba.sa")) {
            User superAdmin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("Super Administrator")
                    .email("admin@tba.sa")
                    .phone("+966500000000")
                    .active(true)
                    .roles(new HashSet<>(Arrays.asList(superAdminRole)))
                    .build();
            userRepository.save(superAdmin);
            log.info("Super admin user created: admin@tba.sa / Admin@123");
        } else {
            log.info("Admin user already exists, ensuring SUPER_ADMIN role...");
            User existingAdmin = userRepository.findByEmail("admin@tba.sa").orElseThrow();
            boolean hasRole = existingAdmin.getRoles().stream()
                    .anyMatch(role -> "SUPER_ADMIN".equals(role.getName()));
            
            if (!hasRole) {
                existingAdmin.getRoles().add(superAdminRole);
                userRepository.save(existingAdmin);
                log.info("Added SUPER_ADMIN role to existing admin user");
            }
        }

        log.info("Seed data initialized successfully: {} permissions, 4 roles (SUPER_ADMIN, ADMIN, MANAGER, USER)", permissions.size());
    }

    private Permission createPermission(String name, String description) {
        return Permission.builder()
                .name(name)
                .description(description)
                .build();
    }
}
