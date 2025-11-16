package com.waad.tba.modules.employer.mapper;

import com.waad.tba.modules.employer.dto.EmployerCreateDto;
import com.waad.tba.modules.employer.dto.EmployerResponseDto;
import com.waad.tba.modules.employer.entity.Employer;
import org.springframework.stereotype.Component;

@Component
public class EmployerMapper {

    public EmployerResponseDto toResponseDto(Employer entity) {
        if (entity == null) return null;
        
        return EmployerResponseDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .contactName(entity.getContactName())
                .contactPhone(entity.getContactPhone())
                .contactEmail(entity.getContactEmail())
                .address(entity.getAddress())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Employer toEntity(EmployerCreateDto dto) {
        if (dto == null) return null;
        
        return Employer.builder()
                .name(dto.getName())
                .contactName(dto.getContactName())
                .contactPhone(dto.getContactPhone())
                .contactEmail(dto.getContactEmail())
                .address(dto.getAddress())
                .active(true)
                .build();
    }

    public void updateEntityFromDto(Employer entity, EmployerCreateDto dto) {
        if (dto == null) return;
        
        entity.setName(dto.getName());
        entity.setContactName(dto.getContactName());
        entity.setContactPhone(dto.getContactPhone());
        entity.setContactEmail(dto.getContactEmail());
        entity.setAddress(dto.getAddress());
    }
}
