package com.waad.tba.modules.providercontract.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.waad.tba.modules.providercontract.entity.ProviderContractStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for provider-company contract response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderContractResponseDto {

    private Long id;

    private Long companyId;
    private String companyName;
    private String companyCode;

    private Long providerId;
    private String providerName;
    private String providerCode;

    private String contractCode;

    private LocalDate startDate;

    private LocalDate endDate;

    private ProviderContractStatus status;

    private String pricingModel;

    private String notes;

    private Boolean isActive;

    private Boolean isExpiredByDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
