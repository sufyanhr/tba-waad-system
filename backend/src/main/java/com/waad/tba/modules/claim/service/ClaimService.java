package com.waad.tba.modules.claim.service;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.claim.dto.ClaimCreateDto;
import com.waad.tba.modules.claim.dto.ClaimUpdateDto;
import com.waad.tba.modules.claim.dto.ClaimResponseDto;
import com.waad.tba.modules.claim.entity.Claim;

import com.waad.tba.modules.claim.mapper.ClaimMapper;
import com.waad.tba.modules.claim.repository.ClaimRepository;
import com.waad.tba.modules.visit.entity.Visit;
import com.waad.tba.modules.visit.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository repository;
    private final VisitRepository visitRepository;
    private final ClaimMapper mapper;

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> findAll() {
        log.debug("Finding all claims");
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClaimResponseDto findById(Long id) {
        log.debug("Finding claim by id: {}", id);
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
        return mapper.toResponseDto(entity);
    }

    @Transactional
    public ClaimResponseDto create(ClaimCreateDto dto) {
        log.info("Creating new claim for visit id: {}", dto.getVisitId());

        Visit visit = visitRepository.findById(dto.getVisitId())
                .orElseThrow(() -> new ResourceNotFoundException("Visit", "id", dto.getVisitId()));

        Claim entity = mapper.toEntity(dto, visit);
        Claim saved = repository.save(entity);
        
        log.info("Claim created successfully with id: {} and claim number: {}", saved.getId(), saved.getClaimNumber());
        return mapper.toResponseDto(saved);
    }

    @Transactional
    public ClaimResponseDto update(Long id, ClaimCreateDto dto) {
        log.info("Updating claim with id: {}", id);
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        Visit visit = visitRepository.findById(dto.getVisitId())
                .orElseThrow(() -> new ResourceNotFoundException("Visit", "id", dto.getVisitId()));

        mapper.updateEntityFromDto(entity, dto, visit);
        Claim updated = repository.save(entity);
        
        log.info("Claim updated successfully: {}", id);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting claim with id: {}", id);
        
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Claim", "id", id);
        }
        
        repository.deleteById(id);
        log.info("Claim deleted successfully: {}", id);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> search(String query) {
        log.debug("Searching claims with query: {}", query);
        return repository.search(query).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ClaimResponseDto> findAllPaginated(Pageable pageable, String search) {
        log.debug("Finding claims with pagination. search={}", search);
        if (search == null || search.isBlank()) {
            return repository.findAll(pageable).map(mapper::toResponseDto);
        } else {
            return repository.searchPaged(search, pageable).map(mapper::toResponseDto);
        }
    }

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> getByStatus(Claim.ClaimStatus status) {
        log.debug("Finding claims by status: {}", status);
        return repository.findByStatus(status).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long count() {
        return repository.count();
    }

    @Transactional
    public ClaimResponseDto approveClaim(Long id, BigDecimal approvedAmount) {
        log.info("Approving claim with id: {}", id);
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        if (entity.getStatus() != Claim.ClaimStatus.PENDING) {
            throw new IllegalStateException("Only pending claims can be approved");
        }

        entity.setStatus(Claim.ClaimStatus.APPROVED);
        entity.setApprovedAmount(approvedAmount);
        entity.setRejectionReason(null);
        
        Claim updated = repository.save(entity);
        
        log.info("Claim approved successfully: {}", id);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public ClaimResponseDto rejectClaim(Long id, String rejectionReason) {
        log.info("Rejecting claim with id: {}", id);
        
        Claim entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        if (entity.getStatus() != Claim.ClaimStatus.PENDING) {
            throw new IllegalStateException("Only pending claims can be rejected");
        }

        entity.setStatus(Claim.ClaimStatus.REJECTED);
        entity.setRejectionReason(rejectionReason);
        entity.setApprovedAmount(BigDecimal.ZERO);
        
        Claim updated = repository.save(entity);
        
        log.info("Claim rejected successfully: {}", id);
        return mapper.toResponseDto(updated);
    }
}
