package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.model.BenefitTable;
import com.waad.tba.service.BenefitTableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/benefits")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Benefit Tables", description = "Policy benefit table management endpoints")
public class BenefitTableController {
    
    private final BenefitTableService benefitTableService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAAD', 'INSURANCE')")
    @Operation(summary = "Get all benefit tables")
    public ResponseEntity<List<BenefitTable>> getAllBenefitTables() {
        return ResponseEntity.ok(benefitTableService.getAllBenefitTables());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER', 'PROVIDER')")
    @Operation(summary = "Get benefit table by ID")
    public ResponseEntity<BenefitTable> getBenefitTableById(@PathVariable Long id) {
        return ResponseEntity.ok(benefitTableService.getBenefitTableById(id));
    }
    
    @GetMapping("/policy/{policyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER', 'PROVIDER')")
    @Operation(summary = "Get benefit tables by policy")
    public ResponseEntity<List<BenefitTable>> getBenefitTablesByPolicy(@PathVariable Long policyId) {
        return ResponseEntity.ok(benefitTableService.getBenefitTablesByPolicy(policyId));
    }
    
    @GetMapping("/service-type/{serviceType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAAD', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Get benefit tables by service type")
    public ResponseEntity<List<BenefitTable>> getBenefitTablesByServiceType(@PathVariable String serviceType) {
        return ResponseEntity.ok(benefitTableService.getBenefitTablesByServiceType(serviceType));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAAD', 'INSURANCE')")
    @Operation(summary = "Create new benefit table")
    public ResponseEntity<BenefitTable> createBenefitTable(@RequestBody BenefitTable benefitTable) {
        return ResponseEntity.ok(benefitTableService.createBenefitTable(benefitTable));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAAD', 'INSURANCE')")
    @Operation(summary = "Update benefit table")
    public ResponseEntity<BenefitTable> updateBenefitTable(@PathVariable Long id, @RequestBody BenefitTable benefitTable) {
        return ResponseEntity.ok(benefitTableService.updateBenefitTable(id, benefitTable));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete benefit table")
    public ResponseEntity<ApiResponse> deleteBenefitTable(@PathVariable Long id) {
        benefitTableService.deleteBenefitTable(id);
        return ResponseEntity.ok(new ApiResponse(true, "Benefit table deleted successfully"));
    }
}
