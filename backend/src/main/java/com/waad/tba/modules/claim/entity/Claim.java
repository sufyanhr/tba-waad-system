package com.waad.tba.modules.claim.entity;

import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.rbac.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "claims", uniqueConstraints = {
    @UniqueConstraint(columnNames = "claimNumber", name = "uk_claim_number")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Claim number is required")
    @Column(unique = true, nullable = false, length = 100)
    private String claimNumber;

    // Member and Provider Information
    @NotNull(message = "Member is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @NotNull(message = "Provider ID is required")
    @Column(nullable = false)
    private Long providerId;

    @Column(length = 200)
    private String providerName;

    // Claim Type and Dates
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Claim type is required")
    @Column(nullable = false, length = 20)
    private ClaimType claimType;

    @NotNull(message = "Service date is required")
    @Column(nullable = false)
    private LocalDate serviceDate;

    @Column(nullable = false)
    private LocalDate submissionDate;

    // Financial Information
    @Column(precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalClaimed = BigDecimal.ZERO;
    
    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalApproved = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalRejected = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal memberCoPayment = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal netPayable = BigDecimal.ZERO;

    // Status
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private ClaimStatus status = ClaimStatus.PENDING;

    // Medical Review
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medical_reviewer_id")
    private User medicalReviewer;

    private LocalDateTime medicalReviewedAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ReviewStatus medicalReviewStatus;

    @Column(length = 2000)
    private String medicalReviewNotes;

    // Financial Review
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "financial_reviewer_id")
    private User financialReviewer;

    private LocalDateTime financialReviewedAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ReviewStatus financialReviewStatus;

    @Column(length = 2000)
    private String financialReviewNotes;

    // Additional Information
    @Column(length = 50)
    private String preAuthNumber;

    @Column(length = 20)
    private String diagnosisCode;

    @Column(length = 500)
    private String diagnosisDescription;

    private String rejectionReason;
    
    @Column(length = 3000)
    private String notes;

    @Column(length = 2000)
    private String attachments;

    // Claim Lines (services)
    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ClaimLine> claimLines = new ArrayList<>();

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ClaimStatus {
        PENDING,
        UNDER_MEDICAL_REVIEW,
        UNDER_FINANCIAL_REVIEW,
        APPROVED,
        PARTIALLY_APPROVED,
        REJECTED,
        RESUBMITTED
    }

    public enum ClaimType {
        OUTPATIENT,
        INPATIENT,
        PHARMACY,
        LABORATORY,
        RADIOLOGY,
        DENTAL,
        OPTICAL,
        MATERNITY,
        EMERGENCY,
        CHRONIC_DISEASE,
        OTHER
    }

    public enum ReviewStatus {
        PENDING,
        APPROVED,
        REJECTED,
        MORE_INFO_REQUIRED
    }

    // Helper methods for managing claim lines
    public void addClaimLine(ClaimLine claimLine) {
        claimLines.add(claimLine);
        claimLine.setClaim(this);
    }

    public void removeClaimLine(ClaimLine claimLine) {
        claimLines.remove(claimLine);
        claimLine.setClaim(null);
    }
}
