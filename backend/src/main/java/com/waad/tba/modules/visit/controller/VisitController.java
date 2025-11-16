package com.waad.tba.modules.visit.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.visit.dto.VisitCreateDto;
import com.waad.tba.modules.visit.dto.VisitResponseDto;
import com.waad.tba.modules.visit.service.VisitService;
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
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class VisitController {

    private final VisitService service;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('visit.view')")
    public ResponseEntity<ApiResponse<List<VisitResponseDto>>> getAll() {
        List<VisitResponseDto> list = service.findAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('visit.view')")
    public ResponseEntity<ApiResponse<VisitResponseDto>> getById(@PathVariable Long id) {
        VisitResponseDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('visit.manage')")
    public ResponseEntity<ApiResponse<VisitResponseDto>> create(@Valid @RequestBody VisitCreateDto dto) {
        VisitResponseDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Visit created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('visit.manage')")
    public ResponseEntity<ApiResponse<VisitResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody VisitCreateDto dto) {
        VisitResponseDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Visit updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('visit.manage')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Visit deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('visit.view')")
    public ResponseEntity<ApiResponse<List<VisitResponseDto>>> search(@RequestParam String query) {
        List<VisitResponseDto> list = service.search(query);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/paginate")
    @PreAuthorize("hasAuthority('visit.view')")
    public ResponseEntity<ApiResponse<Page<VisitResponseDto>>> paginate(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<VisitResponseDto> pageResult = service.findAllPaginated(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(pageResult));
    }
}
