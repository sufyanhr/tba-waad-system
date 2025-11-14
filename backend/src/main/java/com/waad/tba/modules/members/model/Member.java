package com.waad.tba.modules.members.model;

import com.waad.tba.modules.employers.model.Organization;
import com.waad.tba.modules.insurance.model.InsuranceCompany;
import com.waad.tba.modules.insurance.model.Policy;
import com.waad.tba.modules.claims.model.Claim;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Member {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_number", unique = true)
    private String memberNumber;  // رقم العضو المولد تلقائياً

    @Column(name = "medical_file_number", unique = true)
    private String medicalFileNumber;  // رقم الملف الطبي

    @Column(name = "qr_code", unique = true)
    private String qrCode;   // رقم QR الفريد أو UUID

    @Column(name = "employee_code", unique = true)
    private String employeeCode;  // الرقم الوظيفي الداخلي

    // أضف هذه الحقول داخل الكلاس بعد تعريف organization
    @Column(name = "is_employer")
    private boolean isEmployer = false;

    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String email;
    
    private String phone;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    private String address;
    
    @Column(name = "national_id")
    private String nationalId;

    // في حالة كان مدير شركة (Employer)
    @OneToOne(mappedBy = "employerOwner", fetch = FetchType.LAZY)
    @JsonIgnore
    private Organization ownedOrganization;

    @ManyToOne
    @JoinColumn(name = "insurance_company_id")
    private InsuranceCompany insuranceCompany;


    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    
    @ManyToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;
    
    @Column(name = "policy_number")
    private String policyNumber;
    
    @Column(name = "coverage_start_date")
    private LocalDate coverageStartDate;
    
    @Column(name = "coverage_end_date")
    private LocalDate coverageEndDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "coverage_status")
    private CoverageStatus coverageStatus = CoverageStatus.ACTIVE;
    
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Claim> claims;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum Gender {
        MALE, FEMALE, OTHER
    }
    
    public enum CoverageStatus {
        ACTIVE, SUSPENDED, EXPIRED, CANCELLED
    }
}
