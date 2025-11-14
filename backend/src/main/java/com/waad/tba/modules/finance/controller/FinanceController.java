package com.waad.tba.modules.finance.controller;

import com.waad.tba.core.dto.ApiResponse;
import com.waad.tba.modules.finance.model.Finance;
import com.waad.tba.modules.finance.service.FinanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Finance", description = "Financial management endpoints")
public class FinanceController {
    
    private final FinanceService financeService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Get all finance records")
    public ResponseEntity<List<Finance>> getAllFinanceRecords() {
        return ResponseEntity.ok(financeService.getAllFinanceRecords());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Get finance record by ID")
    public ResponseEntity<Finance> getFinanceById(@PathVariable Long id) {
        return ResponseEntity.ok(financeService.getFinanceById(id));
    }
    
    @GetMapping("/provider/{providerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Get finance records by provider")
    public ResponseEntity<List<Finance>> getFinanceByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(financeService.getFinanceByProvider(providerId));
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Get finance records by status")
    public ResponseEntity<List<Finance>> getFinanceByStatus(@PathVariable Finance.PaymentStatus status) {
        return ResponseEntity.ok(financeService.getFinanceByStatus(status));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Create new finance record")
    public ResponseEntity<Finance> createFinanceRecord(@RequestBody Finance finance) {
        return ResponseEntity.ok(financeService.createFinanceRecord(finance));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Update finance record")
    public ResponseEntity<Finance> updateFinanceRecord(@PathVariable Long id, @RequestBody Finance finance) {
        return ResponseEntity.ok(financeService.updateFinanceRecord(id, finance));
    }
    
    @PatchMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Mark as paid")
    public ResponseEntity<Finance> markAsPaid(
            @PathVariable Long id, 
            @RequestParam String paymentMethod,
            @RequestParam String transactionReference) {
        return ResponseEntity.ok(financeService.markAsPaid(id, paymentMethod, transactionReference));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete finance record")
    public ResponseEntity<ApiResponse> deleteFinanceRecord(@PathVariable Long id) {
        financeService.deleteFinanceRecord(id);
        return ResponseEntity.ok(new ApiResponse(true, "Finance record deleted successfully"));
    }
}
