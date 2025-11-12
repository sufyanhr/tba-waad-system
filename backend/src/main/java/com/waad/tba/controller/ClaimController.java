package com.waad.tba.controller;

import com.waad.tba.dto.ApiResponse;
import com.waad.tba.model.Claim;
import com.waad.tba.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.waad.tba.model.Member;
import com.waad.tba.model.User;
import com.waad.tba.repository.MemberRepository;
import com.waad.tba.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Claims", description = "Claim management endpoints")
public class ClaimController {
    
    private final ClaimService claimService;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Get all claims")
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER', 'MEMBER')")
    @Operation(summary = "Get claim by ID")
    public ResponseEntity<Claim> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }
    
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'MEMBER')")
    @Operation(summary = "Get claims by member")
    public ResponseEntity<List<Claim>> getClaimsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(claimService.getClaimsByMember(memberId));
    }
    
    @GetMapping("/provider/{providerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Get claims by provider")
    public ResponseEntity<List<Claim>> getClaimsByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(claimService.getClaimsByProvider(providerId));
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Get claims by status")
    public ResponseEntity<List<Claim>> getClaimsByStatus(@PathVariable Claim.ClaimStatus status) {
        return ResponseEntity.ok(claimService.getClaimsByStatus(status));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Create new claim")
    public ResponseEntity<?> createClaim(@RequestBody Claim claim) {
        try {
            // ✅ حتى لو جاء claimNumber فارغ من الواجهة، الخدمة تتكفل بتوليده تلقائيًا
            Claim savedClaim = claimService.createClaim(claim);

            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Claim created successfully",
                    savedClaim
            ));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse(
                    false,
                    "Failed to create claim: " + ex.getMessage(),
                    null
            ));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Update claim")
    public ResponseEntity<Claim> updateClaim(@PathVariable Long id, @RequestBody Claim claim) {
        return ResponseEntity.ok(claimService.updateClaim(id, claim));
    }
    
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Approve claim")
    public ResponseEntity<Claim> approveClaim(@PathVariable Long id, @RequestParam String reviewedBy) {
        return ResponseEntity.ok(claimService.approveClaim(id, reviewedBy));
    }
    
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE')")
    @Operation(summary = "Reject claim")
    public ResponseEntity<Claim> rejectClaim(@PathVariable Long id, @RequestParam String reviewedBy, @RequestParam String reason) {
        return ResponseEntity.ok(claimService.rejectClaim(id, reviewedBy, reason));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete claim")
    public ResponseEntity<ApiResponse> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.ok(new ApiResponse(true, "Claim deleted successfully"));
    }
    @PostMapping("/create-from-verification")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSURANCE', 'PROVIDER')")
    @Operation(summary = "Create a claim directly after member verification (via QR or employee code)")
    public ResponseEntity<ApiResponse> createClaimFromVerification(
            @RequestParam(required = false) String qr,
            @RequestParam(required = false) String employeeCode,
            @RequestBody Claim claimDetails) {

        // 🟦 البحث عن العضو بحسب QR أو employeeCode
        Member member = memberRepository.findAll().stream()
                .filter(m -> (qr != null && qr.equalsIgnoreCase(m.getQrCode())) ||
                        (employeeCode != null && employeeCode.equalsIgnoreCase(m.getEmployeeCode())))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Member not found for the provided QR or employee code"));

        // 🟩 الحصول على المستخدم الحالي (المزوّد)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // 🟨 إنشاء مطالبة جديدة مرتبطة بالعضو والمزوّد
        Claim claim = new Claim();
        claim.setMember(member);
        claim.setProvider(currentUser.getProvider()); // يتطلب أن يكون المستخدم مربوط بـ Provider
        claim.setServiceDate(claimDetails.getServiceDate());
        claim.setDiagnosis(claimDetails.getDiagnosis());
        claim.setTreatmentDescription(claimDetails.getTreatmentDescription());
        claim.setClaimedAmount(claimDetails.getClaimedAmount());
        claim.setSubmissionDate(LocalDate.now());
        claim.setStatus(Claim.ClaimStatus.SUBMITTED);

        Claim savedClaim = claimService.createClaim(claim);

        return ResponseEntity.ok(new ApiResponse(true, "Claim created successfully", savedClaim));
    }
}
