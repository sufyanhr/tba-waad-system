package com.waad.tba.modules.member.mapper;

import com.waad.tba.modules.member.dto.MemberCreateDto;
import com.waad.tba.modules.member.dto.MemberResponseDto;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.employer.entity.Employer;
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
        Long employerId = null;
        if (entity.getEmployer() != null) {
            employerId = entity.getEmployer().getId();
            employerName = entity.getEmployer().getName();
        }
        
        return MemberResponseDto.builder()
                .id(entity.getId())
                .employerId(employerId)
                .employerName(employerName)
                .companyId(entity.getCompanyId())
                .fullName(entity.getFullName())
                .civilId(entity.getCivilId())
                .policyNumber(entity.getCardNumber())
                .dateOfBirth(entity.getDateOfBirth())
                .gender(entity.getGender() != null ? entity.getGender().name() : null)
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Member toEntity(MemberCreateDto dto) {
        if (dto == null) return null;
        
        Employer employer = employerRepository.findById(dto.getEmployerId())
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        
        return Member.builder()
                .employer(employer)
                .companyId(dto.getCompanyId())
                .firstName(dto.getFullName().split(" ")[0])
                .lastName(dto.getFullName().contains(" ") ? dto.getFullName().substring(dto.getFullName().indexOf(" ") + 1) : "")
                .civilId(dto.getCivilId())
                .cardNumber(dto.getPolicyNumber())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender() != null ? Member.Gender.valueOf(dto.getGender()) : null)
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .relation(Member.MemberRelation.SELF)
                .status(Member.MemberStatus.ACTIVE)
                .startDate(java.time.LocalDate.now())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
    }

    public void updateEntityFromDto(Member entity, MemberCreateDto dto) {
        if (dto == null) return;
        
        Employer employer = employerRepository.findById(dto.getEmployerId())
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        
        entity.setEmployer(employer);
        entity.setCompanyId(dto.getCompanyId());
        entity.setFirstName(dto.getFullName().split(" ")[0]);
        entity.setLastName(dto.getFullName().contains(" ") ? dto.getFullName().substring(dto.getFullName().indexOf(" ") + 1) : "");
        entity.setCivilId(dto.getCivilId());
        entity.setCardNumber(dto.getPolicyNumber());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setGender(dto.getGender() != null ? Member.Gender.valueOf(dto.getGender()) : null);
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        if (dto.getActive() != null) {
            entity.setActive(dto.getActive());
        }
    }
}
