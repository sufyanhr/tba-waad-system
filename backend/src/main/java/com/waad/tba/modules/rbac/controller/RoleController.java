package com.waad.tba.modules.rbac.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.rbac.dto.*;
import com.waad.tba.modules.rbac.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasAuthority('roles.view')")
    public ResponseEntity<ApiResponse<List<RoleResponseDto>>> getAllRoles() {
        List<RoleResponseDto> roles = roleService.findAll();
        return ResponseEntity.ok(ApiResponse.success(roles));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('roles.view')")
    public ResponseEntity<ApiResponse<RoleResponseDto>> getRoleById(@PathVariable Long id) {
        RoleResponseDto role = roleService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(role));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('roles.manage')")
    public ResponseEntity<ApiResponse<RoleResponseDto>> createRole(@Valid @RequestBody RoleCreateDto dto) {
        RoleResponseDto createdRole = roleService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Role created successfully", createdRole));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('roles.manage')")
    public ResponseEntity<ApiResponse<RoleResponseDto>> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleCreateDto dto) {
        RoleResponseDto updatedRole = roleService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Role updated successfully", updatedRole));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('roles.manage')")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Role deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('roles.view')")
    public ResponseEntity<ApiResponse<List<RoleResponseDto>>> searchRoles(@RequestParam String query) {
        List<RoleResponseDto> roles = roleService.search(query);
        return ResponseEntity.ok(ApiResponse.success(roles));
    }

    @GetMapping("/paginate")
    @PreAuthorize("hasAuthority('roles.view')")
    public ResponseEntity<ApiResponse<Page<RoleResponseDto>>> getRolesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RoleResponseDto> roles = roleService.findAllPaginated(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(roles));
    }

    @PostMapping("/{id}/assign-permissions")
    @PreAuthorize("hasAuthority('roles.assign_permissions')")
    public ResponseEntity<ApiResponse<RoleResponseDto>> assignPermissions(
            @PathVariable Long id,
            @Valid @RequestBody AssignPermissionsDto dto) {
        RoleResponseDto role = roleService.assignPermissions(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Permissions assigned successfully", role));
    }
}
