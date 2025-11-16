package com.waad.tba.modules.employer.service;

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
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerRepository repository;
    private final EmployerMapper mapper;

    @Transactional(readOnly = true)
    public List<EmployerResponseDto> findAll() {
        log.debug("Finding all employers");
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployerResponseDto findById(Long id) {
        log.debug("Finding employer by id: {}", id);
        Employer entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employer", "id", id));
        return mapper.toResponseDto(entity);
    }

    @Transactional
    public EmployerResponseDto create(EmployerCreateDto dto) {
        log.info("Creating new employer: {}", dto.getName());

        Employer entity = mapper.toEntity(dto);
        Employer saved = repository.save(entity);
        
        log.info("Employer created successfully with id: {}", saved.getId());
        return mapper.toResponseDto(saved);
    }

    @Transactional
    public EmployerResponseDto update(Long id, EmployerCreateDto dto) {
        log.info("Updating employer with id: {}", id);
        
        Employer entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employer", "id", id));

        mapper.updateEntityFromDto(entity, dto);
        Employer updated = repository.save(entity);
        
        log.info("Employer updated successfully: {}", id);
        return mapper.toResponseDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting employer with id: {}", id);
        
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Employer", "id", id);
        }
        
        repository.deleteById(id);
        log.info("Employer deleted successfully: {}", id);
    }

    @Transactional(readOnly = true)
    public List<EmployerResponseDto> search(String query) {
        log.debug("Searching employers with query: {}", query);
        return repository.search(query).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<EmployerResponseDto> findAllPaginated(Pageable pageable) {
        log.debug("Finding employers with pagination");
        return repository.findAll(pageable)
                .map(mapper::toResponseDto);
    }
}
