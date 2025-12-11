package com.waad.tba.modules.systemadmin.controller;

import com.waad.tba.common.dto.ResponseDto;
import com.waad.tba.modules.systemadmin.dto.FeatureFlagDto;
import com.waad.tba.modules.systemadmin.service.FeatureFlagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Feature Flag Controller
 * Phase 2 - System Administration
 * 
 * Manages feature flags (SUPER_ADMIN only)
 * Base Path: /api/admin/features
 */
@RestController
@RequestMapping("/api/admin/features")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "System Admin - Feature Flags", description = "Feature flag management (SUPER_ADMIN only)")
public class FeatureFlagController {

    private final FeatureFlagService featureFlagService;

    /**
     * GET /api/admin/features
     * Get all feature flags
     */
    @GetMapping
    @Operation(summary = "Get all feature flags", description = "Retrieve all feature flags (SUPER_ADMIN only)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved feature flags"),
        @ApiResponse(responseCode = "403", description = "Access denied - SUPER_ADMIN only")
    })
    public ResponseEntity<ResponseDto<List<FeatureFlagDto>>> getAllFeatureFlags() {
        log.info("GET /api/admin/features - Get all feature flags");
        
        List<FeatureFlagDto> flags = featureFlagService.getAllFeatureFlags();
        
        return ResponseEntity.ok(ResponseDto.<List<FeatureFlagDto>>builder()
                .success(true)
                .message("Feature flags retrieved successfully")
                .data(flags)
                .build());
    }

    /**
     * GET /api/admin/features/{key}
     * Get feature flag by key
     */
    @GetMapping("/{key}")
    @Operation(summary = "Get feature flag by key", description = "Retrieve specific feature flag by key")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Feature flag found"),
        @ApiResponse(responseCode = "404", description = "Feature flag not found")
    })
    public ResponseEntity<ResponseDto<FeatureFlagDto>> getFeatureFlagByKey(@PathVariable String key) {
        log.info("GET /api/admin/features/{} - Get feature flag by key", key);
        
        FeatureFlagDto flag = featureFlagService.getFeatureFlagByKey(key);
        
        return ResponseEntity.ok(ResponseDto.<FeatureFlagDto>builder()
                .success(true)
                .message("Feature flag retrieved successfully")
                .data(flag)
                .build());
    }

    /**
     * POST /api/admin/features
     * Create new feature flag
     */
    @PostMapping
    @Operation(summary = "Create feature flag", description = "Create a new feature flag")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Feature flag created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or feature flag already exists")
    })
    public ResponseEntity<ResponseDto<FeatureFlagDto>> createFeatureFlag(
            @Valid @RequestBody FeatureFlagDto dto,
            Authentication authentication) {
        
        String username = authentication.getName();
        log.info("POST /api/admin/features - Create feature flag: {} by {}", dto.getFlagKey(), username);
        
        FeatureFlagDto created = featureFlagService.createFeatureFlag(dto, username);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDto.<FeatureFlagDto>builder()
                        .success(true)
                        .message("Feature flag created successfully")
                        .data(created)
                        .build());
    }

    /**
     * PUT /api/admin/features/{key}/toggle
     * Toggle feature flag (enable/disable)
     */
    @PutMapping("/{key}/toggle")
    @Operation(summary = "Toggle feature flag", description = "Enable or disable a feature flag")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Feature flag toggled successfully"),
        @ApiResponse(responseCode = "404", description = "Feature flag not found")
    })
    public ResponseEntity<ResponseDto<FeatureFlagDto>> toggleFeatureFlag(
            @PathVariable String key,
            @RequestBody Map<String, Boolean> request,
            Authentication authentication) {
        
        String username = authentication.getName();
        Boolean enabled = request.get("enabled");
        log.info("PUT /api/admin/features/{}/toggle - Toggle to {} by {}", key, enabled, username);
        
        FeatureFlagDto updated = featureFlagService.toggleFeatureFlag(key, enabled, username);
        
        return ResponseEntity.ok(ResponseDto.<FeatureFlagDto>builder()
                .success(true)
                .message("Feature flag toggled successfully")
                .data(updated)
                .build());
    }

    /**
     * PUT /api/admin/features/{key}
     * Update feature flag
     */
    @PutMapping("/{key}")
    @Operation(summary = "Update feature flag", description = "Update an existing feature flag")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Feature flag updated successfully"),
        @ApiResponse(responseCode = "404", description = "Feature flag not found")
    })
    public ResponseEntity<ResponseDto<FeatureFlagDto>> updateFeatureFlag(
            @PathVariable String key,
            @Valid @RequestBody FeatureFlagDto dto,
            Authentication authentication) {
        
        String username = authentication.getName();
        log.info("PUT /api/admin/features/{} - Update feature flag by {}", key, username);
        
        FeatureFlagDto updated = featureFlagService.updateFeatureFlag(key, dto, username);
        
        return ResponseEntity.ok(ResponseDto.<FeatureFlagDto>builder()
                .success(true)
                .message("Feature flag updated successfully")
                .data(updated)
                .build());
    }

    /**
     * DELETE /api/admin/features/{key}
     * Delete feature flag
     */
    @DeleteMapping("/{key}")
    @Operation(summary = "Delete feature flag", description = "Delete a feature flag")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Feature flag deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Feature flag not found")
    })
    public ResponseEntity<ResponseDto<Void>> deleteFeatureFlag(
            @PathVariable String key,
            Authentication authentication) {
        
        String username = authentication.getName();
        log.info("DELETE /api/admin/features/{} - Delete feature flag by {}", key, username);
        
        featureFlagService.deleteFeatureFlag(key, username);
        
        return ResponseEntity.ok(ResponseDto.<Void>builder()
                .success(true)
                .message("Feature flag deleted successfully")
                .build());
    }
}
