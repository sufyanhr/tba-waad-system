package com.waad.tba.modules.visit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.member.entity.Member;
import com.waad.tba.modules.member.repository.MemberRepository;
import com.waad.tba.modules.providercontract.service.ProviderCompanyContractService;
import com.waad.tba.modules.visit.dto.VisitCreateDto;
import com.waad.tba.modules.visit.dto.VisitResponseDto;
import com.waad.tba.modules.visit.entity.Visit;
import com.waad.tba.modules.visit.mapper.VisitMapper;
import com.waad.tba.modules.visit.repository.VisitRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class VisitService {

    private final VisitRepository repository;
    private final MemberRepository memberRepository;
    private final VisitMapper mapper;
    private final ProviderCompanyContractService providerContractService;

    @Transactional(readOnly = true)
    public List<VisitResponseDto> findAll() {
        log.debug("Finding all visits");
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VisitResponseDto findById(Long id) {
        log.debug("Finding visit by id: {}", id);
        Visit entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visit", "id", id));
        return mapper.toResponseDto(entity);
    }

    @Transactional
    public VisitResponseDto create(VisitCreateDto dto) {
        log.info("Creating new visit for member id: {}", dto.getMemberId());

        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", dto.getMemberId()));

        // Validate provider contract if providerId is provided
        if (dto.getProviderId() != null) {
            Long companyId = member.getEmployer().getCompany().getId();
            providerContractService.validateActiveContract(companyId, dto.getProviderId());
        }

        Visit entity = mapper.toEntity(dto, member);
        Visit saved = repository.save(entity);
        
        log.info("Visit created successfully with id: {}", saved.getId());
        return mapper.toResponseDto(saved);
    }

    @Transactional
    public VisitResponseDto update(Long id, VisitCreateDto dto) {
        log.info("Updating visit with id: {}", id);
        
        Visit entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visit", "id", id));

        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", dto.getMemberId()));

        // Validate provider contract if providerId is provided
        if (dto.getProviderId() != null) {
            Long companyId = member.getEmployer().getCompany().getId();
            providerContractService.validateActiveContract(companyId, dto.getProviderId());
        }

        mapper.updateEntityFromDto(entity, dto, member);
        Visit updated = repository.save(entity);
        
        log.info("Visit updated successfully: {}", id);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting visit with id: {}", id);
        
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Visit", "id", id);
        }
        
        repository.deleteById(id);
        log.info("Visit deleted successfully: {}", id);
    }

    @Transactional(readOnly = true)
    public List<VisitResponseDto> search(String query) {
        log.debug("Searching visits with query: {}", query);
        return repository.search(query).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<VisitResponseDto> findAllPaginated(Pageable pageable, String search) {
        log.debug("Finding visits with pagination. search={}", search);
        if (search == null || search.isBlank()) {
            return repository.findAll(pageable).map(mapper::toResponseDto);
        } else {
            return repository.searchPaged(search, pageable).map(mapper::toResponseDto);
        }
    }

    @Transactional(readOnly = true)
    public long count() {
        return repository.count();
    }
}
