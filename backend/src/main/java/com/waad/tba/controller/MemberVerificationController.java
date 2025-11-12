package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.model.Member;
import com.waad.tba.repository.MemberRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Member Verification", description = "Endpoints for verifying member QR or employee code")
public class MemberVerificationController {

    private final MemberRepository memberRepository;

    // ✅ التحقق عبر QR code
    @GetMapping("/verify")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Verify member by QR code or employee code")
    public ResponseEntity<ApiResponse> verifyMember(
            @RequestParam(required = false) String qr,
            @RequestParam(required = false) String employeeCode) {

        Optional<Member> memberOpt = Optional.empty();

        if (qr != null && !qr.isBlank()) {
            memberOpt = memberRepository.findAll().stream()
                    .filter(m -> qr.equalsIgnoreCase(m.getQrCode()))
                    .findFirst();
        } else if (employeeCode != null && !employeeCode.isBlank()) {
            memberOpt = memberRepository.findAll().stream()
                    .filter(m -> employeeCode.equalsIgnoreCase(m.getEmployeeCode()))
                    .findFirst();
        } else {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "QR code or employeeCode parameter is required"));
        }

        return memberOpt.map(member ->
                        ResponseEntity.ok(new ApiResponse(true, "Member verified successfully", member)))
                .orElse(ResponseEntity.ok(new ApiResponse(false, "Member not found")));
    }
}
