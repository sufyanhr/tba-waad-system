package com.waad.tba.modules.claim.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.claim.dto.ClaimCreateDto;
import com.waad.tba.modules.claim.dto.ClaimResponseDto;
import com.waad.tba.modules.claim.entity.Claim;
import com.waad.tba.modules.claim.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService service;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('claim.view')")
    public ResponseEntity<ApiResponse<List<ClaimResponseDto>>> getAll() {
        List<ClaimResponseDto> list = service.findAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('claim.view')")
    public ResponseEntity<ApiResponse<ClaimResponseDto>> getById(@PathVariable Long id) {
        ClaimResponseDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('claim.manage')")
    public ResponseEntity<ApiResponse<ClaimResponseDto>> create(@Valid @RequestBody ClaimCreateDto dto) {
        ClaimResponseDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Claim created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('claim.manage')")
    public ResponseEntity<ApiResponse<ClaimResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody ClaimCreateDto dto) {
        ClaimResponseDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Claim updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('claim.manage')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Claim deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('claim.view')")
    public ResponseEntity<ApiResponse<List<ClaimResponseDto>>> search(@RequestParam String query) {
        List<ClaimResponseDto> list = service.search(query);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/paginate")
    @PreAuthorize("hasAuthority('claim.view')")
    public ResponseEntity<ApiResponse<Page<ClaimResponseDto>>> paginate(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ClaimResponseDto> pageResult = service.findAllPaginated(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(pageResult));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('claim.view')")
    public ResponseEntity<ApiResponse<List<ClaimResponseDto>>> getByStatus(@PathVariable Claim.ClaimStatus status) {
        List<ClaimResponseDto> list = service.getByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('claim.approve')")
    public ResponseEntity<ApiResponse<ClaimResponseDto>> approveClaim(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> request) {
        BigDecimal approvedAmount = request.get("approvedAmount");
        if (approvedAmount == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Approved amount is required"));
        }
        ClaimResponseDto approved = service.approveClaim(id, approvedAmount);
        return ResponseEntity.ok(ApiResponse.success("Claim approved successfully", approved));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('claim.reject')")
    public ResponseEntity<ApiResponse<ClaimResponseDto>> rejectClaim(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String rejectionReason = request.get("rejectionReason");
        if (rejectionReason == null || rejectionReason.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Rejection reason is required"));
        }
        ClaimResponseDto rejected = service.rejectClaim(id, rejectionReason);
        return ResponseEntity.ok(ApiResponse.success("Claim rejected successfully", rejected));
    }
}
