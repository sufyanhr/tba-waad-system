package com.waad.tba.modules.employers.service;

import com.waad.tba.modules.employers.model.Organization;
import com.waad.tba.modules.employers.repository.OrganizationRepository;
import com.waad.tba.modules.insurance.model.Policy;
import com.waad.tba.modules.insurance.repository.PolicyRepository;
import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.members.repository.MemberRepository;
import com.waad.tba.modules.claims.model.Claim;
import com.waad.tba.modules.claims.repository.ClaimRepository;
import com.waad.tba.modules.employers.dto.EmployerDashboard;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployerService {

    private final OrganizationRepository organizationRepository;
    private final PolicyRepository policyRepository;
    private final MemberRepository memberRepository;
    private final ClaimRepository claimRepository;

    /**
     * إنشاء صاحب عمل جديد
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_MANAGE') or hasRole('ADMIN')")
    public Organization createEmployer(Organization employer) {
        validateEmployerData(employer);
        
        // التحقق من عدم تكرار الاسم
        if (organizationRepository.findByName(employer.getName()).isPresent()) {
            throw new IllegalArgumentException("Employer name already exists: " + employer.getName());
        }
        
        employer.setActive(true);
        return organizationRepository.save(employer);
    }

    /**
     * تحديث بيانات صاحب عمل
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_MANAGE') or hasRole('ADMIN')")
    public Organization updateEmployer(Long id, Organization employerData) {
        Organization existing = getEmployerById(id);
        validateEmployerData(employerData);
        
        existing.setName(employerData.getName());
        existing.setDescription(employerData.getDescription());
        existing.setAddress(employerData.getAddress());
        existing.setPhone(employerData.getPhone());
        existing.setEmail(employerData.getEmail());
        existing.setContactPerson(employerData.getContactPerson());
        
        return organizationRepository.save(existing);
    }

    /**
     * الحصول على صاحب عمل بالمعرف
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_VIEW') or hasRole('USER')")
    public Organization getEmployerById(Long id) {
        return organizationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Employer not found with id: " + id));
    }

    /**
     * الحصول على جميع أصحاب العمل
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_VIEW') or hasRole('ADMIN')")
    public Page<Organization> getAllEmployers(Pageable pageable) {
        return organizationRepository.findAll(pageable);
    }

    /**
     * الحصول على أصحاب العمل النشطين
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_VIEW') or hasRole('USER')")
    public List<Organization> getActiveEmployers() {
        return organizationRepository.findByActiveTrue();
    }

    /**
     * تعيين بوليصة لصاحب عمل
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_MANAGE') or hasRole('ADMIN')")
    public Organization assignPolicy(Long employerId, Long policyId) {
        Organization employer = getEmployerById(employerId);
        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new IllegalArgumentException("Policy not found with id: " + policyId));
        
        if (!policy.getIsActive()) {
            throw new IllegalArgumentException("Cannot assign inactive policy");
        }
        
        // تحديث البوليصة لتشير لصاحب العمل
        policy.setOrganization(employer);
        policyRepository.save(policy);
        
        return employer;
    }

    /**
     * الحصول على لوحة تحكم صاحب العمل
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_VIEW') or " +
                 "(hasRole('EMPLOYER') and @employerSecurityService.canAccessEmployer(authentication, #employerId))")
    public EmployerDashboard getEmployerDashboard(Long employerId) {
        Organization employer = getEmployerById(employerId);
        
        EmployerDashboard dashboard = new EmployerDashboard();
        dashboard.setEmployerId(employerId);
        dashboard.setEmployerName(employer.getName());
        
        // إحصائيات الأعضاء
        List<Member> members = memberRepository.findByOrganization(employer);
        dashboard.setTotalMembers((long) members.size());
        dashboard.setActiveMembers(members.stream()
            .filter(Member::getActive)
            .count());
        
        // إحصائيات المطالبات
        List<Claim> claims = claimRepository.findByMemberOrganizationId(employerId);
        dashboard.setTotalClaims((long) claims.size());
        
        dashboard.setApprovedClaims(claims.stream()
            .filter(claim -> claim.getStatus() == Claim.ClaimStatus.APPROVED)
            .count());
        
        dashboard.setRejectedClaims(claims.stream()
            .filter(claim -> claim.getStatus() == Claim.ClaimStatus.REJECTED)
            .count());
        
        dashboard.setPendingClaims(claims.stream()
            .filter(claim -> claim.getStatus() == Claim.ClaimStatus.PENDING_REVIEW ||
                             claim.getStatus() == Claim.ClaimStatus.UNDER_REVIEW)
            .count());
        
        // الإحصائيات المالية
        BigDecimal totalApprovedAmount = claims.stream()
            .filter(claim -> claim.getStatus() == Claim.ClaimStatus.APPROVED)
            .map(Claim::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.setTotalApprovedAmount(totalApprovedAmount);
        
        BigDecimal totalClaimsAmount = claims.stream()
            .map(Claim::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.setTotalClaimsAmount(totalClaimsAmount);
        
        // حساب الحد المتبقي من البوليصة
        List<Policy> employerPolicies = policyRepository.findByOrganizationIdAndIsActiveTrue(employerId);
        if (!employerPolicies.isEmpty()) {
            Policy currentPolicy = employerPolicies.get(0);
            dashboard.setPolicyLimit(currentPolicy.getAnnualLimit());
            dashboard.setRemainingLimit(currentPolicy.getAnnualLimit().subtract(totalApprovedAmount));
            dashboard.setPolicyName(currentPolicy.getName());
        } else {
            dashboard.setPolicyLimit(BigDecimal.ZERO);
            dashboard.setRemainingLimit(BigDecimal.ZERO);
            dashboard.setPolicyName("No active policy");
        }
        
        return dashboard;
    }

    /**
     * تفعيل/إيقاف صاحب عمل
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_MANAGE') or hasRole('ADMIN')")
    public Organization toggleEmployerStatus(Long id) {
        Organization employer = getEmployerById(id);
        employer.setActive(!employer.getActive());
        return organizationRepository.save(employer);
    }

    /**
     * حذف صاحب عمل (حذف منطقي)
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_MANAGE') or hasRole('ADMIN')")
    public void deleteEmployer(Long id) {
        Organization employer = getEmployerById(id);
        employer.setActive(false);
        organizationRepository.save(employer);
    }

    /**
     * رفع قائمة أعضاء بالجملة (مؤجل للتطبيق لاحقاً)
     */
    @PreAuthorize("hasAuthority('EMPLOYERS_MANAGE') or hasRole('ADMIN')")
    public String bulkUploadMembers(Long employerId, byte[] excelFile) {
        // TODO: تطبيق منطق قراءة ملف Excel ورفع الأعضاء
        return "Bulk upload feature will be implemented in future versions";
    }

    // ==== Private Helper Methods ====

    private void validateEmployerData(Organization employer) {
        if (employer.getName() == null || employer.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Employer name is required");
        }
        
        if (employer.getPhone() == null || employer.getPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("Employer phone is required");
        }
        
        if (employer.getEmail() != null && !employer.getEmail().trim().isEmpty()) {
            if (!isValidEmail(employer.getEmail())) {
                throw new IllegalArgumentException("Invalid email format");
            }
        }
    }

    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    }
}