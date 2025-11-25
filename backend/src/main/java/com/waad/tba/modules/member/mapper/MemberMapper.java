package com.waad.tba.modules.member.mapper;

import com.waad.tba.modules.member.dto.MemberCreateDto;
import com.waad.tba.modules.member.dto.MemberResponseDto;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MemberMapper {

    private final EmployerRepository employerRepository;

    public MemberResponseDto toResponseDto(Member entity) {
        if (entity == null) return null;
        
        String employerName = null;
        if (entity.getEmployerId() != null) {
            employerName = employerRepository.findById(entity.getEmployerId())
                    .map(emp -> emp.getName())
                    .orElse(null);
        }
        
        return MemberResponseDto.builder()
                .id(entity.getId())
                .employerId(entity.getEmployerId())
                .employerName(employerName)
                .companyId(entity.getCompanyId())
                .fullName(entity.getFullName())
                .civilId(entity.getCivilId())
                .policyNumber(entity.getPolicyNumber())
                .dateOfBirth(entity.getDateOfBirth())
                .gender(entity.getGender())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Member toEntity(MemberCreateDto dto) {
        if (dto == null) return null;
        
        return Member.builder()
                .employerId(dto.getEmployerId())
                .companyId(dto.getCompanyId())
                .fullName(dto.getFullName())
                .civilId(dto.getCivilId())
                .policyNumber(dto.getPolicyNumber())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
    }

    public void updateEntityFromDto(Member entity, MemberCreateDto dto) {
        if (dto == null) return;
        
        entity.setEmployerId(dto.getEmployerId());
        entity.setCompanyId(dto.getCompanyId());
        entity.setFullName(dto.getFullName());
        entity.setCivilId(dto.getCivilId());
        entity.setPolicyNumber(dto.getPolicyNumber());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setGender(dto.getGender());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        if (dto.getActive() != null) {
            entity.setActive(dto.getActive());
        }
    }
}
