package com.waad.tba.modules.preapproval.entity;

import com.waad.tba.modules.insurance.entity.InsuranceCompany;
import com.waad.tba.modules.insurancepolicy.entity.InsurancePolicy;
import com.waad.tba.modules.insurancepolicy.entity.PolicyBenefitPackage;
import com.waad.tba.modules.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Pre-Approval entity representing medical pre-approval requests
 */
@Entity
@Table(name = "pre_approvals")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_company_id", nullable = false)
    private InsuranceCompany insuranceCompany;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_policy_id")
    private InsurancePolicy insurancePolicy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "benefit_package_id")
    private PolicyBenefitPackage benefitPackage;

    @Column(name = "provider_name", length = 255)
    private String providerName;

    @Column(name = "doctor_name", length = 255)
    private String doctorName;

    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "procedure", columnDefinition = "TEXT")
    private String procedure;

    @Column(name = "requested_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal requestedAmount;

    @Column(name = "approved_amount", precision = 15, scale = 2)
    private BigDecimal approvedAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    @Builder.Default
    private PreApprovalStatus status = PreApprovalStatus.PENDING;

    @Column(name = "reviewer_comment", columnDefinition = "TEXT")
    private String reviewerComment;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "attachments_count")
    @Builder.Default
    private Integer attachmentsCount = 0;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(name = "created_by", length = 100)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    /**
     * Validate business rules before persist/update
     */
    @PrePersist
    @PreUpdate
    public void validateBusinessRules() {
        // Ensure requested amount is positive
        if (requestedAmount != null && requestedAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Requested amount must be greater than zero");
        }

        // Ensure approved amount is non-negative
        if (approvedAmount != null && approvedAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Approved amount cannot be negative");
        }

        // Only APPROVED status can have approved amount > 0
        if (status == PreApprovalStatus.APPROVED && 
            (approvedAmount == null || approvedAmount.compareTo(BigDecimal.ZERO) == 0)) {
            throw new IllegalArgumentException("Approved status must have approved amount greater than zero");
        }

        // Set reviewedAt when status changes from PENDING
        if (status != PreApprovalStatus.PENDING && reviewedAt == null) {
            reviewedAt = LocalDateTime.now();
        }

        // Ensure attachments count is non-negative
        if (attachmentsCount != null && attachmentsCount < 0) {
            attachmentsCount = 0;
        }
    }
}
