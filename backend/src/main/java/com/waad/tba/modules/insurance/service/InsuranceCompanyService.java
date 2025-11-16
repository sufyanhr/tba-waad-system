package com.waad.tba.modules.insurance.service;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.modules.insurance.dto.InsuranceCompanyCreateDto;
import com.waad.tba.modules.insurance.dto.InsuranceCompanyResponseDto;
import com.waad.tba.modules.insurance.entity.InsuranceCompany;
import com.waad.tba.modules.insurance.mapper.InsuranceCompanyMapper;
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
public class InsuranceCompanyService {

    private final InsuranceCompanyRepository insuranceCompanyRepository;
    private final InsuranceCompanyMapper insuranceCompanyMapper;

    @Transactional
    public InsuranceCompanyResponseDto create(InsuranceCompanyCreateDto dto) {
        log.info("Creating new insurance company: {}", dto.getName());
        InsuranceCompany entity = insuranceCompanyMapper.toEntity(dto);
        InsuranceCompany saved = insuranceCompanyRepository.save(entity);
        return insuranceCompanyMapper.toResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public List<InsuranceCompanyResponseDto> getAll() {
        return insuranceCompanyRepository.findAll().stream()
                .map(insuranceCompanyMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<InsuranceCompanyResponseDto> getAllPaginated(Pageable pageable) {
        return insuranceCompanyRepository.findAll(pageable)
                .map(insuranceCompanyMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public InsuranceCompanyResponseDto getById(Long id) {
        InsuranceCompany entity = findEntityById(id);
        return insuranceCompanyMapper.toResponseDto(entity);
    }

    @Transactional
    public InsuranceCompanyResponseDto update(Long id, InsuranceCompanyCreateDto dto) {
        log.info("Updating insurance company with ID: {}", id);
        InsuranceCompany entity = findEntityById(id);
        insuranceCompanyMapper.updateEntityFromDto(dto, entity);
        InsuranceCompany updated = insuranceCompanyRepository.save(entity);
        return insuranceCompanyMapper.toResponseDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting insurance company with ID: {}", id);
        InsuranceCompany entity = findEntityById(id);
        insuranceCompanyRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public List<InsuranceCompanyResponseDto> search(String searchTerm) {
        return insuranceCompanyRepository.searchInsuranceCompanies(searchTerm).stream()
                .map(insuranceCompanyMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    private InsuranceCompany findEntityById(Long id) {
        return insuranceCompanyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Insurance Company not found with ID: " + id));
    }
}
