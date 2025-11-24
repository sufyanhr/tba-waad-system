package com.waad.tba.modules.employer.service;

import com.waad.tba.common.dto.PaginationResponse;
import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.employer.dto.EmployerCreateDto;
import com.waad.tba.modules.employer.dto.EmployerResponseDto;
import com.waad.tba.modules.employer.entity.Employer;
import com.waad.tba.modules.employer.mapper.EmployerMapper;
import com.waad.tba.modules.employer.repository.EmployerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerRepository repository;
    private final EmployerMapper mapper;

    @Transactional(readOnly = true)
    public List<EmployerResponseDto> findAll() {
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmployerResponseDto findById(Long id) {
        Employer entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employer", "id", id));
        return mapper.toResponseDto(entity);
    }

    @Transactional
    public EmployerResponseDto create(EmployerCreateDto dto) {
        // Validate unique code
        if (repository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Employer code already exists: " + dto.getCode());
        }
        
        Employer entity = mapper.toEntity(dto);
        Employer saved = repository.save(entity);
        log.info("Created employer: {} with code: {}", saved.getName(), saved.getCode());
        return mapper.toResponseDto(saved);
    }

    @Transactional
    public EmployerResponseDto update(Long id, EmployerCreateDto dto) {
        Employer entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employer", "id", id));

        // Validate unique code (exclude current employer)
        if (repository.existsByCodeAndIdNot(dto.getCode(), id)) {
            throw new IllegalArgumentException("Employer code already exists: " + dto.getCode());
        }

        mapper.updateEntityFromDto(entity, dto);
        Employer updated = repository.save(entity);
        log.info("Updated employer: {} with code: {}", updated.getName(), updated.getCode());
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Employer", "id", id);
        }
        repository.deleteById(id);
        log.info("Deleted employer with id: {}", id);
    }

    @Transactional(readOnly = true)
    public List<EmployerResponseDto> search(String query) {
        return repository.search(query).stream()
                .map(mapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PaginationResponse<EmployerResponseDto> findAllPaginated(Pageable pageable, String search, Long companyId) {
        Page<Employer> page;

        if (companyId != null) {
            // Filter by companyId
            if (search != null && !search.isEmpty()) {
                String q = search.toLowerCase();
                page = repository.searchPagedByCompany(companyId, q, pageable);
            } else {
                page = repository.findByCompanyId(companyId, pageable);
            }
        } else {
            // No company filter (SUPER_ADMIN)
            if (search != null && !search.isEmpty()) {
                String q = search.toLowerCase();
                page = repository.searchPaged(q, pageable);
            } else {
                page = repository.findAll(pageable);
            }
        }

        List<EmployerResponseDto> items = page.getContent()
                .stream()
                .map(mapper::toResponseDto)
                .toList();

        return new PaginationResponse<>(
                items,
                page.getTotalElements(),
                page.getNumber() + 1,
                page.getSize()
        );
    }

    public long count() {
        return repository.count();
    }
}
