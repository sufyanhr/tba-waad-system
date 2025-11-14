package com.waad.tba.modules.reports.controller;

import com.waad.tba.security.repository.UserRepository;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import com.waad.tba.modules.insurance.repository.PolicyRepository;
import com.waad.tba.modules.claims.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final InsuranceCompanyRepository insuranceCompanyRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;

    // 🧮 1. عدد المستخدمين
    @GetMapping("/users/count")
    public long countUsers() {
        return userRepository.count();
    }

    // 🧮 2. عدد الشركات التأمينية
    @GetMapping("/companies/count")
    public long countCompanies() {
        return insuranceCompanyRepository.count();
    }

    // 🧮 3. عدد البوليصات
    @GetMapping("/policies/count")
    public long countPolicies() {
        return policyRepository.count();
    }

    // 🧮 4. عدد المطالبات
    @GetMapping("/claims/count")
    public long countClaims() {
        return claimRepository.count();
    }

    // 🕓 5. آخر 10 مطالبات مضافة
    @GetMapping("/claims/recent")
    public List<Map<String, Object>> recentClaims() {
        var claims = claimRepository.findTop10ByOrderByCreatedAtDesc();
        List<Map<String, Object>> response = new ArrayList<>();

        for (var claim : claims) {
            Map<String, Object> row = new HashMap<>();
            row.put("memberName", claim.getMember() != null ? claim.getMember().getFullName() : "Unknown");
            row.put("companyName", claim.getInsuranceCompany() != null ? claim.getInsuranceCompany().getName() : "N/A");
            row.put("amount", claim.getAmount());
            row.put("status", claim.getStatus());
            row.put("date", claim.getCreatedAt());
            response.add(row);
        }

        return response;
    }
}
