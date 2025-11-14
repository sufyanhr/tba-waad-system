package com.waad.tba.modules.insurance.controller;

import com.waad.tba.core.dto.ApiResponse;
import com.waad.tba.modules.insurance.model.Policy;
import com.waad.tba.modules.insurance.service.PolicyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policy")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Policies", description = "Insurance policy management endpoints")
public class PolicyController {
    
    private final PolicyService policyService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAAD', 'INSURANCE')")
    @Operation(summary = "Get all policies")
    public ResponseEntity<List<Policy>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER')")
    @Operation(summary = "Get policy by ID")
    public ResponseEntity<Policy> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }
    
    @GetMapping("/number/{policyNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER')")
    @Operation(summary = "Get policy by policy number")
    public ResponseEntity<Policy> getPolicyByPolicyNumber(@PathVariable String policyNumber) {
        return ResponseEntity.ok(policyService.getPolicyByPolicyNumber(policyNumber));
    }
    
    @GetMapping("/insurance-company/{insuranceCompanyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAAD', 'INSURANCE')")
    @Operation(summary = "Get policies by insurance company")
    public ResponseEntity<List<Policy>> getPoliciesByInsuranceCompany(@PathVariable Long insuranceCompanyId) {
        return ResponseEntity.ok(policyService.getPoliciesByInsuranceCompany(insuranceCompanyId));
    }
    
    @GetMapping("/organization/{organizationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER')")
    @Operation(summary = "Get policies by organization")
    public ResponseEntity<List<Policy>> getPoliciesByOrganization(@PathVariable Long organizationId) {
        return ResponseEntity.ok(policyService.getPoliciesByOrganization(organizationId));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAAD', 'INSURANCE')")
    @Operation(summary = "Create new policy")
    public ResponseEntity<Policy> createPolicy(@RequestBody Policy policy) {
        return ResponseEntity.ok(policyService.createPolicy(policy));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAAD', 'INSURANCE')")
    @Operation(summary = "Update policy")
    public ResponseEntity<Policy> updatePolicy(@PathVariable Long id, @RequestBody Policy policy) {
        return ResponseEntity.ok(policyService.updatePolicy(id, policy));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete policy")
    public ResponseEntity<ApiResponse> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok(new ApiResponse(true, "Policy deleted successfully"));
    }
}
