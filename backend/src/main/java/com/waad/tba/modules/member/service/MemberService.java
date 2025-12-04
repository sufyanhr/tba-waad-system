package com.waad.tba.modules.member.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.employer.entity.Employer;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import com.waad.tba.modules.insurance.entity.InsuranceCompany;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import com.waad.tba.modules.member.dto.FamilyMemberDto;
import com.waad.tba.modules.member.dto.MemberCreateDto;
import com.waad.tba.modules.member.dto.MemberUpdateDto;
import com.waad.tba.modules.member.dto.MemberViewDto;
import com.waad.tba.modules.member.entity.FamilyMember;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.member.mapper.MemberMapperV2;
import com.waad.tba.modules.member.repository.FamilyMemberRepository;
import com.waad.tba.modules.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final FamilyMemberRepository familyRepo;
    private final MemberMapperV2 mapper;

    private final EmployerRepository employerRepo;
    private final InsuranceCompanyRepository insuranceRepo;

    /* ============================================================
     * CREATE MEMBER + FAMILY
     * ============================================================ */
    @Transactional
    public MemberViewDto createMember(MemberCreateDto dto) {

        // Validate employer
        Employer employer = employerRepo.findById(dto.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with id: " + dto.getEmployerId()));

        // Validate insurance company (optional)
        InsuranceCompany insuranceCompany = null;
        if (dto.getInsuranceCompanyId() != null) {
            insuranceCompany = insuranceRepo.findById(dto.getInsuranceCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Insurance company not found"));
        }

        // Convert DTO → Entity
        Member member = mapper.toEntity(dto);
        member.setEmployer(employer);
        member.setInsuranceCompany(insuranceCompany);

        // Save member first
        Member savedMember = memberRepository.save(member);

        // Save family members
        List<FamilyMember> family = dto.getFamilyMembers() != null
                ? dto.getFamilyMembers().stream()
                        .map(mapper::toFamilyMemberEntity)
                        .peek(f -> f.setMember(savedMember))
                        .collect(Collectors.toList())
                : List.of();

        if (!family.isEmpty()) {
            familyRepo.saveAll(family);
        }

        return mapper.toViewDto(savedMember, family);
    }

    /* ============================================================
     * UPDATE MEMBER + SYNC FAMILY MEMBERS
     * ============================================================ */
    @Transactional
    public MemberViewDto updateMember(Long id, MemberUpdateDto dto) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found: " + id));

        // Update member fields from DTO
        mapper.updateEntityFromDto(member, dto);

        // Update insurance company relation if provided
        if (dto.getInsuranceCompanyId() != null) {
            InsuranceCompany insuranceCompany = insuranceRepo.findById(dto.getInsuranceCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Insurance company not found"));
            member.setInsuranceCompany(insuranceCompany);
        }

        memberRepository.save(member);

        /* ---------------------------------------------------------
         * SYNC FAMILY MEMBERS (add / update / delete)
         * --------------------------------------------------------- */

        List<FamilyMember> existing = familyRepo.findByMemberId(member.getId());

        List<Long> incomingIds = dto.getFamilyMembers() != null
                ? dto.getFamilyMembers().stream()
                        .map(FamilyMemberDto::getId)
                        .filter(f -> f != null)
                        .collect(Collectors.toList())
                : List.of();

        // Delete removed family members
        for (FamilyMember fm : existing) {
            if (!incomingIds.contains(fm.getId())) {
                familyRepo.delete(fm);
            }
        }

        // Add/update incoming
        if (dto.getFamilyMembers() != null) {
            for (FamilyMemberDto fmd : dto.getFamilyMembers()) {
                FamilyMember fm;

                if (fmd.getId() != null) {
                    fm = existing.stream()
                            .filter(e -> e.getId().equals(fmd.getId()))
                            .findFirst()
                            .orElseThrow(() -> new ResourceNotFoundException("Family member not found: " + fmd.getId()));
                } else {
                    fm = new FamilyMember();
                    fm.setMember(member);
                }

                // Update fields
                FamilyMember newEntity = mapper.toFamilyMemberEntity(fmd);
                newEntity.setId(fm.getId());
                newEntity.setMember(member);

                familyRepo.save(newEntity);
            }
        }

        List<FamilyMember> updatedFamily = familyRepo.findByMemberId(member.getId());

        return mapper.toViewDto(member, updatedFamily);
    }

    /* ============================================================
     * FIND ONE MEMBER
     * ============================================================ */
    @Transactional(readOnly = true)
    public MemberViewDto getMember(Long id) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found: " + id));

        List<FamilyMember> family = familyRepo.findByMemberId(member.getId());

        return mapper.toViewDto(member, family);
    }

    /* ============================================================
     * LIST MEMBERS WITH PAGINATION AND SEARCH
     * ============================================================ */
    @Transactional(readOnly = true)
    public Page<MemberViewDto> listMembers(Pageable pageable, String search) {
        Page<Member> memberPage;
        
        if (search != null && !search.isBlank()) {
            memberPage = memberRepository.searchPaged(search, pageable);
        } else {
            memberPage = memberRepository.findAll(pageable);
        }
        
        return memberPage.map(member -> {
            List<FamilyMember> family = familyRepo.findByMemberId(member.getId());
            return mapper.toViewDto(member, family);
        });
    }

    /* ============================================================
     * DELETE MEMBER (Soft Delete)
     * ============================================================ */
    @Transactional
    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        member.setActive(false);
        memberRepository.save(member);
    }
}
