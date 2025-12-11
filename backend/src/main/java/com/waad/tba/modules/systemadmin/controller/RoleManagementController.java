package com.waad.tba.modules.systemadmin.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.systemadmin.dto.RoleCreateDto;
import com.waad.tba.modules.systemadmin.dto.RoleUpdateDto;
import com.waad.tba.modules.systemadmin.dto.RoleViewDto;
import com.waad.tba.modules.systemadmin.service.RoleManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Role Management Controller
 * Phase 2 - System Administration
 * 
 * REST API for role management (SUPER_ADMIN only)
 * Base path: /api/admin/roles
 */
@RestController
@RequestMapping("/api/admin/roles")
@Tag(name = "Role Management", description = "Role CRUD and permission assignment (SUPER_ADMIN only)")
@Slf4j
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class RoleManagementController {

    private final RoleManagementService roleManagementService;

    /**
     * GET /api/admin/roles
     * Get all roles
     */
    @GetMapping
    @Operation(summary = "Get all roles", description = "Retrieve all roles with user counts")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Roles retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<List<RoleViewDto>> getAllRoles() {
        log.info("GET /api/admin/roles");
        List<RoleViewDto> roles = roleManagementService.getAllRoles();
        return ApiResponse.success("Roles retrieved successfully", roles);
    }

    /**
     * GET /api/admin/roles/{id}
     * Get role by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get role by ID", description = "Retrieve single role details")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Role retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Role not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<RoleViewDto> getRoleById(@PathVariable Long id) {
        log.info("GET /api/admin/roles/{}", id);
        RoleViewDto role = roleManagementService.getRoleById(id);
        return ApiResponse.success("Role retrieved successfully", role);
    }

    /**
     * GET /api/admin/roles/name/{name}
     * Get role by name
     */
    @GetMapping("/name/{name}")
    @Operation(summary = "Get role by name", description = "Retrieve role by name")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Role retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Role not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<RoleViewDto> getRoleByName(@PathVariable String name) {
        log.info("GET /api/admin/roles/name/{}", name);
        RoleViewDto role = roleManagementService.getRoleByName(name);
        return ApiResponse.success("Role retrieved successfully", role);
    }

    /**
     * GET /api/admin/roles/search
     * Search roles
     */
    @GetMapping("/search")
    @Operation(summary = "Search roles", description = "Search roles by name or description")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<List<RoleViewDto>> searchRoles(@RequestParam String q) {
        log.info("GET /api/admin/roles/search?q={}", q);
        List<RoleViewDto> roles = roleManagementService.searchRoles(q);
        return ApiResponse.success("Search completed successfully", roles);
    }

    /**
     * POST /api/admin/roles
     * Create new role
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create role", description = "Create a new role with specified permissions")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Role created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error or role name already exists"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<RoleViewDto> createRole(@Valid @RequestBody RoleCreateDto dto,
                                               Authentication authentication) {
        log.info("POST /api/admin/roles - Creating role: {}", dto.getName());
        String createdBy = authentication.getName();
        RoleViewDto created = roleManagementService.createRole(dto, createdBy);
        return ApiResponse.success("Role created successfully", created);
    }

    /**
     * PUT /api/admin/roles/{id}
     * Update role
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update role", description = "Update existing role details")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Role updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Role not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<RoleViewDto> updateRole(@PathVariable Long id,
                                               @Valid @RequestBody RoleUpdateDto dto,
                                               Authentication authentication) {
        log.info("PUT /api/admin/roles/{} - Updating role", id);
        String updatedBy = authentication.getName();
        RoleViewDto updated = roleManagementService.updateRole(id, dto, updatedBy);
        return ApiResponse.success("Role updated successfully", updated);
    }

    /**
     * DELETE /api/admin/roles/{id}
     * Delete role
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete role", description = "Permanently delete a role (if not in use)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Role deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Role not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Role is in use by users"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<Void> deleteRole(@PathVariable Long id, Authentication authentication) {
        log.info("DELETE /api/admin/roles/{}", id);
        String deletedBy = authentication.getName();
        roleManagementService.deleteRole(id, deletedBy);
        return ApiResponse.success("Role deleted successfully", null);
    }

    /**
     * GET /api/admin/roles/{id}/users
     * Get users with specific role
     */
    @GetMapping("/{id}/users")
    @Operation(summary = "Get users with role", description = "List all users assigned to this role")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Role not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<List<String>> getUsersWithRole(@PathVariable Long id) {
        log.info("GET /api/admin/roles/{}/users", id);
        List<String> usernames = roleManagementService.getUsersWithRole(id);
        return ApiResponse.success("Users retrieved successfully", usernames);
    }

    /**
     * PUT /api/admin/roles/{id}/permissions
     * Assign permissions to role
     */
    @PutMapping("/{id}/permissions")
    @Operation(summary = "Assign permissions to role", description = "Add permissions to a role")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Permissions assigned successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Role or permission not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<RoleViewDto> assignPermissions(@PathVariable Long id,
                                                      @RequestBody Map<String, List<String>> payload,
                                                      Authentication authentication) {
        log.info("PUT /api/admin/roles/{}/permissions", id);
        List<String> permissionNames = payload.get("permissions");
        if (permissionNames == null || permissionNames.isEmpty()) {
            return ApiResponse.error("Permissions list is required");
        }
        String updatedBy = authentication.getName();
        RoleViewDto updated = roleManagementService.assignPermissions(id, permissionNames, updatedBy);
        return ApiResponse.success("Permissions assigned successfully", updated);
    }

    /**
     * DELETE /api/admin/roles/{id}/permissions
     * Remove permissions from role
     */
    @DeleteMapping("/{id}/permissions")
    @Operation(summary = "Remove permissions from role", description = "Remove permissions from a role")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Permissions removed successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Role or permission not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - SUPER_ADMIN only")
    })
    public ApiResponse<RoleViewDto> removePermissions(@PathVariable Long id,
                                                      @RequestBody Map<String, List<String>> payload,
                                                      Authentication authentication) {
        log.info("DELETE /api/admin/roles/{}/permissions", id);
        List<String> permissionNames = payload.get("permissions");
        if (permissionNames == null || permissionNames.isEmpty()) {
            return ApiResponse.error("Permissions list is required");
        }
        String updatedBy = authentication.getName();
        RoleViewDto updated = roleManagementService.removePermissions(id, permissionNames, updatedBy);
        return ApiResponse.success("Permissions removed successfully", updated);
    }
}
