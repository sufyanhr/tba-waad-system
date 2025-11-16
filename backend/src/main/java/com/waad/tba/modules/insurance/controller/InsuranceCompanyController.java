package com.waad.tba.modules.insurance.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.insurance.dto.InsuranceCompanyCreateDto;
import com.waad.tba.modules.insurance.dto.InsuranceCompanyResponseDto;
import com.waad.tba.modules.insurance.service.InsuranceCompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insurance-companies")
@RequiredArgsConstructor
public class InsuranceCompanyController {

    private final InsuranceCompanyService insuranceCompanyService;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('insurance.view')")
    public ResponseEntity<ApiResponse<List<InsuranceCompanyResponseDto>>> getAll() {
        List<InsuranceCompanyResponseDto> companies = insuranceCompanyService.getAll();
        return ResponseEntity.ok(ApiResponse.success("Insurance companies retrieved successfully", companies));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('insurance.view')")
    public ResponseEntity<ApiResponse<Page<InsuranceCompanyResponseDto>>> getAllPaginated(Pageable pageable) {
        Page<InsuranceCompanyResponseDto> companies = insuranceCompanyService.getAllPaginated(pageable);
        return ResponseEntity.ok(ApiResponse.success("Insurance companies retrieved successfully", companies));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('insurance.view')")
    public ResponseEntity<ApiResponse<InsuranceCompanyResponseDto>> getById(@PathVariable Long id) {
        InsuranceCompanyResponseDto company = insuranceCompanyService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Insurance company retrieved successfully", company));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('insurance.manage')")
    public ResponseEntity<ApiResponse<InsuranceCompanyResponseDto>> create(@Valid @RequestBody InsuranceCompanyCreateDto dto) {
        InsuranceCompanyResponseDto created = insuranceCompanyService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Insurance company created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('insurance.manage')")
    public ResponseEntity<ApiResponse<InsuranceCompanyResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody InsuranceCompanyCreateDto dto) {
        InsuranceCompanyResponseDto updated = insuranceCompanyService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Insurance company updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('insurance.manage')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        insuranceCompanyService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Insurance company deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('insurance.view')")
    public ResponseEntity<ApiResponse<List<InsuranceCompanyResponseDto>>> search(@RequestParam String query) {
        List<InsuranceCompanyResponseDto> results = insuranceCompanyService.search(query);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", results));
    }
}
