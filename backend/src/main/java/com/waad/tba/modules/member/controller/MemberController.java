package com.waad.tba.modules.member.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.member.dto.MemberCreateDto;
import com.waad.tba.modules.member.dto.MemberResponseDto;
import com.waad.tba.modules.member.service.MemberService;
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
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService service;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('member.view')")
    public ResponseEntity<ApiResponse<List<MemberResponseDto>>> getAll() {
        List<MemberResponseDto> list = service.findAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('member.view')")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getById(@PathVariable Long id) {
        MemberResponseDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('member.manage')")
    public ResponseEntity<ApiResponse<MemberResponseDto>> create(@Valid @RequestBody MemberCreateDto dto) {
        MemberResponseDto created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Member created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('member.manage')")
    public ResponseEntity<ApiResponse<MemberResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody MemberCreateDto dto) {
        MemberResponseDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Member updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('member.manage')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Member deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('member.view')")
    public ResponseEntity<ApiResponse<List<MemberResponseDto>>> search(@RequestParam String query) {
        List<MemberResponseDto> list = service.search(query);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/paginate")
    @PreAuthorize("hasAuthority('member.view')")
    public ResponseEntity<ApiResponse<Page<MemberResponseDto>>> paginate(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<MemberResponseDto> pageResult = service.findAllPaginated(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(pageResult));
    }
}
