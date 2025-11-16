package com.waad.tba.modules.claim.dto;

import com.waad.tba.modules.claim.entity.Claim;
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
    
    @NotNull(message = "Visit ID is required")
    private Long visitId;
    
    private String claimNumber;
    
    @NotNull(message = "Claim date is required")
    private LocalDate claimDate;
    
    @NotNull(message = "Requested amount is required")
    private BigDecimal requestedAmount;
    
    private BigDecimal approvedAmount;
    
    private Claim.ClaimStatus status;
    
    private String rejectionReason;
    
    private String notes;
}
