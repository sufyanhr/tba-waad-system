package com.waad.tba.modules.providercontract.dto;

import java.time.LocalDate;

import com.waad.tba.modules.providercontract.entity.ProviderContractStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating a new provider-company contract
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderContractCreateDto {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Provider ID is required")
    private Long providerId;

    @NotBlank(message = "Contract code is required")
    private String contractCode;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Contract status is required")
    private ProviderContractStatus status;

    private String pricingModel;

    private String notes;
}
