package com.waad.tba.modules.employers.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerDashboard {
    
    // معلومات أساسية
    private Long employerId;
    private String employerName;
    private String policyName;
    
    // إحصائيات الأعضاء
    private Long totalMembers;
    private Long activeMembers;
    
    // إحصائيات المطالبات
    private Long totalClaims;
    private Long approvedClaims;
    private Long rejectedClaims;
    private Long pendingClaims;
    
    // الإحصائيات المالية
    private BigDecimal totalClaimsAmount = BigDecimal.ZERO;
    private BigDecimal totalApprovedAmount = BigDecimal.ZERO;
    private BigDecimal policyLimit = BigDecimal.ZERO;
    private BigDecimal remainingLimit = BigDecimal.ZERO;
    
    // Helper methods
    public BigDecimal getUtilizationPercentage() {
        if (policyLimit == null || policyLimit.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return totalApprovedAmount.multiply(new BigDecimal("100")).divide(policyLimit, 2, BigDecimal.ROUND_HALF_UP);
    }
    
    public Double getApprovalRate() {
        if (totalClaims == 0) {
            return 0.0;
        }
        return (approvedClaims.doubleValue() / totalClaims.doubleValue()) * 100;
    }
    
    public Double getRejectionRate() {
        if (totalClaims == 0) {
            return 0.0;
        }
        return (rejectedClaims.doubleValue() / totalClaims.doubleValue()) * 100;
    }
    
    public boolean isNearPolicyLimit() {
        if (policyLimit == null || policyLimit.compareTo(BigDecimal.ZERO) == 0) {
            return false;
        }
        return getUtilizationPercentage().compareTo(new BigDecimal("85")) >= 0;
    }
}