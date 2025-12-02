package com.waad.tba.modules.admin.system;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.claim.entity.Claim;
import com.waad.tba.modules.claim.repository.ClaimRepository;
import com.waad.tba.modules.company.entity.Company;
import com.waad.tba.modules.company.repository.CompanyRepository;
import com.waad.tba.modules.employer.entity.Employer;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import com.waad.tba.modules.insurance.entity.InsuranceCompany;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.member.repository.MemberRepository;
import com.waad.tba.modules.rbac.repository.PermissionRepository;
import com.waad.tba.modules.rbac.repository.RoleRepository;
import com.waad.tba.modules.rbac.repository.UserRepository;
import com.waad.tba.modules.reviewer.entity.ReviewerCompany;
import com.waad.tba.modules.reviewer.repository.ReviewerCompanyRepository;
import com.waad.tba.modules.visit.entity.Visit;
import com.waad.tba.modules.visit.repository.VisitRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemAdminService {

    private final ClaimRepository claimRepository;
    private final VisitRepository visitRepository;
    private final MemberRepository memberRepository;
    private final EmployerRepository employerRepository;
    private final InsuranceCompanyRepository insuranceCompanyRepository;
    private final ReviewerCompanyRepository reviewerCompanyRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ApiResponse<Void> resetTestData() {
        log.warn("Resetting test data (excluding RBAC tables)...");
        claimRepository.deleteAll();
        visitRepository.deleteAll();
        memberRepository.deleteAll();
        employerRepository.deleteAll();
        insuranceCompanyRepository.deleteAll();
        reviewerCompanyRepository.deleteAll();
        log.info("Test data cleared.");
        return ApiResponse.success("Test data cleared", null);
    }

    @Transactional
    public ApiResponse<Void> initDefaults() {
        log.info("Initializing default system data...");
        ensurePrimaryTenantCompany();
        // RBAC initialization moved to RbacDataInitializer
        return ApiResponse.success("Defaults initialized", null);
    }

    /**
     * Ensure the primary tenant company (Waad) exists in the system.
     * This is the main TPA company that owns all data.
     * Creates only if not exists (based on code).
     */
    private void ensurePrimaryTenantCompany() {
        String companyCode = "waad";
        
        Optional<Company> existing = companyRepository.findByCode(companyCode);
        
        if (existing.isPresent()) {
            Company company = existing.get();
            log.info("Primary tenant company already exists: ID={}, Code={}, Name={}", 
                company.getId(), company.getCode(), company.getName());
            return;
        }
        
        // Create the primary tenant company
        Company waadCompany = Company.builder()
                .name("شركة وعد لإدارة النفقات الطبية")
                .code(companyCode)
                .active(true)
                .build();
        
        Company savedCompany = companyRepository.save(waadCompany);
        
        log.info("✅ Primary tenant company created successfully!");
        log.info("   Company ID: {}", savedCompany.getId());
        log.info("   Company Code: {}", savedCompany.getCode());
        log.info("   Company Name: {}", savedCompany.getName());
        log.info("   Active: {}", savedCompany.getActive());
        log.info("   Created At: {}", savedCompany.getCreatedAt());
    }

    @Transactional
    public ApiResponse<Void> seedSampleData() {
        log.info("Seeding sample data...");
        // Employer
        Employer employer = Employer.builder()
                .name("Libya Oil Services")
                .contactName("Ahmed Saleh")
                .contactEmail("contact@libyaoil.ly")
                .contactPhone("+218912345678")
                .address("Tripoli Business Park")
                .build();
        employerRepository.save(employer);

        // Member
        Member member = Member.builder()
                .firstName("Fatima")
                .lastName("Al-Mahdi")
                .civilId("198912345678")
                .cardNumber("MBR-0001")
                .phone("+218942345678")
                .email("fatima.mahdi@example.ly")
                .employer(employer)
                .relation(Member.MemberRelation.SELF)
                .status(Member.MemberStatus.ACTIVE)
                .gender(Member.Gender.FEMALE)
                .dateOfBirth(LocalDate.of(1989, 1, 1))
                .startDate(LocalDate.now())
                .active(true)
                .build();
        memberRepository.save(member);

        // Reviewer Company
        ReviewerCompany reviewerCompany = ReviewerCompany.builder()
                .name("Libya Medical Reviewers")
                .medicalDirector("Dr. Sami Bashir")
                .phone("+218922345678")
                .email("info@lmr.ly")
                .address("Benghazi Health District")
                .build();
        reviewerCompanyRepository.save(reviewerCompany);

        // Insurance Company
        InsuranceCompany insuranceCompany = InsuranceCompany.builder()
                .name("Maghreb Insurance")
                .email("support@maghrebins.ly")
                .phone("+218912222222")
                .address("Misrata Commercial Center")
                .build();
        insuranceCompanyRepository.save(insuranceCompany);

        // Visit (created before claim and associated to member)
        Visit visit = Visit.builder()
                .visitDate(LocalDate.now())
                .doctorName("Dr. Mariam Khaled")
                .specialty("Dentistry")
                .diagnosis("Impacted tooth extraction")
                .member(member)
                .build();
        visitRepository.save(visit);

        // Claim referencing Member
        Claim claim = Claim.builder()
                .claimNumber("CLM-001")
                .member(member)
                .claimType(Claim.ClaimType.OUTPATIENT)
                .serviceDate(LocalDate.now())
                .submissionDate(LocalDate.now())
                .totalClaimed(new java.math.BigDecimal("2500.00"))
                .totalApproved(null)
                .status(Claim.ClaimStatus.PENDING)
                .notes("Initial dental surgery claim")
                .active(true)
                .build();
        claimRepository.save(claim);

        log.info("Sample data inserted.");
        return ApiResponse.success("Sample test data inserted", null);
    }

    // RBAC initialization methods removed - now handled by RbacDataInitializer
}
