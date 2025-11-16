package com.waad.tba.modules.reviewer.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.reviewer.dto.ReviewerCompanyCreateDto;
import com.waad.tba.modules.reviewer.dto.ReviewerCompanyResponseDto;
import com.waad.tba.modules.reviewer.service.ReviewerCompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviewer-companies")
@RequiredArgsConstructor
public class ReviewerCompanyController {

    private final ReviewerCompanyService service;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('reviewer.view')")
    public ResponseEntity<ApiResponse<List<ReviewerCompanyResponseDto>>> getAll() {
        List<ReviewerCompanyResponseDto> list = service.findAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('reviewer.view')")
    public ResponseEntity<ApiResponse<ReviewerCompanyResponseDto>> getById(@PathVariable Long id) {
        ReviewerCompanyResponseDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('reviewer.manage')")
    public ResponseEntity<ApiResponse<ReviewerCompanyResponseDto>> create(@Valid @RequestBody ReviewerCompanyCreateDto dto) {
        ReviewerCompanyResponseDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Reviewer company created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('reviewer.manage')")
    public ResponseEntity<ApiResponse<ReviewerCompanyResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody ReviewerCompanyCreateDto dto) {
        ReviewerCompanyResponseDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Reviewer company updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('reviewer.manage')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Reviewer company deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('reviewer.view')")
    public ResponseEntity<ApiResponse<List<ReviewerCompanyResponseDto>>> search(@RequestParam String query) {
        List<ReviewerCompanyResponseDto> list = service.search(query);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/paginate")
    @PreAuthorize("hasAuthority('reviewer.view')")
    public ResponseEntity<ApiResponse<Page<ReviewerCompanyResponseDto>>> paginate(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewerCompanyResponseDto> pageResult = service.findAllPaginated(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(pageResult));
    }
}
