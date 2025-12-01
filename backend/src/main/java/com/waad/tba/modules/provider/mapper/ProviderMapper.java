package com.waad.tba.modules.provider.mapper;

import com.waad.tba.modules.provider.dto.ProviderCreateDto;
import com.waad.tba.modules.provider.dto.ProviderResponseDto;
import com.waad.tba.modules.provider.dto.ProviderUpdateDto;
import com.waad.tba.modules.provider.entity.Provider;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Provider entity and DTOs
 */
@Component
public class ProviderMapper {

    /**
     * Convert ProviderCreateDto to Provider entity
     */
    public Provider toEntity(ProviderCreateDto dto) {
        if (dto == null) {
            return null;
        }

        return Provider.builder()
                .code(dto.getCode())
                .nameAr(dto.getNameAr())
                .nameEn(dto.getNameEn())
                .type(dto.getType())
                .specialization(dto.getSpecialization())
                .licenseNumber(dto.getLicenseNumber())
                .licenseIssueDate(dto.getLicenseIssueDate())
                .licenseExpiryDate(dto.getLicenseExpiryDate())
                .region(dto.getRegion())
                .city(dto.getCity())
                .address(dto.getAddress())
                .landmark(dto.getLandmark())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .phone(dto.getPhone())
                .mobile(dto.getMobile())
                .fax(dto.getFax())
                .email(dto.getEmail())
                .website(dto.getWebsite())
                .contractType(dto.getContractType())
                .contractStartDate(dto.getContractStartDate())
                .contractEndDate(dto.getContractEndDate())
                .contractStatus(dto.getContractStatus())
                .discountPercentage(dto.getDiscountPercentage())
                .pricingNotes(dto.getPricingNotes())
                .bankName(dto.getBankName())
                .bankAccountNumber(dto.getBankAccountNumber())
                .iban(dto.getIban())
                .taxNumber(dto.getTaxNumber())
                .contactPersonName(dto.getContactPersonName())
                .contactPersonPhone(dto.getContactPersonPhone())
                .contactPersonEmail(dto.getContactPersonEmail())
                .servicesOffered(dto.getServicesOffered())
                .workingHours(dto.getWorkingHours())
                .hasEmergency(dto.getHasEmergency() != null ? dto.getHasEmergency() : false)
                .accreditation(dto.getAccreditation())
                .accreditationDate(dto.getAccreditationDate())
                .notes(dto.getNotes())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
    }

    /**
     * Convert Provider entity to ProviderResponseDto
     */
    public ProviderResponseDto toResponseDto(Provider entity) {
        if (entity == null) {
            return null;
        }

        return ProviderResponseDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .nameAr(entity.getNameAr())
                .nameEn(entity.getNameEn())
                .type(entity.getType())
                .specialization(entity.getSpecialization())
                .licenseNumber(entity.getLicenseNumber())
                .licenseIssueDate(entity.getLicenseIssueDate())
                .licenseExpiryDate(entity.getLicenseExpiryDate())
                .region(entity.getRegion())
                .city(entity.getCity())
                .address(entity.getAddress())
                .landmark(entity.getLandmark())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .phone(entity.getPhone())
                .mobile(entity.getMobile())
                .fax(entity.getFax())
                .email(entity.getEmail())
                .website(entity.getWebsite())
                .contractType(entity.getContractType())
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .contractStatus(entity.getContractStatus())
                .discountPercentage(entity.getDiscountPercentage())
                .pricingNotes(entity.getPricingNotes())
                .bankName(entity.getBankName())
                .bankAccountNumber(entity.getBankAccountNumber())
                .iban(entity.getIban())
                .taxNumber(entity.getTaxNumber())
                .contactPersonName(entity.getContactPersonName())
                .contactPersonPhone(entity.getContactPersonPhone())
                .contactPersonEmail(entity.getContactPersonEmail())
                .servicesOffered(entity.getServicesOffered())
                .workingHours(entity.getWorkingHours())
                .hasEmergency(entity.getHasEmergency())
                .accreditation(entity.getAccreditation())
                .accreditationDate(entity.getAccreditationDate())
                .notes(entity.getNotes())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    /**
     * Update existing Provider entity from ProviderUpdateDto
     * Only updates non-null fields
     */
    public void updateEntityFromDto(Provider entity, ProviderUpdateDto dto) {
        if (entity == null || dto == null) {
            return;
        }

        if (dto.getNameAr() != null) {
            entity.setNameAr(dto.getNameAr());
        }
        if (dto.getNameEn() != null) {
            entity.setNameEn(dto.getNameEn());
        }
        if (dto.getType() != null) {
            entity.setType(dto.getType());
        }
        if (dto.getSpecialization() != null) {
            entity.setSpecialization(dto.getSpecialization());
        }
        if (dto.getLicenseNumber() != null) {
            entity.setLicenseNumber(dto.getLicenseNumber());
        }
        if (dto.getLicenseIssueDate() != null) {
            entity.setLicenseIssueDate(dto.getLicenseIssueDate());
        }
        if (dto.getLicenseExpiryDate() != null) {
            entity.setLicenseExpiryDate(dto.getLicenseExpiryDate());
        }
        if (dto.getRegion() != null) {
            entity.setRegion(dto.getRegion());
        }
        if (dto.getCity() != null) {
            entity.setCity(dto.getCity());
        }
        if (dto.getAddress() != null) {
            entity.setAddress(dto.getAddress());
        }
        if (dto.getLandmark() != null) {
            entity.setLandmark(dto.getLandmark());
        }
        if (dto.getLatitude() != null) {
            entity.setLatitude(dto.getLatitude());
        }
        if (dto.getLongitude() != null) {
            entity.setLongitude(dto.getLongitude());
        }
        if (dto.getPhone() != null) {
            entity.setPhone(dto.getPhone());
        }
        if (dto.getMobile() != null) {
            entity.setMobile(dto.getMobile());
        }
        if (dto.getFax() != null) {
            entity.setFax(dto.getFax());
        }
        if (dto.getEmail() != null) {
            entity.setEmail(dto.getEmail());
        }
        if (dto.getWebsite() != null) {
            entity.setWebsite(dto.getWebsite());
        }
        if (dto.getContractType() != null) {
            entity.setContractType(dto.getContractType());
        }
        if (dto.getContractStartDate() != null) {
            entity.setContractStartDate(dto.getContractStartDate());
        }
        if (dto.getContractEndDate() != null) {
            entity.setContractEndDate(dto.getContractEndDate());
        }
        if (dto.getContractStatus() != null) {
            entity.setContractStatus(dto.getContractStatus());
        }
        if (dto.getDiscountPercentage() != null) {
            entity.setDiscountPercentage(dto.getDiscountPercentage());
        }
        if (dto.getPricingNotes() != null) {
            entity.setPricingNotes(dto.getPricingNotes());
        }
        if (dto.getBankName() != null) {
            entity.setBankName(dto.getBankName());
        }
        if (dto.getBankAccountNumber() != null) {
            entity.setBankAccountNumber(dto.getBankAccountNumber());
        }
        if (dto.getIban() != null) {
            entity.setIban(dto.getIban());
        }
        if (dto.getTaxNumber() != null) {
            entity.setTaxNumber(dto.getTaxNumber());
        }
        if (dto.getContactPersonName() != null) {
            entity.setContactPersonName(dto.getContactPersonName());
        }
        if (dto.getContactPersonPhone() != null) {
            entity.setContactPersonPhone(dto.getContactPersonPhone());
        }
        if (dto.getContactPersonEmail() != null) {
            entity.setContactPersonEmail(dto.getContactPersonEmail());
        }
        if (dto.getServicesOffered() != null) {
            entity.setServicesOffered(dto.getServicesOffered());
        }
        if (dto.getWorkingHours() != null) {
            entity.setWorkingHours(dto.getWorkingHours());
        }
        if (dto.getHasEmergency() != null) {
            entity.setHasEmergency(dto.getHasEmergency());
        }
        if (dto.getAccreditation() != null) {
            entity.setAccreditation(dto.getAccreditation());
        }
        if (dto.getAccreditationDate() != null) {
            entity.setAccreditationDate(dto.getAccreditationDate());
        }
        if (dto.getNotes() != null) {
            entity.setNotes(dto.getNotes());
        }
        if (dto.getActive() != null) {
            entity.setActive(dto.getActive());
        }
    }
}
