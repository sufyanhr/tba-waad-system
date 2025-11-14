package com.waad.tba.modules.claims.service;

import com.waad.tba.modules.claims.model.Claim;
import com.waad.tba.modules.claims.model.ClaimItem;
import com.waad.tba.modules.claims.model.ClaimAttachment;
import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.members.model.BenefitUsage;
import com.waad.tba.modules.members.model.BenefitTable;
import com.waad.tba.modules.providers.model.Provider;
import com.waad.tba.security.model.User;
import com.waad.tba.modules.claims.repository.ClaimRepository;
import com.waad.tba.modules.claims.repository.ClaimItemRepository;
import com.waad.tba.modules.claims.repository.ClaimAttachmentRepository;
import com.waad.tba.modules.members.repository.MemberRepository;
import com.waad.tba.modules.members.repository.BenefitUsageRepository;
import com.waad.tba.modules.members.repository.BenefitTableRepository;
import com.waad.tba.modules.providers.repository.ProviderRepository;
import com.waad.tba.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.UUID;

/**
 * خدمة إدارة المطالبات الطبية
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ClaimItemRepository claimItemRepository;
    private final ClaimAttachmentRepository claimAttachmentRepository;
    private final MemberRepository memberRepository;
    private final BenefitUsageRepository benefitUsageRepository;
    private final BenefitTableRepository benefitTableRepository;
    private final ProviderRepository providerRepository;
    private final UserRepository userRepository;

    /**
     * تقديم مطالبة جديدة
     */
    public Claim submitClaim(Claim claim) {
        // التحقق من صحة البيانات الأساسية
        validateClaimData(claim);
        
        // توليد رقم المطالبة
        claim.setClaimNumber(generateClaimNumber());
        claim.setStatus(Claim.ClaimStatus.SUBMITTED);
        claim.setSubmissionDate(LocalDate.now());
        
        // حفظ المطالبة الأساسية
        Claim savedClaim = claimRepository.save(claim);
        
        // معالجة عناصر المطالبة وحساب التكلفة
        if (claim.getClaimItems() != null && !claim.getClaimItems().isEmpty()) {
            for (ClaimItem item : claim.getClaimItems()) {
                item.setClaim(savedClaim);
                calculateClaimItemCost(item, savedClaim.getMember());
                claimItemRepository.save(item);
            }
            
            // حساب إجماليات المطالبة
            calculateClaimTotals(savedClaim);
            claimRepository.save(savedClaim);
        }
        
        return savedClaim;
    }

    /**
     * مراجعة المطالبة
     */
    public Claim reviewClaim(Long claimId, String reviewNotes) {
        Claim claim = getClaimById(claimId);
        
        // التحقق من صلاحية المراجعة
        validateReviewAccess(claim);
        
        claim.setStatus(Claim.ClaimStatus.UNDER_REVIEW);
        claim.setReviewedBy(getCurrentUser().getUsername());
        claim.setReviewedAt(LocalDateTime.now());
        claim.setNotes(reviewNotes);
        
        return claimRepository.save(claim);
    }

    /**
     * موافقة على المطالبة
     */
    public Claim approveClaim(Long claimId, String approvalNotes) {
        Claim claim = getClaimById(claimId);
        
        // التحقق من صلاحية الموافقة
        validateApprovalAccess(claim);
        
        // التحقق من توفر الرصيد
        validateMemberBenefitBalance(claim);
        
        // تحديث استخدام المنافع
        updateBenefitUsage(claim);
        
        claim.setStatus(Claim.ClaimStatus.APPROVED);
        claim.setApprovedBy(getCurrentUser().getUsername());
        claim.setApprovedAt(LocalDateTime.now());
        if (approvalNotes != null) {
            claim.setNotes((claim.getNotes() != null ? claim.getNotes() + "\\n" : "") + approvalNotes);
        }
        
        return claimRepository.save(claim);
    }

    /**
     * رفض المطالبة
     */
    public Claim rejectClaim(Long claimId, String rejectionReason) {
        Claim claim = getClaimById(claimId);
        
        // التحقق من صلاحية الرفض
        validateApprovalAccess(claim);
        
        claim.setStatus(Claim.ClaimStatus.REJECTED);
        claim.setRejectionReason(rejectionReason);
        claim.setApprovedBy(getCurrentUser().getUsername());
        claim.setApprovedAt(LocalDateTime.now());
        
        return claimRepository.save(claim);
    }

    /**
     * إرفاق مستندات للمطالبة
     */
    public ClaimAttachment attachDocument(Long claimId, MultipartFile file, String documentType) {
        Claim claim = getClaimById(claimId);
        
        // التحقق من صلاحية الإرفاق
        validateAttachmentAccess(claim);
        
        ClaimAttachment attachment = new ClaimAttachment();
        attachment.setClaim(claim);
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFileType(file.getContentType());
        attachment.setFileSize(file.getSize());
        attachment.setDocumentType(documentType);
        
        // TODO: رفع الملف إلى نظام التخزين (AWS S3, etc.)
        attachment.setFilePath("/uploads/claims/" + claimId + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename());
        
        return claimAttachmentRepository.save(attachment);
    }

    /**
     * الحصول على مطالبة بالمعرف
     */
    public Claim getClaimById(Long claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with ID: " + claimId));
        
        validateClaimAccess(claim);
        return claim;
    }

    /**
     * الحصول على جميع المطالبات مع فلترة حسب الصلاحيات
     */
    public List<Claim> getAllClaims() {
        User currentUser = getCurrentUser();
        
        if (currentUser.hasRole("ADMIN")) {
            return claimRepository.findAll();
        } else if (currentUser.hasRole("INSURANCE") || currentUser.hasRole("REVIEW")) {
            return claimRepository.findAll(); // TODO: فلترة حسب شركة التأمين
        } else if (currentUser.hasRole("EMPLOYER")) {
            // عرض مطالبات أعضاء المؤسسة فقط
            return claimRepository.findByMemberOrganization(currentUser.getOrganization());
        }
        
        throw new RuntimeException("Access denied");
    }

    /**
     * الحصول على مطالبات عضو معين
     */
    public List<Claim> getClaimsByMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        validateMemberAccess(member);
        return claimRepository.findByMember(member);
    }

    // ==== Private Helper Methods ====

    /**
     * حساب تكلفة عنصر المطالبة
     */
    private void calculateClaimItemCost(ClaimItem item, Member member) {
        // البحث عن البنفت المطابق
        BenefitTable benefit = benefitTableRepository.findByServiceCodeAndActiveTrue(item.getServiceCode())
                .orElseThrow(() -> new RuntimeException("Service not found or not active: " + item.getServiceCode()));
        
        item.setServiceName(benefit.getServiceName());
        item.setServiceCategory(benefit.getServiceCategory());
        
        // حساب المبلغ الإجمالي
        BigDecimal totalAmount = item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()));
        item.setTotalAmount(totalAmount);
        
        // حساب التغطية
        BigDecimal coveragePercentage = benefit.getCoveragePercent();
        BigDecimal coveredAmount = totalAmount.multiply(coveragePercentage).divide(new BigDecimal("100"), RoundingMode.HALF_UP);
        
        // التحقق من الحد الأقصى للمنفعة
        int currentYear = Year.now().getValue();
        BenefitUsage usage = benefitUsageRepository.findByMemberAndBenefitAndYear(member, benefit, currentYear)
                .orElse(new BenefitUsage(member, member.getPolicy(), benefit, currentYear));
        
        // التحقق من توفر الرصيد
        if (usage.getRemainingAmount().compareTo(coveredAmount) < 0) {
            coveredAmount = usage.getRemainingAmount();
        }
        
        item.setCoveredAmount(coveredAmount);
        item.setMemberContribution(totalAmount.subtract(coveredAmount));
        item.setCoveragePercentage(coveragePercentage);
        item.setStatus(ClaimItem.ClaimItemStatus.PENDING);
    }

    /**
     * حساب إجماليات المطالبة
     */
    private void calculateClaimTotals(Claim claim) {
        List<ClaimItem> items = claimItemRepository.findByClaim(claim);
        
        BigDecimal totalAmount = items.stream()
                .map(ClaimItem::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal coveredAmount = items.stream()
                .map(ClaimItem::getCoveredAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal memberContribution = items.stream()
                .map(ClaimItem::getMemberContribution)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        claim.setTotalAmount(totalAmount);
        claim.setCoveredAmount(coveredAmount);
        claim.setMemberContribution(memberContribution);
    }

    /**
     * تحديث استخدام المنافع عند الموافقة
     */
    private void updateBenefitUsage(Claim claim) {
        List<ClaimItem> approvedItems = claimItemRepository.findByClaim(claim);
        int currentYear = Year.now().getValue();
        
        for (ClaimItem item : approvedItems) {
            if (item.getStatus() == ClaimItem.ClaimItemStatus.APPROVED || 
                item.getStatus() == ClaimItem.ClaimItemStatus.PENDING) {
                
                BenefitTable benefit = benefitTableRepository.findByServiceCodeAndActiveTrue(item.getServiceCode())
                        .orElseThrow(() -> new RuntimeException("Benefit not found"));
                
                BenefitUsage usage = benefitUsageRepository.findByMemberAndBenefitAndYear(
                        claim.getMember(), benefit, currentYear)
                        .orElse(new BenefitUsage(claim.getMember(), claim.getMember().getPolicy(), benefit, currentYear));
                
                usage.updateUsage(item.getCoveredAmount(), item.getQuantity());
                benefitUsageRepository.save(usage);
                
                item.setStatus(ClaimItem.ClaimItemStatus.APPROVED);
                claimItemRepository.save(item);
            }
        }
    }

    // ==== Validation Methods ====

    private void validateClaimData(Claim claim) {
        if (claim.getMember() == null) {
            throw new RuntimeException("Member is required");
        }
        if (claim.getProvider() == null) {
            throw new RuntimeException("Provider is required");
        }
        if (claim.getServiceDate() == null) {
            throw new RuntimeException("Service date is required");
        }
        if (claim.getServiceDate().isAfter(LocalDate.now())) {
            throw new RuntimeException("Service date cannot be in the future");
        }
    }

    private void validateMemberBenefitBalance(Claim claim) {
        List<ClaimItem> items = claimItemRepository.findByClaim(claim);
        int currentYear = Year.now().getValue();
        
        for (ClaimItem item : items) {
            BenefitTable benefit = benefitTableRepository.findByServiceCodeAndActiveTrue(item.getServiceCode())
                    .orElseThrow(() -> new RuntimeException("Benefit not found"));
            
            BenefitUsage usage = benefitUsageRepository.findByMemberAndBenefitAndYear(
                    claim.getMember(), benefit, currentYear)
                    .orElse(new BenefitUsage(claim.getMember(), claim.getMember().getPolicy(), benefit, currentYear));
            
            if (usage.getRemainingAmount().compareTo(item.getCoveredAmount()) < 0) {
                throw new RuntimeException("Insufficient benefit balance for service: " + item.getServiceName());
            }
        }
    }

    private void validateClaimAccess(Claim claim) {
        User currentUser = getCurrentUser();
        
        if (currentUser.hasRole("ADMIN")) {
            return;
        }
        
        if (currentUser.hasRole("EMPLOYER")) {
            if (currentUser.getOrganization() == null || 
                !claim.getMember().getOrganization().getId().equals(currentUser.getOrganization().getId())) {
                throw new RuntimeException("Access denied to this claim");
            }
            return;
        }
        
        if (currentUser.hasRole("INSURANCE") || currentUser.hasRole("REVIEW")) {
            return;
        }
        
        throw new RuntimeException("Access denied");
    }

    private void validateMemberAccess(Member member) {
        User currentUser = getCurrentUser();
        
        if (currentUser.hasRole("ADMIN")) {
            return;
        }
        
        if (currentUser.hasRole("EMPLOYER")) {
            if (currentUser.getOrganization() == null || 
                !member.getOrganization().getId().equals(currentUser.getOrganization().getId())) {
                throw new RuntimeException("Access denied to this member");
            }
            return;
        }
        
        throw new RuntimeException("Access denied");
    }

    private void validateReviewAccess(Claim claim) {
        User currentUser = getCurrentUser();
        
        if (!currentUser.hasRole("REVIEW") && !currentUser.hasRole("INSURANCE") && !currentUser.hasRole("ADMIN")) {
            throw new RuntimeException("Access denied: review permission required");
        }
    }

    private void validateApprovalAccess(Claim claim) {
        User currentUser = getCurrentUser();
        
        if (!currentUser.hasRole("REVIEW") && !currentUser.hasRole("ADMIN")) {
            throw new RuntimeException("Access denied: approval permission required");
        }
    }

    private void validateAttachmentAccess(Claim claim) {
        validateClaimAccess(claim);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized access");
        }
        
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String generateClaimNumber() {
        String prefix = "CLM";
        String year = String.valueOf(Year.now().getValue());
        String timestamp = String.valueOf(System.currentTimeMillis());
        return prefix + year + timestamp.substring(timestamp.length() - 6);
    }
}

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
        if (currentUser.hasRole("ADMIN")) {
            return claimRepository.findAll();
        }

        // 🟦 INSURANCE يرى كل المطالبات الخاصة بشركات التأمين التابعة له
        if (currentUser.hasRole("INSURANCE")) {
            if (currentUser.getInsuranceCompany() == null) {
                throw new RuntimeException("Insurance user not linked to a company");
            }
            // لاحقًا يمكن تخصيصها عبر ربط المطالبة بشركة التأمين
            return claimRepository.findAll();
        }

        // 🟨 EMPLOYER يرى فقط المطالبات لأعضاء مؤسسته
        if (currentUser.hasRole("EMPLOYER")) {
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
        if (currentUser.hasRole("PROVIDER")) {
            return claimRepository.findAll().stream()
                    .filter(c -> c.getProvider() != null &&
                            c.getProvider().getEmail().equalsIgnoreCase(currentUser.getEmail()))
                    .toList();
        }

        // 🟪 MEMBER يرى فقط مطالبه الشخصية
        if (currentUser.hasRole("MEMBER")) {
            return claimRepository.findAll().stream()
                    .filter(c -> c.getMember() != null &&
                            c.getMember().getEmail().equalsIgnoreCase(currentUser.getEmail()))
                    .toList();
        }

        throw new RuntimeException("Access denied for user roles");
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
