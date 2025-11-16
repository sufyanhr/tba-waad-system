package com.waad.tba.modules.insurance.mapper;

import com.waad.tba.modules.insurance.dto.InsuranceCompanyCreateDto;
import com.waad.tba.modules.insurance.dto.InsuranceCompanyResponseDto;
import com.waad.tba.modules.insurance.entity.InsuranceCompany;
import org.springframework.stereotype.Component;

@Component
public class InsuranceCompanyMapper {

    public InsuranceCompanyResponseDto toResponseDto(InsuranceCompany entity) {
        if (entity == null) return null;
        
        return InsuranceCompanyResponseDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .address(entity.getAddress())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .contactPerson(entity.getContactPerson())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public InsuranceCompany toEntity(InsuranceCompanyCreateDto dto) {
        if (dto == null) return null;
        
        return InsuranceCompany.builder()
                .name(dto.getName())
                .code(dto.getCode())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .contactPerson(dto.getContactPerson())
                .active(true)
                .build();
    }

    public void updateEntityFromDto(InsuranceCompanyCreateDto dto, InsuranceCompany entity) {
        if (dto == null) return;
        
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setAddress(dto.getAddress());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setContactPerson(dto.getContactPerson());
    }
}
