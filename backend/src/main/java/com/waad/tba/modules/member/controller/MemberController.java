package com.waad.tba.modules.member.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.common.dto.PaginationResponse;
import com.waad.tba.modules.member.dto.MemberCreateDto;
import com.waad.tba.modules.member.dto.MemberResponseDto;
import com.waad.tba.modules.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Tag(name = "Members", description = "APIs for managing members")
public class MemberController {

    private final MemberService service;

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_MEMBERS')")
    @Operation(summary = "Get member by ID", description = "Returns a member by ID.")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getById(
            @Parameter(name = "id", description = "Member ID", required = true)
            @PathVariable Long id) {
        MemberResponseDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_MEMBERS')")
    @Operation(summary = "Create member", description = "Creates a new member.")
    public ResponseEntity<ApiResponse<MemberResponseDto>> create(
            @Valid @RequestBody MemberCreateDto dto) {
        MemberResponseDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Member created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_MEMBERS')")
    @Operation(summary = "Update member", description = "Updates an existing member.")
    public ResponseEntity<ApiResponse<MemberResponseDto>> update(
            @Parameter(name = "id", description = "Member ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody MemberCreateDto dto) {
        MemberResponseDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Member updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_MEMBERS')")
    @Operation(summary = "Delete member", description = "Deletes a member by ID.")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(name = "id", description = "Member ID", required = true)
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Member deleted successfully", null));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_MEMBERS')")
    @Operation(summary = "List members with pagination", description = "Returns a paginated list of members with optional company filter and search")
    public ResponseEntity<ApiResponse<PaginationResponse<MemberResponseDto>>> list(
            @Parameter(name = "page", description = "Page number (1-based)") 
            @RequestParam(defaultValue = "1") int page,
            @Parameter(name = "size", description = "Page size") 
            @RequestParam(defaultValue = "10") int size,
            @Parameter(name = "search", description = "Search query") 
            @RequestParam(required = false) String search,
            @Parameter(name = "companyId", description = "Filter by company ID") 
            @RequestParam(required = false) Long companyId,
            @Parameter(name = "sortBy", description = "Sort by field") 
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(name = "sortDir", description = "Sort direction") 
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        org.springframework.data.domain.Pageable pageable = PageRequest.of(
            Math.max(0, page - 1), 
            size,
            Sort.by(Sort.Direction.fromString(sortDir), sortBy)
        );
        
        Page<MemberResponseDto> pageResult = service.findAllPaginated(companyId, search, pageable);
        
        PaginationResponse<MemberResponseDto> response = PaginationResponse.<MemberResponseDto>builder()
                .items(pageResult.getContent())
                .total(pageResult.getTotalElements())
                .page(page)
                .size(size)
                .build();
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/count")
    @PreAuthorize("hasAuthority('MANAGE_MEMBERS')")
    @Operation(summary = "Count members", description = "Returns total number of members")
    public ResponseEntity<ApiResponse<Long>> count() {
        long total = service.count();
        return ResponseEntity.ok(ApiResponse.success(total));
    }
}
