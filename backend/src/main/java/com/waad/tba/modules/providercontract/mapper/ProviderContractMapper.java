package com.waad.tba.modules.providercontract.mapper;

import org.springframework.stereotype.Component;

import com.waad.tba.modules.company.entity.Company;
import com.waad.tba.modules.provider.entity.Provider;
import com.waad.tba.modules.providercontract.dto.ProviderContractCreateDto;
import com.waad.tba.modules.providercontract.dto.ProviderContractResponseDto;
import com.waad.tba.modules.providercontract.dto.ProviderContractUpdateDto;
import com.waad.tba.modules.providercontract.entity.ProviderCompanyContract;

/**
 * Mapper for converting between ProviderCompanyContract entity and DTOs
 */
@Component
public class ProviderContractMapper {

    /**
     * Convert ProviderContractCreateDto to ProviderCompanyContract entity
     * Note: company and provider must be set separately by the service
     */
    public ProviderCompanyContract toEntity(ProviderContractCreateDto dto, Company company, Provider provider) {
        if (dto == null) {
            return null;
        }

        return ProviderCompanyContract.builder()
                .company(company)
                .provider(provider)
                .contractCode(dto.getContractCode())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus())
                .pricingModel(dto.getPricingModel())
                .notes(dto.getNotes())
                .build();
    }

    /**
     * Convert ProviderCompanyContract entity to ProviderContractResponseDto
     */
    public ProviderContractResponseDto toResponseDto(ProviderCompanyContract entity) {
        if (entity == null) {
            return null;
        }

        return ProviderContractResponseDto.builder()
                .id(entity.getId())
                .companyId(entity.getCompany().getId())
                .companyName(entity.getCompany().getName())
                .companyCode(entity.getCompany().getCode())
                .providerId(entity.getProvider().getId())
                .providerName(entity.getProvider().getNameEn())
                .providerCode(entity.getProvider().getCode())
                .contractCode(entity.getContractCode())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .status(entity.getStatus())
                .pricingModel(entity.getPricingModel())
                .notes(entity.getNotes())
                .isActive(entity.isActive())
                .isExpiredByDate(entity.isExpiredByDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    /**
     * Update existing ProviderCompanyContract entity from ProviderContractUpdateDto
     * Only updates non-null fields
     */
    public void updateEntityFromDto(ProviderCompanyContract entity, ProviderContractUpdateDto dto) {
        if (entity == null || dto == null) {
            return;
        }

        if (dto.getContractCode() != null) {
            entity.setContractCode(dto.getContractCode());
        }
        if (dto.getStartDate() != null) {
            entity.setStartDate(dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            entity.setEndDate(dto.getEndDate());
        }
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
        if (dto.getPricingModel() != null) {
            entity.setPricingModel(dto.getPricingModel());
        }
        if (dto.getNotes() != null) {
            entity.setNotes(dto.getNotes());
        }
    }
}
