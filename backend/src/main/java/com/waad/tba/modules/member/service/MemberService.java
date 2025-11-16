package com.waad.tba.modules.member.service;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.member.dto.MemberCreateDto;
import com.waad.tba.modules.member.dto.MemberResponseDto;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.member.mapper.MemberMapper;
import com.waad.tba.modules.member.repository.MemberRepository;
import com.waad.tba.modules.employer.entity.Employer;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import com.waad.tba.modules.insurance.entity.InsuranceCompany;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository repository;
    private final EmployerRepository employerRepository;
    private final InsuranceCompanyRepository insuranceCompanyRepository;
    private final MemberMapper mapper;

    @Transactional(readOnly = true)
    public List<MemberResponseDto> findAll() {
        log.debug("Finding all members");
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MemberResponseDto findById(Long id) {
        log.debug("Finding member by id: {}", id);
        Member entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));
        return mapper.toResponseDto(entity);
    }

    @Transactional
    public MemberResponseDto create(MemberCreateDto dto) {
        log.info("Creating new member: {} {}", dto.getFirstName(), dto.getLastName());

        Employer employer = employerRepository.findById(dto.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer", "id", dto.getEmployerId()));
        
        InsuranceCompany insuranceCompany = insuranceCompanyRepository.findById(dto.getInsuranceCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("InsuranceCompany", "id", dto.getInsuranceCompanyId()));

        Member entity = mapper.toEntity(dto, employer, insuranceCompany);
        Member saved = repository.save(entity);
        
        log.info("Member created successfully with id: {} and member number: {}", saved.getId(), saved.getMemberNumber());
        return mapper.toResponseDto(saved);
    }

    @Transactional
    public MemberResponseDto update(Long id, MemberCreateDto dto) {
        log.info("Updating member with id: {}", id);
        
        Member entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        Employer employer = employerRepository.findById(dto.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer", "id", dto.getEmployerId()));
        
        InsuranceCompany insuranceCompany = insuranceCompanyRepository.findById(dto.getInsuranceCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("InsuranceCompany", "id", dto.getInsuranceCompanyId()));

        mapper.updateEntityFromDto(entity, dto, employer, insuranceCompany);
        Member updated = repository.save(entity);
        
        log.info("Member updated successfully: {}", id);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting member with id: {}", id);
        
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Member", "id", id);
        }
        
        repository.deleteById(id);
        log.info("Member deleted successfully: {}", id);
    }

    @Transactional(readOnly = true)
    public List<MemberResponseDto> search(String query) {
        log.debug("Searching members with query: {}", query);
        return repository.search(query).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<MemberResponseDto> findAllPaginated(Pageable pageable) {
        log.debug("Finding members with pagination");
        return repository.findAll(pageable)
                .map(mapper::toResponseDto);
    }
}
