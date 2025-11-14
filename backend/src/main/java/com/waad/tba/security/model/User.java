package com.waad.tba.security.model;

import com.waad.tba.modules.employers.model.Organization;
import com.waad.tba.modules.insurance.model.InsuranceCompany;
import com.waad.tba.modules.insurance.model.ReviewCompany;
import com.waad.tba.modules.providers.model.Provider;
import com.waad.tba.rbac.model.Permission;
import com.waad.tba.rbac.model.Role;
import com.waad.tba.rbac.model.UserRole;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    private String phone;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<UserRole> userRoles = new HashSet<>();


    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne
    @JoinColumn(name = "insurance_company_id")
    private InsuranceCompany insuranceCompany;

    @ManyToOne
    @JoinColumn(name = "review_company_id")
    private ReviewCompany reviewCompany;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private Provider provider;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ===== UserDetails Implementation =====
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userRoles.stream()
                .filter(UserRole::getActive)
                .flatMap(userRole -> {
                    Set<GrantedAuthority> authorities = new HashSet<>();
                    // Add role authority
                    authorities.add(() -> "ROLE_" + userRole.getRole().getName());
                    // Add permission authorities
                    userRole.getRole().getPermissions().forEach(permission -> 
                        authorities.add(() -> permission.getName()));
                    return authorities.stream();
                })
                .collect(Collectors.toSet());
    }

    @Override
    public boolean isAccountNonExpired() {
        return active;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return active;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

    // ===== Helper Methods =====
    public Set<Role> getActiveRoles() {
        return userRoles.stream()
                .filter(UserRole::getActive)
                .map(UserRole::getRole)
                .collect(Collectors.toSet());
    }

    public Set<Permission> getAllPermissions() {
        return getActiveRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .collect(Collectors.toSet());
    }

    public boolean hasRole(String roleName) {
        return getActiveRoles().stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }

    public boolean hasPermission(String permissionName) {
        return getAllPermissions().stream()
                .anyMatch(permission -> permission.getName().equals(permissionName));
    }

}
