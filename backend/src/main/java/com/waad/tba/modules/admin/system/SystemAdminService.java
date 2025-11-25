package com.waad.tba.modules.admin.system;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.claim.repository.ClaimRepository;
import com.waad.tba.modules.visit.repository.VisitRepository;
import com.waad.tba.modules.member.repository.MemberRepository;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import com.waad.tba.modules.reviewer.repository.ReviewerCompanyRepository;
import com.waad.tba.modules.claim.entity.Claim;
import com.waad.tba.modules.visit.entity.Visit;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.employer.entity.Employer;
import com.waad.tba.modules.insurance.entity.InsuranceCompany;
import com.waad.tba.modules.reviewer.entity.ReviewerCompany;
import com.waad.tba.modules.rbac.entity.User;
import com.waad.tba.modules.rbac.entity.Role;
import com.waad.tba.modules.rbac.entity.Permission;
import com.waad.tba.modules.rbac.repository.UserRepository;
import com.waad.tba.modules.rbac.repository.RoleRepository;
import com.waad.tba.modules.rbac.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

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
        log.info("Initializing default RBAC data if missing...");
        ensurePermissions();
        ensureRoles();
        ensureAdminUser();
        return ApiResponse.success("Defaults initialized", null);
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
                .fullName("Fatima Al-Mahdi")
                .civilId("198912345678")
                .policyNumber("MBR-0001")
                .phone("+218942345678")
                .email("fatima.mahdi@example.ly")
                .employerId(employer.getId())
                .companyId(1L)
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

        // Claim referencing Visit
        Claim claim = Claim.builder()
                .claimNumber("CLM-001")
                .claimDate(LocalDate.now())
                .requestedAmount(new java.math.BigDecimal("2500.00"))
                .approvedAmount(null)
                .status(Claim.ClaimStatus.PENDING)
                .notes("Initial dental surgery claim")
                .visit(visit)
                .build();
        claimRepository.save(claim);

        log.info("Sample data inserted.");
        return ApiResponse.success("Sample test data inserted", null);
    }

    private void ensurePermissions() {
        List<String> basePermissions = Arrays.asList(
                "rbac.view","rbac.manage","user.view","user.manage","role.view","role.manage","permission.view","permission.manage",
                "insurance.view","insurance.manage","reviewer.view","reviewer.manage","employer.view","employer.manage","member.view","member.manage",
                "visit.view","visit.manage","claim.view","claim.manage","claim.approve","claim.reject","dashboard.view","system.manage"
        );
        for (String pName : basePermissions) {
            permissionRepository.findByName(pName).orElseGet(() -> permissionRepository.save(Permission.builder().name(pName).description(pName + " permission").build()));
        }
    }

    private void ensureRoles() {
        List<Permission> allPermissions = permissionRepository.findAll();
        roleRepository.findByName("ADMIN").orElseGet(() -> roleRepository.save(Role.builder().name("ADMIN").description("Administrator").permissions(new HashSet<>(allPermissions)).build()));
        roleRepository.findByName("MANAGER").orElseGet(() -> {
            Set<Permission> perms = new HashSet<>();
            allPermissions.forEach(p -> {
                if (p.getName().contains(".view") || p.getName().startsWith("claim") || p.getName().startsWith("member")) {
                    perms.add(p);
                }
            });
            return roleRepository.save(Role.builder().name("MANAGER").description("Manager role").permissions(perms).build());
        });
        roleRepository.findByName("USER").orElseGet(() -> {
            Set<Permission> perms = new HashSet<>();
            allPermissions.forEach(p -> { if (p.getName().contains(".view")) perms.add(p); });
            return roleRepository.save(Role.builder().name("USER").description("User role").permissions(perms).build());
        });
    }

    private void ensureAdminUser() {
        if (userRepository.findByUsername("admin").isPresent()) return;
        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow(() -> new IllegalStateException("ADMIN role missing"));
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .fullName("System Administrator")
                .email("admin@tba-waad.com")
                .active(true)
                .roles(new HashSet<>(Collections.singletonList(adminRole)))
                .build();
        userRepository.save(admin);
    }
}
