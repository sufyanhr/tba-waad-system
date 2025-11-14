package com.waad.tba.modules.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberUsageReport {
    
    private Long memberId;
    private String memberName;
    private String memberNumber;
    private int year;
    
    private BigDecimal totalUsedAmount = BigDecimal.ZERO;
    private BigDecimal totalRemainingAmount = BigDecimal.ZERO;
    
    private List<BenefitUsageDetail> benefitUsages = new ArrayList<>();
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BenefitUsageDetail {
        private String benefitName;
        private String benefitCategory;
        private BigDecimal usedAmount = BigDecimal.ZERO;
        private Integer usedTimes = 0;
        private BigDecimal remainingAmount = BigDecimal.ZERO;
        private Integer remainingTimes = 0;
        private LocalDateTime lastUsageDate;
        
        public Double getUtilizationPercentage() {
            BigDecimal total = usedAmount.add(remainingAmount);
            if (total.compareTo(BigDecimal.ZERO) == 0) {
                return 0.0;
            }
            return usedAmount.multiply(new BigDecimal("100"))
                .divide(total, 2, BigDecimal.ROUND_HALF_UP)
                .doubleValue();
        }
    }
}