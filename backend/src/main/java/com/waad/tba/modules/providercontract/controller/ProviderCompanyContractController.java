package com.waad.tba.modules.providercontract.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.providercontract.dto.ProviderContractCreateDto;
import com.waad.tba.modules.providercontract.dto.ProviderContractResponseDto;
import com.waad.tba.modules.providercontract.dto.ProviderContractUpdateDto;
import com.waad.tba.modules.providercontract.service.ProviderCompanyContractService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST Controller for Provider-Company Contract management
 */
@RestController
@RequestMapping("/api/provider-contracts")
@RequiredArgsConstructor
@Tag(name = "Provider-Company Contracts", description = "APIs for managing contracts between providers and companies")
@SecurityRequirement(name = "bearer-jwt")
public class ProviderCompanyContractController {

    private final ProviderCompanyContractService contractService;

    /**
     * Create a new provider-company contract
     */
    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_PROVIDER_CONTRACTS')")
    @Operation(summary = "Create contract", description = "Create a new contract between a provider and company")
    public ResponseEntity<ApiResponse<ProviderContractResponseDto>> createContract(
            @Valid @RequestBody ProviderContractCreateDto dto) {
        ProviderContractResponseDto created = contractService.createContract(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Contract created successfully", created));
    }

    /**
     * Update an existing contract
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PROVIDER_CONTRACTS')")
    @Operation(summary = "Update contract", description = "Update an existing provider-company contract")
    public ResponseEntity<ApiResponse<ProviderContractResponseDto>> updateContract(
            @PathVariable Long id,
            @Valid @RequestBody ProviderContractUpdateDto dto) {
        ProviderContractResponseDto updated = contractService.updateContract(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Contract updated successfully", updated));
    }

    /**
     * Get contract by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW_PROVIDER_CONTRACTS')")
    @Operation(summary = "Get contract by ID", description = "Retrieve a contract by its ID")
    public ResponseEntity<ApiResponse<ProviderContractResponseDto>> getById(@PathVariable Long id) {
        ProviderContractResponseDto contract = contractService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Contract retrieved successfully", contract));
    }

    /**
     * Get all contracts
     */
    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_PROVIDER_CONTRACTS')")
    @Operation(summary = "Get all contracts", description = "Retrieve all provider-company contracts")
    public ResponseEntity<ApiResponse<List<ProviderContractResponseDto>>> getAll() {
        List<ProviderContractResponseDto> contracts = contractService.getAll();
        return ResponseEntity.ok(ApiResponse.success("Contracts retrieved successfully", contracts));
    }

    /**
     * Get contracts by company
     */
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAuthority('VIEW_PROVIDER_CONTRACTS')")
    @Operation(summary = "Get contracts by company", description = "Retrieve all contracts for a specific company")
    public ResponseEntity<ApiResponse<List<ProviderContractResponseDto>>> getByCompany(
            @PathVariable Long companyId) {
        List<ProviderContractResponseDto> contracts = contractService.getByCompany(companyId);
        return ResponseEntity.ok(ApiResponse.success("Company contracts retrieved successfully", contracts));
    }

    /**
     * Get contracts by provider
     */
    @GetMapping("/provider/{providerId}")
    @PreAuthorize("hasAuthority('VIEW_PROVIDER_CONTRACTS')")
    @Operation(summary = "Get contracts by provider", description = "Retrieve all contracts for a specific provider")
    public ResponseEntity<ApiResponse<List<ProviderContractResponseDto>>> getByProvider(
            @PathVariable Long providerId) {
        List<ProviderContractResponseDto> contracts = contractService.getByProvider(providerId);
        return ResponseEntity.ok(ApiResponse.success("Provider contracts retrieved successfully", contracts));
    }

    /**
     * Get contract between specific company and provider
     */
    @GetMapping("/company/{companyId}/provider/{providerId}")
    @PreAuthorize("hasAuthority('VIEW_PROVIDER_CONTRACTS')")
    @Operation(summary = "Get contract by company and provider", 
               description = "Retrieve contract between specific company and provider")
    public ResponseEntity<ApiResponse<ProviderContractResponseDto>> getByCompanyAndProvider(
            @PathVariable Long companyId,
            @PathVariable Long providerId) {
        ProviderContractResponseDto contract = contractService.getByCompanyAndProvider(companyId, providerId);
        return ResponseEntity.ok(ApiResponse.success("Contract retrieved successfully", contract));
    }

    /**
     * Get active contracts for a company
     */
    @GetMapping("/company/{companyId}/active")
    @PreAuthorize("hasAuthority('VIEW_PROVIDER_CONTRACTS')")
    @Operation(summary = "Get active contracts by company", 
               description = "Retrieve all active contracts for a specific company")
    public ResponseEntity<ApiResponse<List<ProviderContractResponseDto>>> getActiveContractsByCompany(
            @PathVariable Long companyId) {
        List<ProviderContractResponseDto> contracts = contractService.getActiveContractsByCompany(companyId);
        return ResponseEntity.ok(ApiResponse.success("Active contracts retrieved successfully", contracts));
    }

    /**
     * Activate a contract
     */
    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('MANAGE_PROVIDER_CONTRACTS')")
    @Operation(summary = "Activate contract", description = "Activate a provider-company contract")
    public ResponseEntity<ApiResponse<ProviderContractResponseDto>> activate(@PathVariable Long id) {
        ProviderContractResponseDto activated = contractService.activate(id);
        return ResponseEntity.ok(ApiResponse.success("Contract activated successfully", activated));
    }

    /**
     * Suspend a contract
     */
    @PatchMapping("/{id}/suspend")
    @PreAuthorize("hasAuthority('MANAGE_PROVIDER_CONTRACTS')")
    @Operation(summary = "Suspend contract", description = "Suspend a provider-company contract")
    public ResponseEntity<ApiResponse<ProviderContractResponseDto>> suspend(@PathVariable Long id) {
        ProviderContractResponseDto suspended = contractService.suspend(id);
        return ResponseEntity.ok(ApiResponse.success("Contract suspended successfully", suspended));
    }

    /**
     * Expire a contract
     */
    @PatchMapping("/{id}/expire")
    @PreAuthorize("hasAuthority('MANAGE_PROVIDER_CONTRACTS')")
    @Operation(summary = "Expire contract", description = "Mark a provider-company contract as expired")
    public ResponseEntity<ApiResponse<ProviderContractResponseDto>> expire(@PathVariable Long id) {
        ProviderContractResponseDto expired = contractService.expire(id);
        return ResponseEntity.ok(ApiResponse.success("Contract expired successfully", expired));
    }

    /**
     * Check if active contract exists
     */
    @GetMapping("/check-active")
    @PreAuthorize("hasAuthority('VIEW_PROVIDER_CONTRACTS')")
    @Operation(summary = "Check active contract", 
               description = "Check if active contract exists between company and provider")
    public ResponseEntity<ApiResponse<Boolean>> checkActiveContract(
            @RequestParam Long companyId,
            @RequestParam Long providerId) {
        boolean hasActive = contractService.hasActiveContract(companyId, providerId);
        return ResponseEntity.ok(ApiResponse.success("Active contract check completed", hasActive));
    }
}
