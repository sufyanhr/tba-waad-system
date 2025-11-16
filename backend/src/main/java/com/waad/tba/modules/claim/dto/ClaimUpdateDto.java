package com.waad.tba.modules.claim.dto;

import com.waad.tba.modules.claim.entity.Claim;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimUpdateDto {
    
    private BigDecimal approvedAmount;
    
    private Claim.ClaimStatus status;
    
    private String rejectionReason;
    
    private String notes;
}
