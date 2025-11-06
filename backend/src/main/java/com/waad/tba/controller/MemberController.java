package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.model.Member;
import com.waad.tba.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Members", description = "Member management endpoints")
public class MemberController {
    
    private final MemberService memberService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER', 'PROVIDER')")
    @Operation(summary = "Get all members")
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER', 'PROVIDER', 'MEMBER')")
    @Operation(summary = "Get member by ID")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }
    
    @GetMapping("/organization/{organizationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER')")
    @Operation(summary = "Get members by organization")
    public ResponseEntity<List<Member>> getMembersByOrganization(@PathVariable Long organizationId) {
        return ResponseEntity.ok(memberService.getMembersByOrganization(organizationId));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER')")
    @Operation(summary = "Create new member")
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        return ResponseEntity.ok(memberService.createMember(member));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'EMPLOYER')")
    @Operation(summary = "Update member")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member member) {
        return ResponseEntity.ok(memberService.updateMember(id, member));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Delete member")
    public ResponseEntity<ApiResponse> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok(new ApiResponse(true, "Member deleted successfully"));
    }
}
