package com.waad.tba.modules.insurance.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.waad.tba.modules.employers.model.Organization;
import com.waad.tba.modules.members.model.BenefitTable;
import com.waad.tba.modules.members.model.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "policies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Policy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "policy_code", unique = true, nullable = false)
    private String policyCode;
    
    @Column(name = "policy_number", unique = true, nullable = false)
    private String policyNumber;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "annual_limit", precision = 15, scale = 2, nullable = false)
    private BigDecimal annualLimit;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "coverage_type", nullable = false)
    private CoverageType coverageType;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "insurance_company_id", nullable = false)
    private InsuranceCompany insuranceCompany;
    
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;
    
    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PolicyBenefitLimit> benefitLimits;
    
    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<BenefitTable> benefitTables;
    
    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Member> members;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum CoverageType {
        INDIVIDUAL("فردي"),
        FAMILY("عائلي"),
        COMPANY("مؤسسي");
        
        private final String arabicName;
        
        CoverageType(String arabicName) {
            this.arabicName = arabicName;
        }
        
        public String getArabicName() {
            return arabicName;
        }
    }
    
    // Helper methods
    public boolean isActive() {
        return isActive && 
               LocalDate.now().isBefore(endDate.plusDays(1)) && 
               LocalDate.now().isAfter(startDate.minusDays(1));
    }
    
    public boolean isExpiring(int daysAhead) {
        return isActive() && 
               endDate.minusDays(daysAhead).isBefore(LocalDate.now());
    }
}
