package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.model.ClaimAttachment;
import com.waad.tba.service.ClaimAttachmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/claims/attachments")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Claim Attachments", description = "Manage claim document uploads")
public class ClaimAttachmentController {

    private final ClaimAttachmentService claimAttachmentService;

    @PostMapping("/{claimId}/upload")
    @PreAuthorize("hasAnyRole('PROVIDER', 'INSURANCE', 'ADMIN')")
    @Operation(summary = "Upload attachment for a claim")
    public ResponseEntity<ClaimAttachment> uploadAttachment(
            @PathVariable Long claimId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedBy") String uploadedBy
    ) throws IOException {
        return ResponseEntity.ok(claimAttachmentService.uploadFile(claimId, file, uploadedBy));
    }

    @GetMapping("/{claimId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "List attachments for a claim")
    public ResponseEntity<List<ClaimAttachment>> getAttachments(@PathVariable Long claimId) {
        return ResponseEntity.ok(claimAttachmentService.getAttachmentsByClaim(claimId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Delete attachment")
    public ResponseEntity<ApiResponse> deleteAttachment(@PathVariable Long id) {
        claimAttachmentService.deleteAttachment(id);
        return ResponseEntity.ok(new ApiResponse(true, "Attachment deleted successfully"));
    }
}
