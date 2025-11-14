package com.waad.tba.modules.finance.service;

import com.waad.tba.modules.claims.model.Claim;
import com.waad.tba.modules.claims.repository.ClaimRepository;
import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.members.model.BenefitUsage;
import com.waad.tba.modules.members.repository.MemberRepository;
import com.waad.tba.modules.members.repository.BenefitUsageRepository;
import com.waad.tba.modules.providers.model.Provider;
import com.waad.tba.modules.providers.repository.ProviderRepository;
import com.waad.tba.modules.employers.model.Organization;
import com.waad.tba.modules.employers.repository.OrganizationRepository;
import com.waad.tba.modules.finance.dto.ProviderSettlement;
import com.waad.tba.modules.finance.dto.MemberUsageReport;
import com.waad.tba.modules.finance.dto.EmployerUsageReport;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinanceService {

    private final ClaimRepository claimRepository;
    private final ProviderRepository providerRepository;
    private final MemberRepository memberRepository;
    private final BenefitUsageRepository benefitUsageRepository;
    private final OrganizationRepository organizationRepository;

    /**
     * حساب تسوية مقدم الخدمة
     */
    @PreAuthorize("hasAuthority('FINANCE_VIEW') or hasRole('ADMIN') or hasRole('INSURANCE')")
    public ProviderSettlement calculateProviderSettlement(Long providerId, LocalDate periodFrom, LocalDate periodTo) {
        Provider provider = providerRepository.findById(providerId)
            .orElseThrow(() -> new IllegalArgumentException("Provider not found with id: " + providerId));
        
        // تحويل LocalDate إلى LocalDateTime للبحث
        LocalDateTime fromDateTime = periodFrom.atStartOfDay();
        LocalDateTime toDateTime = periodTo.atTime(23, 59, 59);
        
        // الحصول على المطالبات المعتمدة للمقدم في الفترة المحددة
        List<Claim> approvedClaims = claimRepository.findByClaimDateBetween(fromDateTime, toDateTime)
            .stream()
            .filter(claim -> claim.getProvider().getId().equals(providerId))
            .filter(claim -> claim.getStatus() == Claim.ClaimStatus.APPROVED)
            .collect(Collectors.toList());
        
        ProviderSettlement settlement = new ProviderSettlement();
        settlement.setProviderId(providerId);
        settlement.setProviderName(provider.getName());
        settlement.setPeriodFrom(periodFrom);
        settlement.setPeriodTo(periodTo);
        settlement.setTotalClaims((long) approvedClaims.size());
        
        BigDecimal totalApprovedAmount = BigDecimal.ZERO;
        BigDecimal totalMemberCoPay = BigDecimal.ZERO;
        
        for (Claim claim : approvedClaims) {
            BigDecimal claimAmount = claim.getTotalAmount();
            BigDecimal memberContribution = claim.getMemberContribution() != null ? 
                claim.getMemberContribution() : BigDecimal.ZERO;
            
            totalApprovedAmount = totalApprovedAmount.add(claimAmount);
            totalMemberCoPay = totalMemberCoPay.add(memberContribution);
        }
        
        settlement.setTotalApprovedAmount(totalApprovedAmount);
        settlement.setTotalMemberCoPay(totalMemberCoPay);
        settlement.setNetPayableToProvider(totalApprovedAmount.subtract(totalMemberCoPay));
        
        return settlement;
    }

    /**
     * تقرير استخدام العضو
     */
    @PreAuthorize("hasAuthority('FINANCE_VIEW') or hasRole('USER')")
    public MemberUsageReport generateMemberUsageReport(Long memberId) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new IllegalArgumentException("Member not found with id: " + memberId));
        
        int currentYear = Year.now().getValue();
        List<BenefitUsage> usages = benefitUsageRepository.findByMemberAndYear(member, currentYear);
        
        MemberUsageReport report = new MemberUsageReport();
        report.setMemberId(memberId);
        report.setMemberName(member.getFullName());
        report.setMemberNumber(member.getMemberNumber());
        report.setYear(currentYear);
        
        BigDecimal totalUsed = BigDecimal.ZERO;
        BigDecimal totalRemaining = BigDecimal.ZERO;
        
        for (BenefitUsage usage : usages) {
            MemberUsageReport.BenefitUsageDetail detail = new MemberUsageReport.BenefitUsageDetail();
            detail.setBenefitName(usage.getBenefit().getServiceName());
            detail.setBenefitCategory(usage.getBenefit().getServiceCategory());
            detail.setUsedAmount(usage.getUsedAmount());
            detail.setUsedTimes(usage.getUsedTimes());
            detail.setRemainingAmount(usage.getRemainingAmount());
            detail.setRemainingTimes(usage.getRemainingTimes());
            detail.setLastUsageDate(usage.getLastUsageDate());
            
            report.getBenefitUsages().add(detail);
            
            totalUsed = totalUsed.add(usage.getUsedAmount());
            totalRemaining = totalRemaining.add(usage.getRemainingAmount());
        }
        
        report.setTotalUsedAmount(totalUsed);
        report.setTotalRemainingAmount(totalRemaining);
        
        return report;
    }

    /**
     * تقرير استخدام صاحب العمل
     */
    @PreAuthorize("hasAuthority('FINANCE_VIEW') or hasRole('ADMIN') or hasRole('INSURANCE')")
    public EmployerUsageReport generateEmployerUsageReport(Long employerId) {
        Organization employer = organizationRepository.findById(employerId)
            .orElseThrow(() -> new IllegalArgumentException("Employer not found with id: " + employerId));
        
        List<Claim> allClaims = claimRepository.findByMemberOrganizationId(employerId);
        
        EmployerUsageReport report = new EmployerUsageReport();
        report.setEmployerId(employerId);
        report.setEmployerName(employer.getName());
        report.setTotalClaims((long) allClaims.size());
        
        BigDecimal totalApprovedAmount = BigDecimal.ZERO;
        BigDecimal totalRefusedAmount = BigDecimal.ZERO;
        long approvedCount = 0;
        long refusedCount = 0;
        
        for (Claim claim : allClaims) {
            if (claim.getStatus() == Claim.ClaimStatus.APPROVED) {
                totalApprovedAmount = totalApprovedAmount.add(claim.getTotalAmount());
                approvedCount++;
            } else if (claim.getStatus() == Claim.ClaimStatus.REJECTED) {
                totalRefusedAmount = totalRefusedAmount.add(claim.getTotalAmount());
                refusedCount++;
            }
        }
        
        report.setTotalApprovedAmount(totalApprovedAmount);
        report.setTotalRefusedAmount(totalRefusedAmount);
        report.setApprovedClaimsCount(approvedCount);
        report.setRefusedClaimsCount(refusedCount);
        
        // حساب معدلات الاستخدام والموافقة
        if (allClaims.size() > 0) {
            report.setApprovalRate((approvedCount * 100.0) / allClaims.size());
            report.setRefusalRate((refusedCount * 100.0) / allClaims.size());
        } else {
            report.setApprovalRate(0.0);
            report.setRefusalRate(0.0);
        }
        
        return report;
    }
}
