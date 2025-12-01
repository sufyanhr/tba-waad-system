package com.waad.tba.modules.provider.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.provider.dto.ProviderCreateDto;
import com.waad.tba.modules.provider.dto.ProviderResponseDto;
import com.waad.tba.modules.provider.dto.ProviderUpdateDto;
import com.waad.tba.modules.provider.entity.Provider.ProviderType;
import com.waad.tba.modules.provider.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Provider management
 */
@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
@Tag(name = "Provider Management", description = "APIs for managing healthcare providers")
public class ProviderController {

    private final ProviderService providerService;

    /**
     * Create a new provider
     */
    @PostMapping
    @Operation(summary = "Create provider", description = "Create a new healthcare provider")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> create(@Valid @RequestBody ProviderCreateDto dto) {
        ProviderResponseDto created = providerService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Provider created successfully", created));
    }

    /**
     * Update an existing provider
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update provider", description = "Update an existing provider")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody ProviderUpdateDto dto) {
        ProviderResponseDto updated = providerService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Provider updated successfully", updated));
    }

    /**
     * Get provider by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get provider by ID", description = "Retrieve a provider by its ID")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> getById(@PathVariable Long id) {
        ProviderResponseDto provider = providerService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Provider retrieved successfully", provider));
    }

    /**
     * Get provider by code
     */
    @GetMapping("/code/{code}")
    @Operation(summary = "Get provider by code", description = "Retrieve a provider by its unique code")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> getByCode(@PathVariable String code) {
        ProviderResponseDto provider = providerService.getByCode(code);
        return ResponseEntity.ok(ApiResponse.success("Provider retrieved successfully", provider));
    }

    /**
     * Get all providers
     */
    @GetMapping
    @Operation(summary = "Get all providers", description = "Retrieve all providers")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getAll() {
        List<ProviderResponseDto> providers = providerService.getAll();
        return ResponseEntity.ok(ApiResponse.success("Providers retrieved successfully", providers));
    }

    /**
     * Get active providers only
     */
    @GetMapping("/active")
    @Operation(summary = "Get active providers", description = "Retrieve all active providers")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getActive() {
        List<ProviderResponseDto> providers = providerService.getActiveProviders();
        return ResponseEntity.ok(ApiResponse.success("Active providers retrieved successfully", providers));
    }

    /**
     * Get providers by type
     */
    @GetMapping("/type/{type}")
    @Operation(summary = "Get providers by type", description = "Retrieve providers filtered by type")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getByType(@PathVariable ProviderType type) {
        List<ProviderResponseDto> providers = providerService.getByType(type);
        return ResponseEntity.ok(ApiResponse.success("Providers retrieved successfully", providers));
    }

    /**
     * Get active providers by type
     */
    @GetMapping("/active/type/{type}")
    @Operation(summary = "Get active providers by type", description = "Retrieve active providers filtered by type")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getActiveByType(@PathVariable ProviderType type) {
        List<ProviderResponseDto> providers = providerService.getActiveProvidersByType(type);
        return ResponseEntity.ok(ApiResponse.success("Active providers by type retrieved successfully", providers));
    }

    /**
     * Get providers by region
     */
    @GetMapping("/region/{region}")
    @Operation(summary = "Get providers by region", description = "Retrieve providers filtered by region")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getByRegion(@PathVariable String region) {
        List<ProviderResponseDto> providers = providerService.getByRegion(region);
        return ResponseEntity.ok(ApiResponse.success("Providers by region retrieved successfully", providers));
    }

    /**
     * Get providers by city
     */
    @GetMapping("/city/{city}")
    @Operation(summary = "Get providers by city", description = "Retrieve providers filtered by city")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getByCity(@PathVariable String city) {
        List<ProviderResponseDto> providers = providerService.getByCity(city);
        return ResponseEntity.ok(ApiResponse.success("Providers by city retrieved successfully", providers));
    }

    /**
     * Search providers
     */
    @GetMapping("/search")
    @Operation(summary = "Search providers", description = "Search providers by name or code")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> search(@RequestParam String q) {
        List<ProviderResponseDto> providers = providerService.search(q);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", providers));
    }

    /**
     * Activate a provider
     */
    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activate provider", description = "Activate a provider")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> activate(@PathVariable Long id) {
        ProviderResponseDto activated = providerService.activate(id);
        return ResponseEntity.ok(ApiResponse.success("Provider activated successfully", activated));
    }

    /**
     * Deactivate a provider
     */
    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate provider", description = "Deactivate a provider")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> deactivate(@PathVariable Long id) {
        ProviderResponseDto deactivated = providerService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Provider deactivated successfully", deactivated));
    }

    /**
     * Delete a provider (soft delete)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete provider", description = "Delete (deactivate) a provider")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        providerService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Provider deleted successfully", null));
    }
}
