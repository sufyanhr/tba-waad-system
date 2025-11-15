package com.waad.tba.modules.claims.model;

import com.waad.tba.modules.insurance.model.InsuranceCompany;
import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.providers.model.Provider;
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
@Table(name = "claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Claim {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "claim_number", unique = true, nullable = false)
    private String claimNumber;

    @ManyToOne
    @JoinColumn(name = "insurance_company_id")
    private InsuranceCompany insuranceCompany;


    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;
    
    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate;
    
    @Column(name = "submission_date", nullable = false)
    private LocalDate submissionDate;
    
    @Column(columnDefinition = "TEXT")
    private String diagnosis;
    
    @Column(name = "treatment_description", columnDefinition = "TEXT")
    private String treatmentDescription;
    
    @Column(name = "claimed_amount", nullable = false)
    private BigDecimal claimedAmount;
    
    @Column(name = "approved_amount")
    private BigDecimal approvedAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.SUBMITTED;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
    @Column(name = "document_urls", columnDefinition = "TEXT")
    private String documentUrls;
    
    @Column(name = "reviewed_by")
    private String reviewedBy;
    
    @Column(name = "review_date")
    private LocalDateTime reviewDate;
    
    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;
    
    @Column(name = "covered_amount", precision = 10, scale = 2)
    private BigDecimal coveredAmount;
    
    @Column(name = "member_contribution", precision = 10, scale = 2)
    private BigDecimal memberContribution;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @Column(name = "approved_by")
    private String approvedBy;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
    
    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimItem> claimItems;
    
    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimAttachment> attachments;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ClaimStatus {
        SUBMITTED,
        PENDING_REVIEW,
        UNDER_REVIEW,
        APPROVED,
        REJECTED,
        PENDING_DOCUMENTS,
        PAID
    }
    
    // Convenience method for dashboard
    public BigDecimal getAmount() {
        return claimedAmount;
    }
}