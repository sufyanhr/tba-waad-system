package com.waad.tba.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicyDTO {
    private Long id;
    private String policyNumber;
    private String coverageType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalLimit;
    private Long insuranceCompanyId;
    private String insuranceCompanyName;
    private Long organizationId;
    private String organizationName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
