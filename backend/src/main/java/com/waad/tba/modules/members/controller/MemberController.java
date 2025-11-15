package com.waad.tba.modules.members.controller;

import com.waad.tba.core.dto.ApiResponse;
import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.members.service.MemberService;
import com.waad.tba.security.PermissionConstants;
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
    @PreAuthorize("hasAuthority('" + PermissionConstants.MEMBERS_VIEW + "')")
    @Operation(summary = "Get all members")
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('" + PermissionConstants.MEMBERS_VIEW + "')")
    @Operation(summary = "Get member by ID")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @GetMapping("/organization/{organizationId}")
    @PreAuthorize("hasAuthority('" + PermissionConstants.MEMBERS_VIEW + "')")
    @Operation(summary = "Get members by organization")
    public ResponseEntity<List<Member>> getMembersByOrganization(@PathVariable Long organizationId) {
        return ResponseEntity.ok(memberService.getMembersByOrganization(organizationId));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + PermissionConstants.MEMBERS_CREATE + "')")
    @Operation(summary = "Create new member")
    public ResponseEntity<ApiResponse> createMember(@RequestBody Member member) {
        Member createdMember = memberService.createMember(member);
        return ResponseEntity.ok(new ApiResponse(true, "Member created successfully", createdMember));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + PermissionConstants.MEMBERS_UPDATE + "')")
    @Operation(summary = "Update member")
    public ResponseEntity<ApiResponse> updateMember(@PathVariable Long id, @RequestBody Member member) {
        Member updatedMember = memberService.updateMember(id, member);
        return ResponseEntity.ok(new ApiResponse(true, "Member updated successfully", updatedMember));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + PermissionConstants.MEMBERS_DELETE + "')")
    @Operation(summary = "Delete member")
    public ResponseEntity<ApiResponse> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok(new ApiResponse(true, "Member deleted successfully"));
    }
}
