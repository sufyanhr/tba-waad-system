package com.waad.tba.modules.preapproval.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.common.dto.PaginationResponse;
import com.waad.tba.modules.preapproval.dto.PreApprovalCreateDto;
import com.waad.tba.modules.preapproval.dto.PreApprovalUpdateDto;
import com.waad.tba.modules.preapproval.dto.PreApprovalViewDto;
import com.waad.tba.modules.preapproval.service.PreApprovalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Pre-Approval management
 */
@RestController
@RequestMapping("/api/pre-approvals")
@RequiredArgsConstructor
@Slf4j
public class PreApprovalController {

    private final PreApprovalService preApprovalService;

    /**
     * Create a new pre-approval request
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('MANAGE_PREAPPROVALS')")
    public ResponseEntity<ApiResponse<PreApprovalViewDto>> createPreApproval(
            @Valid @RequestBody PreApprovalCreateDto dto) {
        log.info("REST request to create pre-approval");

        PreApprovalViewDto created = preApprovalService.createPreApproval(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pre-approval created successfully", created));
    }

    /**
     * Update an existing pre-approval request
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MANAGE_PREAPPROVALS')")
    public ResponseEntity<ApiResponse<PreApprovalViewDto>> updatePreApproval(
            @PathVariable Long id,
            @Valid @RequestBody PreApprovalUpdateDto dto) {
        log.info("REST request to update pre-approval with ID: {}", id);

        PreApprovalViewDto updated = preApprovalService.updatePreApproval(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Pre-approval updated successfully", updated));
    }

    /**
     * Get pre-approval by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('VIEW_PREAPPROVALS')")
    public ResponseEntity<ApiResponse<PreApprovalViewDto>> getPreApproval(@PathVariable Long id) {
        log.info("REST request to get pre-approval with ID: {}", id);

        PreApprovalViewDto preApproval = preApprovalService.getPreApproval(id);
        return ResponseEntity.ok(ApiResponse.success(preApproval));
    }

    /**
     * List pre-approvals with pagination and search
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('VIEW_PREAPPROVALS')")
    public ResponseEntity<PaginationResponse<PreApprovalViewDto>> listPreApprovals(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        log.info("REST request to list pre-approvals - page: {}, size: {}, search: {}", page, size, search);

        Page<PreApprovalViewDto> preApprovalsPage = preApprovalService.listPreApprovals(page, size, search);
        return ResponseEntity.ok(PaginationResponse.<PreApprovalViewDto>builder()
                .items(preApprovalsPage.getContent())
                .total(preApprovalsPage.getTotalElements())
                .page(preApprovalsPage.getNumber() + 1)
                .size(preApprovalsPage.getSize())
                .build());
    }

    /**
     * Delete pre-approval (soft delete)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MANAGE_PREAPPROVALS')")
    public ResponseEntity<ApiResponse<Void>> deletePreApproval(@PathVariable Long id) {
        log.info("REST request to delete pre-approval with ID: {}", id);

        preApprovalService.deletePreApproval(id);
        return ResponseEntity.ok(ApiResponse.success("Pre-approval deleted successfully", null));
    }

    /**
     * Count total pre-approvals
     */
    @GetMapping("/count")
    @PreAuthorize("hasAnyAuthority('VIEW_PREAPPROVALS')")
    public ResponseEntity<ApiResponse<Long>> countPreApprovals() {
        log.info("REST request to count pre-approvals");

        Long count = preApprovalService.countPreApprovals();
        return ResponseEntity.ok(ApiResponse.success(count));
    }
}
