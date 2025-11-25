package com.waad.tba.modules.claim.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.common.dto.PaginationResponse;
import com.waad.tba.modules.claim.dto.ClaimCreateDto;
import com.waad.tba.modules.claim.dto.ClaimResponseDto;
import com.waad.tba.modules.claim.entity.Claim;
import com.waad.tba.modules.claim.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Claims Management", description = "APIs for handling medical claims workflow")
public class ClaimController {

    private final ClaimService service;

    /**
     * @deprecated Use GET /api/claims?page=&size=&search= instead (paginated search)
     */
    @Deprecated
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('claim.view')")
    @Operation(summary = "List all claims", description = "Returns a list of all claims.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Claims retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Bad Request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class), examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\n  \"status\": \"error\",\n  \"code\": \"VALIDATION_ERROR\",\n  \"message\": \"Page parameter must be >= 0\",\n  \"timestamp\": \"2025-01-01T10:00:00Z\",\n  \"path\": \"/api/claims/all\"\n}"))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Not Found", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal Server Error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class)))
    })
    public ResponseEntity<ApiResponse<List<ClaimResponseDto>>> getAll() {
        List<ClaimResponseDto> list = service.findAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('claim.view')")
    @Operation(summary = "Get claim by ID", description = "Returns detailed claim information including status and amounts.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Claim retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Claim not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class)))
    })
    public ResponseEntity<ApiResponse<ClaimResponseDto>> getById(
            @Parameter(name = "id", description = "Claim ID", required = true)
            @PathVariable Long id) {
        ClaimResponseDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('claim.manage')")
    @Operation(summary = "Create claim", description = "Creates a new claim with initial details.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Claim created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request payload", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class)))
    })
    public ResponseEntity<ApiResponse<ClaimResponseDto>> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Claim creation payload")
            @Valid @RequestBody ClaimCreateDto dto) {
        ClaimResponseDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Claim created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('claim.manage')")
    @Operation(summary = "Update claim", description = "Updates claim details by ID.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Claim updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Claim not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request payload", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class)))
    })
    public ResponseEntity<ApiResponse<ClaimResponseDto>> update(
            @Parameter(name = "id", description = "Claim ID", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Claim update payload")
            @Valid @RequestBody ClaimCreateDto dto) {
        ClaimResponseDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Claim updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('claim.manage')")
    @Operation(summary = "Delete claim", description = "Deletes a claim by ID.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Claim deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Claim not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class)))
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(name = "id", description = "Claim ID", required = true)
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Claim deleted successfully", null));
    }

    /**
     * @deprecated Use GET /api/claims?page=&size=&search= instead (paginated search)
     */
    @Deprecated
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('claim.view')")
    @Operation(summary = "Search claims", description = "Search claims by query string.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Claims retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class)))
    })
    public ResponseEntity<ApiResponse<List<ClaimResponseDto>>> search(
            @Parameter(name = "query", description = "Search query", required = true)
            @RequestParam String query) {
        List<ClaimResponseDto> list = service.search(query);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('claim.view')")
    @Operation(summary = "Paginate claims", description = "Returns a page of claims with pagination parameters")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Claims page retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<PaginationResponse<ClaimResponseDto>>> paginate(
            @Parameter(name = "page", description = "Page number (1-based)") @RequestParam(defaultValue = "1") int page,
            @Parameter(name = "size", description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(name = "search", description = "Search query") @RequestParam(required = false) String search,
            @Parameter(name = "sortBy", description = "Sort by field") @RequestParam(defaultValue = "serviceDate") String sortBy,
            @Parameter(name = "sortDir", description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        org.springframework.data.domain.Pageable pageable = PageRequest.of(Math.max(0, page - 1), size,
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.fromString(sortDir), sortBy));
        Page<ClaimResponseDto> pageResult = service.findAllPaginated(pageable, search);
        PaginationResponse<ClaimResponseDto> response = PaginationResponse.<ClaimResponseDto>builder()
                .items(pageResult.getContent())
                .total(pageResult.getTotalElements())
                .page(page)
                .size(size)
                .build();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/count")
    @PreAuthorize("hasAuthority('claim.view')")
    @Operation(summary = "Count claims", description = "Returns total number of claims")
    public ResponseEntity<ApiResponse<Long>> count() {
        long total = service.count();
        return ResponseEntity.ok(ApiResponse.success(total));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('claim.view')")
    @Operation(summary = "Get claims by status", description = "Returns a list of claims filtered by status.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Claims retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status value", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class)))
    })
    public ResponseEntity<ApiResponse<List<ClaimResponseDto>>> getByStatus(
            @Parameter(name = "status", description = "Claim status", required = true)
            @PathVariable Claim.ClaimStatus status) {
        List<ClaimResponseDto> list = service.getByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('claim.approve')")
    @Operation(summary = "Approve claim", description = "Approves a claim and sets the approved amount.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Claim approved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Approved amount is required", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Claim not found", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class)))
    })
    public ResponseEntity<ApiResponse<ClaimResponseDto>> approveClaim(
            @Parameter(name = "id", description = "Claim ID", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Request body containing reviewerId and approvedAmount")
            @RequestBody Map<String, Object> request) {
        
        Long reviewerId = request.get("reviewerId") != null ? 
            ((Number) request.get("reviewerId")).longValue() : 1L;
        
        BigDecimal approvedAmount = request.get("approvedAmount") != null ? 
            new BigDecimal(request.get("approvedAmount").toString()) : null;
        
        if (approvedAmount == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Approved amount is required"));
        }
        
        ClaimResponseDto approved = service.approveClaim(id, reviewerId, approvedAmount);
        return ResponseEntity.ok(ApiResponse.success("Claim approved successfully", approved));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('claim.reject')")
    @Operation(summary = "Reject claim", description = "Rejects a claim and records the rejection reason.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Claim rejected successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Rejection reason is required", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Claim not found", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized request", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error", content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.waad.tba.common.error.ApiError.class)))
    })
    public ResponseEntity<ApiResponse<ClaimResponseDto>> rejectClaim(
            @Parameter(name = "id", description = "Claim ID", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Request body containing reviewerId and rejectionReason")
            @RequestBody Map<String, Object> request) {
        
        Long reviewerId = request.get("reviewerId") != null ? 
            ((Number) request.get("reviewerId")).longValue() : 1L;
        
        String rejectionReason = request.get("rejectionReason") != null ?
            request.get("rejectionReason").toString() : null;
        
        if (rejectionReason == null || rejectionReason.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Rejection reason is required"));
        }
        
        ClaimResponseDto rejected = service.rejectClaim(id, reviewerId, rejectionReason);
        return ResponseEntity.ok(ApiResponse.success("Claim rejected successfully", rejected));
    }
}
