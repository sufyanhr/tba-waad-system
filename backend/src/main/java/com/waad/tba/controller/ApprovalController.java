package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.model.Approval;
import com.waad.tba.service.ApprovalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Approvals", description = "Pre-authorization management endpoints")
public class ApprovalController {
    
    private final ApprovalService approvalService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Get all approvals")
    public ResponseEntity<List<Approval>> getAllApprovals() {
        return ResponseEntity.ok(approvalService.getAllApprovals());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER', 'MEMBER')")
    @Operation(summary = "Get approval by ID")
    public ResponseEntity<Approval> getApprovalById(@PathVariable Long id) {
        return ResponseEntity.ok(approvalService.getApprovalById(id));
    }
    
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'MEMBER')")
    @Operation(summary = "Get approvals by member")
    public ResponseEntity<List<Approval>> getApprovalsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(approvalService.getApprovalsByMember(memberId));
    }
    
    @GetMapping("/provider/{providerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Get approvals by provider")
    public ResponseEntity<List<Approval>> getApprovalsByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(approvalService.getApprovalsByProvider(providerId));
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Get approvals by status")
    public ResponseEntity<List<Approval>> getApprovalsByStatus(@PathVariable Approval.ApprovalStatus status) {
        return ResponseEntity.ok(approvalService.getApprovalsByStatus(status));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Create new approval request")
    public ResponseEntity<Approval> createApproval(@RequestBody Approval approval) {
        return ResponseEntity.ok(approvalService.createApproval(approval));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Update approval")
    public ResponseEntity<Approval> updateApproval(@PathVariable Long id, @RequestBody Approval approval) {
        return ResponseEntity.ok(approvalService.updateApproval(id, approval));
    }
    
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Approve request")
    public ResponseEntity<Approval> approveRequest(
            @PathVariable Long id, 
            @RequestParam String approvedBy,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate validUntil) {
        return ResponseEntity.ok(approvalService.approveRequest(id, approvedBy, validUntil));
    }
    
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Reject request")
    public ResponseEntity<Approval> rejectRequest(
            @PathVariable Long id, 
            @RequestParam String approvedBy, 
            @RequestParam String reason) {
        return ResponseEntity.ok(approvalService.rejectRequest(id, approvedBy, reason));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete approval")
    public ResponseEntity<ApiResponse> deleteApproval(@PathVariable Long id) {
        approvalService.deleteApproval(id);
        return ResponseEntity.ok(new ApiResponse(true, "Approval deleted successfully"));
    }
}
