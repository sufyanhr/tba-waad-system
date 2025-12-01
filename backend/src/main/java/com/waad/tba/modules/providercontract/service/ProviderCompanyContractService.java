package com.waad.tba.modules.providercontract.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.common.exception.ValidationException;
import com.waad.tba.modules.company.entity.Company;
import com.waad.tba.modules.company.repository.CompanyRepository;
import com.waad.tba.modules.provider.entity.Provider;
import com.waad.tba.modules.provider.repository.ProviderRepository;
import com.waad.tba.modules.providercontract.dto.ProviderContractCreateDto;
import com.waad.tba.modules.providercontract.dto.ProviderContractResponseDto;
import com.waad.tba.modules.providercontract.dto.ProviderContractUpdateDto;
import com.waad.tba.modules.providercontract.entity.ProviderCompanyContract;
import com.waad.tba.modules.providercontract.entity.ProviderContractStatus;
import com.waad.tba.modules.providercontract.mapper.ProviderContractMapper;
import com.waad.tba.modules.providercontract.repository.ProviderCompanyContractRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing provider-company contracts
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProviderCompanyContractService {

    private final ProviderCompanyContractRepository contractRepository;
    private final CompanyRepository companyRepository;
    private final ProviderRepository providerRepository;
    private final ProviderContractMapper contractMapper;

    /**
     * Create a new provider-company contract
     */
    @Transactional
    public ProviderContractResponseDto createContract(ProviderContractCreateDto dto) {
        log.info("Creating contract between company {} and provider {}", dto.getCompanyId(), dto.getProviderId());

        // Validate company exists and is active
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + dto.getCompanyId()));
        
        if (!company.getActive()) {
            throw new ValidationException("Cannot create contract with inactive company: " + company.getName());
        }

        // Validate provider exists and is active
        Provider provider = providerRepository.findById(dto.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + dto.getProviderId()));
        
        if (!provider.getActive()) {
            throw new ValidationException("Cannot create contract with inactive provider: " + provider.getNameEn());
        }

        // Validate unique contract code
        if (contractRepository.existsByContractCode(dto.getContractCode())) {
            throw new ValidationException("Contract code already exists: " + dto.getContractCode());
        }

        // Validate no multiple ACTIVE contracts for same company-provider pair
        if (dto.getStatus() == ProviderContractStatus.ACTIVE) {
            boolean hasActiveContract = contractRepository.existsByCompanyIdAndProviderIdAndStatus(
                    dto.getCompanyId(), dto.getProviderId(), ProviderContractStatus.ACTIVE);
            
            if (hasActiveContract) {
                throw new ValidationException(
                    "An ACTIVE contract already exists between company " + company.getName() + 
                    " and provider " + provider.getNameEn());
            }
        }

        // Validate dates
        if (dto.getEndDate() != null && dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new ValidationException("End date must be after or equal to start date");
        }

        // Create contract
        ProviderCompanyContract contract = contractMapper.toEntity(dto, company, provider);
        ProviderCompanyContract saved = contractRepository.save(contract);

        log.info("Contract created successfully with ID: {}", saved.getId());
        return contractMapper.toResponseDto(saved);
    }

    /**
     * Update an existing contract
     */
    @Transactional
    public ProviderContractResponseDto updateContract(Long id, ProviderContractUpdateDto dto) {
        log.info("Updating contract with ID: {}", id);

        ProviderCompanyContract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + id));

        // Validate unique contract code if changed
        if (dto.getContractCode() != null && !dto.getContractCode().equals(contract.getContractCode())) {
            if (contractRepository.existsByContractCode(dto.getContractCode())) {
                throw new ValidationException("Contract code already exists: " + dto.getContractCode());
            }
        }

        // Validate no multiple ACTIVE contracts if status is being changed to ACTIVE
        if (dto.getStatus() == ProviderContractStatus.ACTIVE && 
            contract.getStatus() != ProviderContractStatus.ACTIVE) {
            
            boolean hasActiveContract = contractRepository.existsByCompanyIdAndProviderIdAndStatus(
                    contract.getCompany().getId(), 
                    contract.getProvider().getId(), 
                    ProviderContractStatus.ACTIVE);
            
            if (hasActiveContract) {
                throw new ValidationException(
                    "An ACTIVE contract already exists between this company and provider");
            }
        }

        // Validate dates if being updated
        LocalDate newStartDate = dto.getStartDate() != null ? dto.getStartDate() : contract.getStartDate();
        LocalDate newEndDate = dto.getEndDate() != null ? dto.getEndDate() : contract.getEndDate();
        
        if (newEndDate != null && newEndDate.isBefore(newStartDate)) {
            throw new ValidationException("End date must be after or equal to start date");
        }

        contractMapper.updateEntityFromDto(contract, dto);
        ProviderCompanyContract updated = contractRepository.save(contract);

        log.info("Contract updated successfully with ID: {}", updated.getId());
        return contractMapper.toResponseDto(updated);
    }

    /**
     * Get contract by ID
     */
    @Transactional(readOnly = true)
    public ProviderContractResponseDto getById(Long id) {
        log.debug("Fetching contract with ID: {}", id);

        ProviderCompanyContract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + id));

        return contractMapper.toResponseDto(contract);
    }

    /**
     * Get all contracts for a company
     */
    @Transactional(readOnly = true)
    public List<ProviderContractResponseDto> getByCompany(Long companyId) {
        log.debug("Fetching contracts for company ID: {}", companyId);

        // Validate company exists
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company not found with ID: " + companyId);
        }

        return contractRepository.findByCompanyId(companyId).stream()
                .map(contractMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all contracts for a provider
     */
    @Transactional(readOnly = true)
    public List<ProviderContractResponseDto> getByProvider(Long providerId) {
        log.debug("Fetching contracts for provider ID: {}", providerId);

        // Validate provider exists
        if (!providerRepository.existsById(providerId)) {
            throw new ResourceNotFoundException("Provider not found with ID: " + providerId);
        }

        return contractRepository.findByProviderId(providerId).stream()
                .map(contractMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get contract between specific company and provider
     */
    @Transactional(readOnly = true)
    public ProviderContractResponseDto getByCompanyAndProvider(Long companyId, Long providerId) {
        log.debug("Fetching contract for company {} and provider {}", companyId, providerId);

        ProviderCompanyContract contract = contractRepository
                .findByCompanyIdAndProviderId(companyId, providerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "No contract found between company " + companyId + " and provider " + providerId));

        return contractMapper.toResponseDto(contract);
    }

    /**
     * Get active contracts for a company
     */
    @Transactional(readOnly = true)
    public List<ProviderContractResponseDto> getActiveContractsByCompany(Long companyId) {
        log.debug("Fetching active contracts for company ID: {}", companyId);

        return contractRepository.findActiveContractsByCompany(companyId, LocalDate.now()).stream()
                .map(contractMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Activate a contract
     */
    @Transactional
    public ProviderContractResponseDto activate(Long id) {
        log.info("Activating contract with ID: {}", id);

        ProviderCompanyContract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + id));

        // Check if there's already an ACTIVE contract for this company-provider pair
        if (contract.getStatus() != ProviderContractStatus.ACTIVE) {
            boolean hasActiveContract = contractRepository.existsByCompanyIdAndProviderIdAndStatus(
                    contract.getCompany().getId(), 
                    contract.getProvider().getId(), 
                    ProviderContractStatus.ACTIVE);
            
            if (hasActiveContract) {
                throw new ValidationException(
                    "Cannot activate: An ACTIVE contract already exists between this company and provider");
            }
        }

        contract.setStatus(ProviderContractStatus.ACTIVE);
        ProviderCompanyContract updated = contractRepository.save(contract);

        log.info("Contract activated successfully with ID: {}", updated.getId());
        return contractMapper.toResponseDto(updated);
    }

    /**
     * Suspend a contract
     */
    @Transactional
    public ProviderContractResponseDto suspend(Long id) {
        log.info("Suspending contract with ID: {}", id);

        ProviderCompanyContract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + id));

        contract.setStatus(ProviderContractStatus.SUSPENDED);
        ProviderCompanyContract updated = contractRepository.save(contract);

        log.info("Contract suspended successfully with ID: {}", updated.getId());
        return contractMapper.toResponseDto(updated);
    }

    /**
     * Expire a contract
     */
    @Transactional
    public ProviderContractResponseDto expire(Long id) {
        log.info("Expiring contract with ID: {}", id);

        ProviderCompanyContract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + id));

        contract.setStatus(ProviderContractStatus.EXPIRED);
        ProviderCompanyContract updated = contractRepository.save(contract);

        log.info("Contract expired successfully with ID: {}", updated.getId());
        return contractMapper.toResponseDto(updated);
    }

    /**
     * Check if active contract exists between company and provider
     */
    @Transactional(readOnly = true)
    public boolean hasActiveContract(Long companyId, Long providerId) {
        return contractRepository.existsByCompanyIdAndProviderIdAndStatus(
                companyId, providerId, ProviderContractStatus.ACTIVE);
    }

    /**
     * Get all contracts
     */
    @Transactional(readOnly = true)
    public List<ProviderContractResponseDto> getAll() {
        log.debug("Fetching all contracts");

        return contractRepository.findAll().stream()
                .map(contractMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}
