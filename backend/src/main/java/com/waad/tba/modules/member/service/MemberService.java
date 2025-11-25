package com.waad.tba.modules.member.service;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.member.dto.MemberCreateDto;
import com.waad.tba.modules.member.dto.MemberResponseDto;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.member.mapper.MemberMapper;
import com.waad.tba.modules.member.repository.MemberRepository;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository repository;
    private final EmployerRepository employerRepository;
    private final MemberMapper mapper;

    @Transactional(readOnly = true)
    public MemberResponseDto findById(Long id) {
        log.debug("Finding member by id: {}", id);
        Member entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));
        return mapper.toResponseDto(entity);
    }

    @Transactional
    public MemberResponseDto create(MemberCreateDto dto) {
        log.info("Creating new member: {}", dto.getFullName());

        // Validate employer exists
        if (!employerRepository.existsById(dto.getEmployerId())) {
            throw new ResourceNotFoundException("Employer", "id", dto.getEmployerId());
        }
        
        // Validate unique civilId
        if (repository.existsByCivilId(dto.getCivilId())) {
            throw new IllegalArgumentException("Civil ID already exists: " + dto.getCivilId());
        }
        
        // Validate unique cardNumber (policyNumber)
        if (repository.existsByCardNumber(dto.getPolicyNumber())) {
            throw new IllegalArgumentException("Card number already exists: " + dto.getPolicyNumber());
        }

        Member entity = mapper.toEntity(dto);
        Member saved = repository.save(entity);
        
        log.info("Member created successfully with id: {}", saved.getId());
        return mapper.toResponseDto(saved);
    }

    @Transactional
    public MemberResponseDto update(Long id, MemberCreateDto dto) {
        log.info("Updating member with id: {}", id);
        
        Member entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        // Validate employer exists
        if (!employerRepository.existsById(dto.getEmployerId())) {
            throw new ResourceNotFoundException("Employer", "id", dto.getEmployerId());
        }
        
        // Validate unique civilId (excluding current member)
        if (repository.existsByCivilIdAndIdNot(dto.getCivilId(), id)) {
            throw new IllegalArgumentException("Civil ID already exists: " + dto.getCivilId());
        }
        
        // Validate unique cardNumber (excluding current member)
        if (repository.existsByCardNumberAndIdNot(dto.getPolicyNumber(), id)) {
            throw new IllegalArgumentException("Card number already exists: " + dto.getPolicyNumber());
        }

        mapper.updateEntityFromDto(entity, dto);
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
    public Page<MemberResponseDto> findAllPaginated(Long companyId, String search, Pageable pageable) {
        log.debug("Finding members with pagination. companyId={}, search={}", companyId, search);
        
        Page<Member> page;
        
        if (companyId != null) {
            if (search != null && !search.isBlank()) {
                page = repository.searchPagedByCompany(companyId, search, pageable);
            } else {
                page = repository.findByCompanyId(companyId, pageable);
            }
        } else {
            if (search != null && !search.isBlank()) {
                page = repository.searchPaged(search, pageable);
            } else {
                page = repository.findAll(pageable);
            }
        }
        
        return page.map(mapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public long count() {
        return repository.count();
    }
}
