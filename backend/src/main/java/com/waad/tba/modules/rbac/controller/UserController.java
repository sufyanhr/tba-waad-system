package com.waad.tba.modules.rbac.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.rbac.dto.*;
import com.waad.tba.modules.rbac.service.UserService;
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
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('users.view')")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllUsers() {
        List<UserResponseDto> users = userService.findAll();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('users.view')")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable Long id) {
        UserResponseDto user = userService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('users.manage')")
    public ResponseEntity<ApiResponse<UserResponseDto>> createUser(@Valid @RequestBody UserCreateDto dto) {
        UserResponseDto createdUser = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", createdUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('users.manage')")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDto dto) {
        UserResponseDto updatedUser = userService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('users.manage')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('users.view')")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> searchUsers(@RequestParam String query) {
        List<UserResponseDto> users = userService.search(query);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/paginate")
    @PreAuthorize("hasAuthority('users.view')")
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> getUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<UserResponseDto> users = userService.findAllPaginated(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping("/{id}/assign-roles")
    @PreAuthorize("hasAuthority('users.assign_roles')")
    public ResponseEntity<ApiResponse<UserResponseDto>> assignRoles(
            @PathVariable Long id,
            @Valid @RequestBody AssignRolesDto dto) {
        UserResponseDto user = userService.assignRoles(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Roles assigned successfully", user));
    }
}
