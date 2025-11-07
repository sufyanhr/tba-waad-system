package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.model.InsuranceCompany;
import com.waad.tba.service.InsuranceCompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insurance")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Insurance Companies", description = "Insurance company management endpoints")
public class InsuranceCompanyController {
    
    private final InsuranceCompanyService insuranceCompanyService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Get all insurance companies")
    public ResponseEntity<List<InsuranceCompany>> getAllInsuranceCompanies() {
        return ResponseEntity.ok(insuranceCompanyService.getAllInsuranceCompanies());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Get insurance company by ID")
    public ResponseEntity<InsuranceCompany> getInsuranceCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(insuranceCompanyService.getInsuranceCompanyById(id));
    }
    
    @GetMapping("/email/{email}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Get insurance company by email")
    public ResponseEntity<InsuranceCompany> getInsuranceCompanyByEmail(@PathVariable String email) {
        return ResponseEntity.ok(insuranceCompanyService.getInsuranceCompanyByEmail(email));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new insurance company")
    public ResponseEntity<InsuranceCompany> createInsuranceCompany(@RequestBody InsuranceCompany insuranceCompany) {
        return ResponseEntity.ok(insuranceCompanyService.createInsuranceCompany(insuranceCompany));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Update insurance company")
    public ResponseEntity<InsuranceCompany> updateInsuranceCompany(@PathVariable Long id, @RequestBody InsuranceCompany insuranceCompany) {
        return ResponseEntity.ok(insuranceCompanyService.updateInsuranceCompany(id, insuranceCompany));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete insurance company")
    public ResponseEntity<ApiResponse> deleteInsuranceCompany(@PathVariable Long id) {
        insuranceCompanyService.deleteInsuranceCompany(id);
        return ResponseEntity.ok(new ApiResponse(true, "Insurance company deleted successfully"));
    }
}
