package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.model.Claim;
import com.waad.tba.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Claims", description = "Claim management endpoints")
public class ClaimController {
    
    private final ClaimService claimService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Get all claims")
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER', 'MEMBER')")
    @Operation(summary = "Get claim by ID")
    public ResponseEntity<Claim> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }
    
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'MEMBER')")
    @Operation(summary = "Get claims by member")
    public ResponseEntity<List<Claim>> getClaimsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(claimService.getClaimsByMember(memberId));
    }
    
    @GetMapping("/provider/{providerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Get claims by provider")
    public ResponseEntity<List<Claim>> getClaimsByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(claimService.getClaimsByProvider(providerId));
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Get claims by status")
    public ResponseEntity<List<Claim>> getClaimsByStatus(@PathVariable Claim.ClaimStatus status) {
        return ResponseEntity.ok(claimService.getClaimsByStatus(status));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Create new claim")
    public ResponseEntity<Claim> createClaim(@RequestBody Claim claim) {
        return ResponseEntity.ok(claimService.createClaim(claim));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Update claim")
    public ResponseEntity<Claim> updateClaim(@PathVariable Long id, @RequestBody Claim claim) {
        return ResponseEntity.ok(claimService.updateClaim(id, claim));
    }
    
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Approve claim")
    public ResponseEntity<Claim> approveClaim(@PathVariable Long id, @RequestParam String reviewedBy) {
        return ResponseEntity.ok(claimService.approveClaim(id, reviewedBy));
    }
    
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Reject claim")
    public ResponseEntity<Claim> rejectClaim(@PathVariable Long id, @RequestParam String reviewedBy, @RequestParam String reason) {
        return ResponseEntity.ok(claimService.rejectClaim(id, reviewedBy, reason));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete claim")
    public ResponseEntity<ApiResponse> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.ok(new ApiResponse(true, "Claim deleted successfully"));
    }
}
