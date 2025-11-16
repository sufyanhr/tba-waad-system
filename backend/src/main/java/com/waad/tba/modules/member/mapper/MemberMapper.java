package com.waad.tba.modules.member.mapper;

import com.waad.tba.modules.employer.entity.Employer;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import com.waad.tba.modules.insurance.entity.InsuranceCompany;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import com.waad.tba.modules.member.dto.MemberCreateDto;
import com.waad.tba.modules.member.dto.MemberResponseDto;
import com.waad.tba.modules.member.entity.Member;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MemberMapper {

    public MemberResponseDto toResponseDto(Member entity) {
        if (entity == null) return null;
        
        return MemberResponseDto.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .nationalId(entity.getNationalId())
                .memberNumber(entity.getMemberNumber())
                .dateOfBirth(entity.getDateOfBirth())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .address(entity.getAddress())
                .employerId(entity.getEmployer() != null ? entity.getEmployer().getId() : null)
                .employerName(entity.getEmployer() != null ? entity.getEmployer().getName() : null)
                .insuranceCompanyId(entity.getInsuranceCompany() != null ? entity.getInsuranceCompany().getId() : null)
                .insuranceCompanyName(entity.getInsuranceCompany() != null ? entity.getInsuranceCompany().getName() : null)
                .status(entity.getStatus())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Member toEntity(MemberCreateDto dto, Employer employer, InsuranceCompany insuranceCompany) {
        if (dto == null) return null;
        
        String memberNumber = dto.getMemberNumber();
        if (memberNumber == null || memberNumber.isBlank()) {
            memberNumber = generateMemberNumber();
        }
        
        return Member.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .nationalId(dto.getNationalId())
                .memberNumber(memberNumber)
                .dateOfBirth(dto.getDateOfBirth())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .employer(employer)
            .insuranceCompany(insuranceCompany)
            .status(dto.getStatus() != null ? dto.getStatus() : Member.MemberStatus.ACTIVE)
                .active(true)
                .build();
    }

    public void updateEntityFromDto(Member entity, MemberCreateDto dto, Employer employer, InsuranceCompany insuranceCompany) {
        if (dto == null) return;
        
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setNationalId(dto.getNationalId());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setAddress(dto.getAddress());
        entity.setEmployer(employer);
        entity.setInsuranceCompany(insuranceCompany);
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
    }

    private String generateMemberNumber() {
        return "MEM-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
