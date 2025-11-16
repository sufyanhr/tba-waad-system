package com.waad.tba.modules.claim.dto;

import com.waad.tba.modules.claim.entity.Claim;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponseDto {
    private Long id;
    private Long visitId;
    private String memberName;
    private String memberNumber;
    private String claimNumber;
    private LocalDate claimDate;
    private BigDecimal requestedAmount;
    private BigDecimal approvedAmount;
    private Claim.ClaimStatus status;
    private String rejectionReason;
    private String notes;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
