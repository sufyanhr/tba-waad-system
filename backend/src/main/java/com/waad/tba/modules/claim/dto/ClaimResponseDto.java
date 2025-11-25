package com.waad.tba.modules.claim.dto;

import com.waad.tba.modules.claim.entity.Claim;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponseDto {
    private Long id;
    private String claimNumber;
    
    // Member info
    private Long memberId;
    private String memberName;
    private String memberCardNumber;
    
    // Provider info
    private Long providerId;
    private String providerName;
    
    // Claim details
    private String claimType;
    private LocalDate serviceDate;
    private LocalDate submissionDate;
    
    // Financial
    private BigDecimal totalClaimed;
    private BigDecimal totalApproved;
    private BigDecimal totalRejected;
    private BigDecimal memberCoPayment;
    private BigDecimal netPayable;
    
    // Medical info
    private String diagnosisCode;
    private String diagnosisDescription;
    private String preAuthNumber;
    
    // Status and review
    private Claim.ClaimStatus status;
    private String medicalReviewStatus;
    private String financialReviewStatus;
    private String rejectionReason;
    private String notes;
    
    // Audit
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
