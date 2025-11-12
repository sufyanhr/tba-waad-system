package com.waad.tba.service;

import com.waad.tba.exception.ResourceNotFoundException;
import com.waad.tba.model.Claim;
import com.waad.tba.model.User;
import com.waad.tba.repository.ClaimRepository;
import com.waad.tba.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.waad.tba.util.ClaimNumberGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimNumberGenerator claimNumberGenerator;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    // ✅ فلترة تلقائية حسب نوع المستخدم
    public List<Claim> getAllClaims() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized access");
        }

        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // 🟩 ADMIN يرى كل المطالبات
        if (currentUser.getRoles().contains(User.Role.ADMIN)) {
            return claimRepository.findAll();
        }

        // 🟦 INSURANCE يرى كل المطالبات الخاصة بشركات التأمين التابعة له
        if (currentUser.getRoles().contains(User.Role.INSURANCE)) {
            if (currentUser.getInsuranceCompany() == null) {
                throw new RuntimeException("Insurance user not linked to a company");
            }
            // لاحقًا يمكن تخصيصها عبر ربط المطالبة بشركة التأمين
            return claimRepository.findAll();
        }

        // 🟨 EMPLOYER يرى فقط المطالبات لأعضاء مؤسسته
        if (currentUser.getRoles().contains(User.Role.EMPLOYER)) {
            if (currentUser.getOrganization() == null) {
                throw new RuntimeException("Employer not linked to an organization");
            }
            return claimRepository.findAll().stream()
                    .filter(c -> c.getMember() != null &&
                            c.getMember().getOrganization() != null &&
                            c.getMember().getOrganization().equals(currentUser.getOrganization()))
                    .toList();
        }

        // 🟧 PROVIDER يرى فقط المطالبات المقدمة من منشأته الطبية
        if (currentUser.getRoles().contains(User.Role.PROVIDER)) {
            return claimRepository.findAll().stream()
                    .filter(c -> c.getProvider() != null &&
                            c.getProvider().getEmail().equalsIgnoreCase(currentUser.getEmail()))
                    .toList();
        }

        // 🟪 MEMBER يرى فقط مطالبه الشخصية
        if (currentUser.getRoles().contains(User.Role.MEMBER)) {
            return claimRepository.findAll().stream()
                    .filter(c -> c.getMember() != null &&
                            c.getMember().getEmail().equalsIgnoreCase(currentUser.getEmail()))
                    .toList();
        }

        throw new RuntimeException("Access denied for role: " + currentUser.getRoles());
    }

    public Claim getClaimById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));
    }

    public List<Claim> getClaimsByMember(Long memberId) {
        return claimRepository.findByMemberId(memberId);
    }

    public List<Claim> getClaimsByProvider(Long providerId) {
        return claimRepository.findByProviderId(providerId);
    }

    public List<Claim> getClaimsByStatus(Claim.ClaimStatus status) {
        return claimRepository.findByStatus(status);
    }

    @Transactional
    public Claim createClaim(Claim claim) {
        // ✅ توليد رقم مطالبة آمن وفريد من قاعدة البيانات
        if (claim.getClaimNumber() == null || claim.getClaimNumber().trim().isEmpty()) {
            claim.setClaimNumber(claimNumberGenerator.generateClaimNumber());
        }
        // ✅ إعداد الحقول الأساسية
        claim.setSubmissionDate(LocalDate.now());
        claim.setStatus(Claim.ClaimStatus.SUBMITTED);
        return claimRepository.save(claim);
    }

    @Transactional
    public Claim updateClaim(Long id, Claim claimDetails) {
        Claim claim = getClaimById(id);

        if (claimDetails.getServiceDate() != null) claim.setServiceDate(claimDetails.getServiceDate());
        if (claimDetails.getDiagnosis() != null) claim.setDiagnosis(claimDetails.getDiagnosis());
        if (claimDetails.getTreatmentDescription() != null) claim.setTreatmentDescription(claimDetails.getTreatmentDescription());
        if (claimDetails.getClaimedAmount() != null) claim.setClaimedAmount(claimDetails.getClaimedAmount());
        if (claimDetails.getApprovedAmount() != null) claim.setApprovedAmount(claimDetails.getApprovedAmount());
        if (claimDetails.getStatus() != null) claim.setStatus(claimDetails.getStatus());
        if (claimDetails.getRejectionReason() != null) claim.setRejectionReason(claimDetails.getRejectionReason());
        if (claimDetails.getDocumentUrls() != null) claim.setDocumentUrls(claimDetails.getDocumentUrls());
        if (claimDetails.getNotes() != null) claim.setNotes(claimDetails.getNotes());

        return claimRepository.save(claim);
    }

    @Transactional
    public Claim approveClaim(Long id, String reviewedBy) {
        Claim claim = getClaimById(id);
        claim.setStatus(Claim.ClaimStatus.APPROVED);
        claim.setReviewedBy(reviewedBy);
        claim.setReviewDate(LocalDateTime.now());
        return claimRepository.save(claim);
    }

    @Transactional
    public Claim rejectClaim(Long id, String reviewedBy, String reason) {
        Claim claim = getClaimById(id);
        claim.setStatus(Claim.ClaimStatus.REJECTED);
        claim.setReviewedBy(reviewedBy);
        claim.setReviewDate(LocalDateTime.now());
        claim.setRejectionReason(reason);
        return claimRepository.save(claim);
    }

    @Transactional
    public void deleteClaim(Long id) {
        Claim claim = getClaimById(id);
        claimRepository.delete(claim);
    }
}
