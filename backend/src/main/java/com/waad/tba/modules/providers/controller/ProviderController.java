package com.waad.tba.modules.providers.controller;

import com.waad.tba.core.dto.ApiResponse;
import com.waad.tba.modules.providers.model.Provider;
import com.waad.tba.modules.providers.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Providers", description = "Provider management endpoints")
public class ProviderController {
    
    private final ProviderService providerService;
    
    @GetMapping
    @PreAuthorize("hasAuthority('PERMISSION_PROVIDERS_VIEW')")
    @Operation(summary = "Get all providers")
    public ResponseEntity<List<Provider>> getAllProviders() {
        return ResponseEntity.ok(providerService.getAllProviders());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_PROVIDERS_VIEW')")
    @Operation(summary = "Get provider by ID")
    public ResponseEntity<Provider> getProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('PERMISSION_PROVIDERS_CREATE')")
    @Operation(summary = "Create new provider")
    public ResponseEntity<Provider> createProvider(@RequestBody Provider provider) {
        return ResponseEntity.ok(providerService.createProvider(provider));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_PROVIDERS_UPDATE')")
    @Operation(summary = "Update provider")
    public ResponseEntity<Provider> updateProvider(@PathVariable Long id, @RequestBody Provider provider) {
        return ResponseEntity.ok(providerService.updateProvider(id, provider));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_PROVIDERS_DELETE')")
    @Operation(summary = "Delete provider")
    public ResponseEntity<ApiResponse> deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
        return ResponseEntity.ok(new ApiResponse(true, "Provider deleted successfully"));
    }
}
