package com.waad.tba.modules.employer.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.employer.dto.EmployerCreateDto;
import com.waad.tba.modules.employer.dto.EmployerResponseDto;
import com.waad.tba.modules.employer.service.EmployerService;
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
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService service;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('employer.view')")
    public ResponseEntity<ApiResponse<List<EmployerResponseDto>>> getAll() {
        List<EmployerResponseDto> list = service.findAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('employer.view')")
    public ResponseEntity<ApiResponse<EmployerResponseDto>> getById(@PathVariable Long id) {
        EmployerResponseDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('employer.manage')")
    public ResponseEntity<ApiResponse<EmployerResponseDto>> create(@Valid @RequestBody EmployerCreateDto dto) {
        EmployerResponseDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employer created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('employer.manage')")
    public ResponseEntity<ApiResponse<EmployerResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody EmployerCreateDto dto) {
        EmployerResponseDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Employer updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('employer.manage')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Employer deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('employer.view')")
    public ResponseEntity<ApiResponse<List<EmployerResponseDto>>> search(@RequestParam String query) {
        List<EmployerResponseDto> list = service.search(query);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/paginate")
    @PreAuthorize("hasAuthority('employer.view')")
    public ResponseEntity<ApiResponse<Page<EmployerResponseDto>>> paginate(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<EmployerResponseDto> pageResult = service.findAllPaginated(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(pageResult));
    }
}
