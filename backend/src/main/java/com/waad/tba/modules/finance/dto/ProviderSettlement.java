package com.waad.tba.modules.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderSettlement {
    
    private Long providerId;
    private String providerName;
    private LocalDate periodFrom;
    private LocalDate periodTo;
    
    private Long totalClaims = 0L;
    private BigDecimal totalApprovedAmount = BigDecimal.ZERO;
    private BigDecimal totalMemberCoPay = BigDecimal.ZERO;
    private BigDecimal netPayableToProvider = BigDecimal.ZERO;
    
    public BigDecimal getCompanyPortion() {
        return totalApprovedAmount.subtract(netPayableToProvider);
    }
}