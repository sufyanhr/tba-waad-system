package com.waad.tba.rbac.controller;

import com.waad.tba.core.dto.ApiResponse;
import com.waad.tba.rbac.model.Role;
import com.waad.tba.rbac.model.UserRole;
import com.waad.tba.rbac.service.UserRoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/user-roles")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "User Roles", description = "User role assignment management endpoints")
public class UserRoleController {

    private final UserRoleService userRoleService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEW')")
    @Operation(summary = "Get all user roles")
    public ResponseEntity<List<UserRole>> getAllUserRoles() {
        return ResponseEntity.ok(userRoleService.getAllUserRoles());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEW')")
    @Operation(summary = "Get user role by ID")
    public ResponseEntity<UserRole> getUserRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(userRoleService.getUserRoleById(id));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEW') or #userId == authentication.principal.id")
    @Operation(summary = "Get user roles by user ID")
    public ResponseEntity<List<UserRole>> getUserRolesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userRoleService.getUserRolesByUserId(userId));
    }

    @GetMapping("/user/{userId}/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEW') or #userId == authentication.principal.id")
    @Operation(summary = "Get active user roles by user ID")
    public ResponseEntity<List<UserRole>> getActiveUserRolesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userRoleService.getActiveUserRolesByUserId(userId));
    }

    @GetMapping("/user/{userId}/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEW') or #userId == authentication.principal.id")
    @Operation(summary = "Get active roles by user ID")
    public ResponseEntity<List<Role>> getActiveRolesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userRoleService.getActiveRolesByUserId(userId));
    }

    @GetMapping("/role/{roleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEW')")
    @Operation(summary = "Get user roles by role ID")
    public ResponseEntity<List<UserRole>> getUserRolesByRoleId(@PathVariable Long roleId) {
        return ResponseEntity.ok(userRoleService.getUserRolesByRoleId(roleId));
    }

    @GetMapping("/role/{roleId}/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEW')")
    @Operation(summary = "Get active user roles by role ID")
    public ResponseEntity<List<UserRole>> getActiveUserRolesByRoleId(@PathVariable Long roleId) {
        return ResponseEntity.ok(userRoleService.getActiveUserRolesByRoleId(roleId));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign role to user")
    public ResponseEntity<UserRole> assignRoleToUser(@RequestParam Long userId, @RequestParam Long roleId) {
        UserRole userRole = userRoleService.assignRoleToUser(userId, roleId);
        return ResponseEntity.status(HttpStatus.CREATED).body(userRole);
    }

    @DeleteMapping("/remove")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove role from user")
    public ResponseEntity<ApiResponse> removeRoleFromUser(@RequestParam Long userId, @RequestParam Long roleId) {
        userRoleService.removeRoleFromUser(userId, roleId);
        return ResponseEntity.ok(new ApiResponse(true, "Role removed from user successfully"));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate user role")
    public ResponseEntity<UserRole> activateUserRole(@PathVariable Long id) {
        UserRole userRole = userRoleService.activateUserRole(id);
        return ResponseEntity.ok(userRole);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate user role")
    public ResponseEntity<UserRole> deactivateUserRole(@PathVariable Long id) {
        UserRole userRole = userRoleService.deactivateUserRole(id);
        return ResponseEntity.ok(userRole);
    }

    @PutMapping("/user/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Set user roles")
    public ResponseEntity<ApiResponse> setUserRoles(@PathVariable Long userId, @RequestBody Set<Long> roleIds) {
        userRoleService.setUserRoles(userId, roleIds);
        return ResponseEntity.ok(new ApiResponse(true, "User roles updated successfully"));
    }

    @GetMapping("/user/{userId}/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEW')")
    @Operation(summary = "Count active roles for user")
    public ResponseEntity<Long> countActiveRolesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userRoleService.countActiveRolesByUserId(userId));
    }

    @GetMapping("/user/{userId}/has-role/{roleName}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEW') or #userId == authentication.principal.id")
    @Operation(summary = "Check if user has specific role")
    public ResponseEntity<Boolean> userHasRole(@PathVariable Long userId, @PathVariable String roleName) {
        return ResponseEntity.ok(userRoleService.userHasRole(userId, roleName));
    }
}