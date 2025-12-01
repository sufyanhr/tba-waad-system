package com.waad.tba.modules.provider.service;

import com.waad.tba.common.exception.ResourceNotFoundException;
import com.waad.tba.common.exception.ValidationException;
import com.waad.tba.modules.provider.dto.ProviderCreateDto;
import com.waad.tba.modules.provider.dto.ProviderResponseDto;
import com.waad.tba.modules.provider.dto.ProviderUpdateDto;
import com.waad.tba.modules.provider.entity.Provider;
import com.waad.tba.modules.provider.entity.Provider.ProviderType;
import com.waad.tba.modules.provider.mapper.ProviderMapper;
import com.waad.tba.modules.provider.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing healthcare providers
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final ProviderMapper providerMapper;

    /**
     * Create a new provider
     */
    @Transactional
    public ProviderResponseDto create(ProviderCreateDto dto) {
        log.info("Creating provider with code: {}", dto.getCode());

        // Validate unique code
        if (providerRepository.existsByCode(dto.getCode())) {
            throw new ValidationException("Provider code already exists: " + dto.getCode());
        }

        // Validate unique license number
        if (providerRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
            throw new ValidationException("License number already exists: " + dto.getLicenseNumber());
        }

        Provider provider = providerMapper.toEntity(dto);
        Provider saved = providerRepository.save(provider);

        log.info("Provider created successfully with ID: {}", saved.getId());
        return providerMapper.toResponseDto(saved);
    }

    /**
     * Update an existing provider
     */
    @Transactional
    public ProviderResponseDto update(Long id, ProviderUpdateDto dto) {
        log.info("Updating provider with ID: {}", id);

        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        // Validate unique license number if changed
        if (dto.getLicenseNumber() != null && !dto.getLicenseNumber().equals(provider.getLicenseNumber())) {
            if (providerRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
                throw new ValidationException("License number already exists: " + dto.getLicenseNumber());
            }
        }

        providerMapper.updateEntityFromDto(provider, dto);
        Provider updated = providerRepository.save(provider);

        log.info("Provider updated successfully with ID: {}", updated.getId());
        return providerMapper.toResponseDto(updated);
    }

    /**
     * Get provider by ID
     */
    @Transactional(readOnly = true)
    public ProviderResponseDto getById(Long id) {
        log.debug("Fetching provider with ID: {}", id);

        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        return providerMapper.toResponseDto(provider);
    }

    /**
     * Get provider by code
     */
    @Transactional(readOnly = true)
    public ProviderResponseDto getByCode(String code) {
        log.debug("Fetching provider with code: {}", code);

        Provider provider = providerRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with code: " + code));

        return providerMapper.toResponseDto(provider);
    }

    /**
     * Get all providers
     */
    @Transactional(readOnly = true)
    public List<ProviderResponseDto> getAll() {
        log.debug("Fetching all providers");

        return providerRepository.findAll().stream()
                .map(providerMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get providers by type
     */
    @Transactional(readOnly = true)
    public List<ProviderResponseDto> getByType(ProviderType type) {
        log.debug("Fetching providers by type: {}", type);

        return providerRepository.findByType(type).stream()
                .map(providerMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get providers by region
     */
    @Transactional(readOnly = true)
    public List<ProviderResponseDto> getByRegion(String region) {
        log.debug("Fetching providers by region: {}", region);

        return providerRepository.findByRegion(region).stream()
                .map(providerMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get providers by city
     */
    @Transactional(readOnly = true)
    public List<ProviderResponseDto> getByCity(String city) {
        log.debug("Fetching providers by city: {}", city);

        return providerRepository.findByCity(city).stream()
                .map(providerMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Search providers by name or code
     */
    @Transactional(readOnly = true)
    public List<ProviderResponseDto> search(String searchTerm) {
        log.debug("Searching providers with term: {}", searchTerm);

        return providerRepository.searchProviders(searchTerm).stream()
                .map(providerMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active providers only
     */
    @Transactional(readOnly = true)
    public List<ProviderResponseDto> getActiveProviders() {
        log.debug("Fetching active providers");

        return providerRepository.findAll().stream()
                .filter(Provider::getActive)
                .map(providerMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active providers by type
     */
    @Transactional(readOnly = true)
    public List<ProviderResponseDto> getActiveProvidersByType(ProviderType type) {
        log.debug("Fetching active providers by type: {}", type);

        return providerRepository.findActiveProvidersByType(type).stream()
                .map(providerMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Activate a provider
     */
    @Transactional
    public ProviderResponseDto activate(Long id) {
        log.info("Activating provider with ID: {}", id);

        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        provider.setActive(true);
        Provider updated = providerRepository.save(provider);

        log.info("Provider activated successfully with ID: {}", updated.getId());
        return providerMapper.toResponseDto(updated);
    }

    /**
     * Deactivate a provider
     */
    @Transactional
    public ProviderResponseDto deactivate(Long id) {
        log.info("Deactivating provider with ID: {}", id);

        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        provider.setActive(false);
        Provider updated = providerRepository.save(provider);

        log.info("Provider deactivated successfully with ID: {}", updated.getId());
        return providerMapper.toResponseDto(updated);
    }

    /**
     * Delete a provider (soft delete by deactivating)
     */
    @Transactional
    public void delete(Long id) {
        log.info("Deleting (deactivating) provider with ID: {}", id);

        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        provider.setActive(false);
        providerRepository.save(provider);

        log.info("Provider deleted (deactivated) successfully with ID: {}", id);
    }
}
