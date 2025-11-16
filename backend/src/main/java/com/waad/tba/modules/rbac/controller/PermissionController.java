package com.waad.tba.modules.rbac.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.rbac.dto.PermissionCreateDto;
import com.waad.tba.modules.rbac.dto.PermissionResponseDto;
import com.waad.tba.modules.rbac.service.PermissionService;
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
@RequestMapping("/api/admin/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    @PreAuthorize("hasAuthority('permissions.view')")
    public ResponseEntity<ApiResponse<List<PermissionResponseDto>>> getAllPermissions() {
        List<PermissionResponseDto> permissions = permissionService.findAll();
        return ResponseEntity.ok(ApiResponse.success(permissions));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('permissions.view')")
    public ResponseEntity<ApiResponse<PermissionResponseDto>> getPermissionById(@PathVariable Long id) {
        PermissionResponseDto permission = permissionService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(permission));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('permissions.manage')")
    public ResponseEntity<ApiResponse<PermissionResponseDto>> createPermission(@Valid @RequestBody PermissionCreateDto dto) {
        PermissionResponseDto createdPermission = permissionService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Permission created successfully", createdPermission));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('permissions.manage')")
    public ResponseEntity<ApiResponse<PermissionResponseDto>> updatePermission(
            @PathVariable Long id,
            @Valid @RequestBody PermissionCreateDto dto) {
        PermissionResponseDto updatedPermission = permissionService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Permission updated successfully", updatedPermission));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('permissions.manage')")
    public ResponseEntity<ApiResponse<Void>> deletePermission(@PathVariable Long id) {
        permissionService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Permission deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('permissions.view')")
    public ResponseEntity<ApiResponse<List<PermissionResponseDto>>> searchPermissions(@RequestParam String query) {
        List<PermissionResponseDto> permissions = permissionService.search(query);
        return ResponseEntity.ok(ApiResponse.success(permissions));
    }

    @GetMapping("/paginate")
    @PreAuthorize("hasAuthority('permissions.view')")
    public ResponseEntity<ApiResponse<Page<PermissionResponseDto>>> getPermissionsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PermissionResponseDto> permissions = permissionService.findAllPaginated(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(permissions));
    }
}
