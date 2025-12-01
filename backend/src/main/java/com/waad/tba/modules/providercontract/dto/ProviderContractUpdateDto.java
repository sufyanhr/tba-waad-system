package com.waad.tba.modules.providercontract.dto;

import java.time.LocalDate;

import com.waad.tba.modules.providercontract.entity.ProviderContractStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating an existing provider-company contract
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderContractUpdateDto {

    private String contractCode;

    private LocalDate startDate;

    private LocalDate endDate;

    private ProviderContractStatus status;

    private String pricingModel;

    private String notes;
}
