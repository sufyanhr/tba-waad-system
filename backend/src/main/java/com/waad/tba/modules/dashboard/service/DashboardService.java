package com.waad.tba.modules.dashboard.service;

import com.waad.tba.modules.claim.entity.Claim;
import com.waad.tba.modules.claim.repository.ClaimRepository;
import com.waad.tba.modules.dashboard.dto.ClaimsPerDayDto;
import com.waad.tba.modules.dashboard.dto.DashboardStatsDto;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import com.waad.tba.modules.member.repository.MemberRepository;
import com.waad.tba.modules.reviewer.repository.ReviewerCompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MemberRepository memberRepository;
    private final ClaimRepository claimRepository;
    private final EmployerRepository employerRepository;
    private final InsuranceCompanyRepository insuranceRepository;
    private final ReviewerCompanyRepository reviewerRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getStats() {
        log.debug("Fetching dashboard statistics");
        
        long totalMembers = memberRepository.count();
        long totalClaims = claimRepository.count();
        long pendingClaims = claimRepository.countByStatus(Claim.ClaimStatus.PENDING);
        long approvedClaims = claimRepository.countByStatus(Claim.ClaimStatus.APPROVED);
        long rejectedClaims = claimRepository.countByStatus(Claim.ClaimStatus.REJECTED);
        long totalEmployers = employerRepository.count();
        long totalInsurance = insuranceRepository.count();
        long totalReviewers = reviewerRepository.count();

        return DashboardStatsDto.builder()
                .totalMembers(totalMembers)
                .totalClaims(totalClaims)
                .pendingClaims(pendingClaims)
                .approvedClaims(approvedClaims)
                .rejectedClaims(rejectedClaims)
                .totalEmployers(totalEmployers)
                .totalInsuranceCompanies(totalInsurance)
                .totalReviewerCompanies(totalReviewers)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ClaimsPerDayDto> getClaimsPerDay(LocalDate startDate, LocalDate endDate) {
        log.debug("Fetching claims per day from {} to {}", startDate, endDate);
        
        List<Object[]> results = claimRepository.countClaimsPerDay(startDate, endDate);
        
        return results.stream()
                .map(row -> ClaimsPerDayDto.builder()
                        .date((LocalDate) row[0])
                        .count((Long) row[1])
                        .build())
                .collect(Collectors.toList());
    }
}
