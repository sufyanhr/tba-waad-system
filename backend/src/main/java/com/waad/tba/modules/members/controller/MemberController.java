package com.waad.tba.modules.members.controller;

import com.waad.tba.core.dto.ApiResponse;
import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.members.service.MemberService;
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

    // 🔹 عرض جميع الأعضاء
    @GetMapping
    @PreAuthorize("hasAuthority('PERMISSION_MEMBERS_VIEW')")
    @Operation(summary = "Get all members")
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    // 🔹 عرض عضو واحد حسب ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_MEMBERS_VIEW')")
    @Operation(summary = "Get member by ID")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    // 🔹 عرض أعضاء مؤسسة معينة
    @GetMapping("/organization/{organizationId}")
    @PreAuthorize("hasAuthority('PERMISSION_MEMBERS_VIEW')")
    @Operation(summary = "Get members by organization")
    public ResponseEntity<List<Member>> getMembersByOrganization(@PathVariable Long organizationId) {
        return ResponseEntity.ok(memberService.getMembersByOrganization(organizationId));
    }

    // 🔹 إنشاء عضو جديد
    @PostMapping
    @PreAuthorize("hasAuthority('PERMISSION_MEMBERS_CREATE')")
    @Operation(summary = "Create new member")
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member createdMember = memberService.createMember(member);
        return ResponseEntity.ok(createdMember);
    }

    // 🔹 تحديث عضو
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_MEMBERS_UPDATE')")
    @Operation(summary = "Update member")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member member) {
        return ResponseEntity.ok(memberService.updateMember(id, member));
    }

    // 🔹 حذف عضو
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_MEMBERS_DELETE')")
    @Operation(summary = "Delete member")
    public ResponseEntity<ApiResponse> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok(new ApiResponse(true, "Member deleted successfully"));
    }
}
