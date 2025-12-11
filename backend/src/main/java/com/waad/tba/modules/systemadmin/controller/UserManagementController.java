package com.waad.tba.modules.systemadmin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.systemadmin.dto.UserCreateDto;
import com.waad.tba.modules.systemadmin.dto.UserUpdateDto;
import com.waad.tba.modules.systemadmin.dto.UserViewDto;
import com.waad.tba.modules.systemadmin.service.UserManagementService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * User Management Controller
 * Phase 2 - System Administration
 * 
 * REST API for user management (SUPER_ADMIN only)
 * Base path: /api/admin/users
 */
@RestController
@RequestMapping("/api/admin/users")
@Tag(name = "User Management", description = "User CRUD operations (SUPER_ADMIN only)")
@Slf4j
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class UserManagementController {

    private final UserManagementService userManagementService;

    /**
     * GET /api/admin/users
     * Get all users (paginated)
     */
    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve paginated list of all users")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<Page<UserViewDto>> getAllUsers(Pageable pageable) {
        log.info("GET /api/admin/users - page {}", pageable.getPageNumber());
        Page<UserViewDto> users = userManagementService.getAllUsers(pageable);
        return ApiResponse.success("Users retrieved successfully", users);
    }

    /**
     * GET /api/admin/users/{id}
     * Get user by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve single user details")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<UserViewDto> getUserById(@PathVariable Long id) {
        log.info("GET /api/admin/users/{}", id);
        UserViewDto user = userManagementService.getUserById(id);
        return ApiResponse.success("User retrieved successfully", user);
    }

    /**
     * GET /api/admin/users/search
     * Search users
     */
    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Search users by username, email, or full name")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<List<UserViewDto>> searchUsers(@RequestParam String q) {
        log.info("GET /api/admin/users/search?q={}", q);
        List<UserViewDto> users = userManagementService.searchUsers(q);
        return ApiResponse.success("Search completed successfully", users);
    }

    /**
     * POST /api/admin/users
     * Create new user
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create user", description = "Create a new user with specified roles")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "User created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error or username/email already exists"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<UserViewDto> createUser(@Valid @RequestBody UserCreateDto dto,
                                               Authentication authentication) {
        log.info("POST /api/admin/users - Creating user: {}", dto.getUsername());
        String createdBy = authentication.getName();
        UserViewDto created = userManagementService.createUser(dto, createdBy);
        return ApiResponse.success("User created successfully", created);
    }

    /**
     * PUT /api/admin/users/{id}
     * Update user
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Update existing user details")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<UserViewDto> updateUser(@PathVariable Long id,
                                               @Valid @RequestBody UserUpdateDto dto,
                                               Authentication authentication) {
        log.info("PUT /api/admin/users/{} - Updating user", id);
        String updatedBy = authentication.getName();
        UserViewDto updated = userManagementService.updateUser(id, dto, updatedBy);
        return ApiResponse.success("User updated successfully", updated);
    }

    /**
     * DELETE /api/admin/users/{id}
     * Delete user
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Permanently delete a user")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<Void> deleteUser(@PathVariable Long id, Authentication authentication) {
        log.info("DELETE /api/admin/users/{}", id);
        String deletedBy = authentication.getName();
        userManagementService.deleteUser(id, deletedBy);
        return ApiResponse.success("User deleted successfully", null);
    }

    /**
     * PUT /api/admin/users/{id}/toggle
     * Toggle user active status
     */
    @PutMapping("/{id}/toggle")
    @Operation(summary = "Toggle user status", description = "Activate or deactivate a user")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User status toggled successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<UserViewDto> toggleUserStatus(@PathVariable Long id,
                                                     @RequestParam Boolean active,
                                                     Authentication authentication) {
        log.info("PUT /api/admin/users/{}/toggle?active={}", id, active);
        String updatedBy = authentication.getName();
        UserViewDto toggled = userManagementService.toggleUserStatus(id, active, updatedBy);
        return ApiResponse.success("User status toggled successfully", toggled);
    }

    /**
     * PUT /api/admin/users/{id}/reset-password
     * Reset user password
     */
    @PutMapping("/{id}/reset-password")
    @Operation(summary = "Reset user password", description = "Reset password for a user")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<Void> resetPassword(@PathVariable Long id,
                                           @RequestBody Map<String, String> payload,
                                           Authentication authentication) {
        log.info("PUT /api/admin/users/{}/reset-password", id);
        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ApiResponse.error("New password is required");
        }
        String updatedBy = authentication.getName();
        userManagementService.resetUserPassword(id, newPassword, updatedBy);
        return ApiResponse.success("Password reset successfully", null);
    }

    /**
     * PUT /api/admin/users/{id}/roles
     * Assign roles to user
     */
    @PutMapping("/{id}/roles")
    @Operation(summary = "Assign roles to user", description = "Add roles to a user")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Roles assigned successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User or role not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<UserViewDto> assignRoles(@PathVariable Long id,
                                                @RequestBody Map<String, List<String>> payload,
                                                Authentication authentication) {
        log.info("PUT /api/admin/users/{}/roles", id);
        List<String> roleNames = payload.get("roles");
        if (roleNames == null || roleNames.isEmpty()) {
            return ApiResponse.error("Roles list is required");
        }
        String updatedBy = authentication.getName();
        UserViewDto updated = userManagementService.assignRoles(id, roleNames, updatedBy);
        return ApiResponse.success("Roles assigned successfully", updated);
    }

    /**
     * DELETE /api/admin/users/{id}/roles
     * Remove roles from user
     */
    @DeleteMapping("/{id}/roles")
    @Operation(summary = "Remove roles from user", description = "Remove roles from a user")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Roles removed successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User or role not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<UserViewDto> removeRoles(@PathVariable Long id,
                                                @RequestBody Map<String, List<String>> payload,
                                                Authentication authentication) {
        log.info("DELETE /api/admin/users/{}/roles", id);
        List<String> roleNames = payload.get("roles");
        if (roleNames == null || roleNames.isEmpty()) {
            return ApiResponse.error("Roles list is required");
        }
        String updatedBy = authentication.getName();
        UserViewDto updated = userManagementService.removeRoles(id, roleNames, updatedBy);
        return ApiResponse.success("Roles removed successfully", updated);
    }
}
