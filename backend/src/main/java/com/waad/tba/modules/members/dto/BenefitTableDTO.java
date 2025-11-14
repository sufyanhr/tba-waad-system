package com.waad.tba.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BenefitTableDTO {
    private Long id;
    private String serviceType;
    private BigDecimal coveragePercent;
    private BigDecimal maxLimit;
    private String notes;
    private Long policyId;
    private String policyNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
