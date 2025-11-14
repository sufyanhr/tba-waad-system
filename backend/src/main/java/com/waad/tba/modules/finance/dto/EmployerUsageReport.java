package com.waad.tba.modules.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerUsageReport {
    
    private Long employerId;
    private String employerName;
    
    private Long totalClaims = 0L;
    private Long approvedClaimsCount = 0L;
    private Long refusedClaimsCount = 0L;
    
    private BigDecimal totalApprovedAmount = BigDecimal.ZERO;
    private BigDecimal totalRefusedAmount = BigDecimal.ZERO;
    
    private Double approvalRate = 0.0;
    private Double refusalRate = 0.0;
    
    public BigDecimal getTotalClaimsAmount() {
        return totalApprovedAmount.add(totalRefusedAmount);
    }
    
    public Long getPendingClaimsCount() {
        return totalClaims - approvedClaimsCount - refusedClaimsCount;
    }
}