package com.waad.tba.modules.claim.dto;

import com.waad.tba.modules.claim.entity.Claim;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimCreateDto {
    
    @NotNull(message = "Member ID is required")
    private Long memberId;
    
    @NotNull(message = "Provider ID is required")
    private Long providerId;
    
    private String providerName;
    
    private String claimNumber;
    
    @NotNull(message = "Claim type is required")
    private String claimType;
    
    @NotNull(message = "Service date is required")
    private LocalDate serviceDate;
    
    private LocalDate submissionDate;
    
    @NotNull(message = "Total claimed amount is required")
    private BigDecimal totalClaimed;
    
    private BigDecimal totalApproved;
    
    private Claim.ClaimStatus status;
    
    private String diagnosisCode;
    
    private String diagnosisDescription;
    
    private String preAuthNumber;
    
    private String rejectionReason;
    
    private String notes;
}
