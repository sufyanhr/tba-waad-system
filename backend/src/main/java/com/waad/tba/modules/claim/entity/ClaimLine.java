package com.waad.tba.modules.claim.entity;

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
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_lines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ClaimLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Parent Claim
    @NotNull(message = "Claim is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    // Service Information
    @NotBlank(message = "Service code is required")
    @Column(nullable = false, length = 50)
    private String serviceCode;

    @NotBlank(message = "Service description is required")
    @Column(nullable = false, length = 500)
    private String serviceDescription;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ServiceCategory serviceCategory;

    // Quantity and Pricing
    @NotNull(message = "Quantity is required")
    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @NotNull(message = "Unit price is required")
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalPrice = BigDecimal.ZERO;

    // Approved Amounts
    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal approvedQuantity = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal approvedUnitPrice = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal approvedAmount = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal rejectedAmount = BigDecimal.ZERO;

    // Status
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private LineStatus status = LineStatus.PENDING;

    // Review Notes
    @Column(length = 2000)
    private String notes;

    @Column(length = 500)
    private String rejectionReason;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum LineStatus {
        PENDING,
        APPROVED,
        PARTIALLY_APPROVED,
        REJECTED
    }

    public enum ServiceCategory {
        CONSULTATION,
        PROCEDURE,
        MEDICATION,
        LABORATORY,
        RADIOLOGY,
        SURGERY,
        ACCOMMODATION,
        OTHER
    }

    // Calculate total price based on quantity and unit price
    @PrePersist
    @PreUpdate
    private void calculateTotalPrice() {
        if (unitPrice != null && quantity != null) {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
