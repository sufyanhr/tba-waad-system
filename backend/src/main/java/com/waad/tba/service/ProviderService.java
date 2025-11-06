package com.waad.tba.service;

import com.waad.tba.exception.ResourceNotFoundException;
import com.waad.tba.model.Provider;
import com.waad.tba.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderService {
    
    private final ProviderRepository providerRepository;
    
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }
    
    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
    }
    
    @Transactional
    public Provider createProvider(Provider provider) {
        return providerRepository.save(provider);
    }
    
    @Transactional
    public Provider updateProvider(Long id, Provider providerDetails) {
        Provider provider = getProviderById(id);
        
        provider.setName(providerDetails.getName());
        provider.setLicenseNumber(providerDetails.getLicenseNumber());
        provider.setType(providerDetails.getType());
        provider.setSpecialties(providerDetails.getSpecialties());
        provider.setAddress(providerDetails.getAddress());
        provider.setPhone(providerDetails.getPhone());
        provider.setEmail(providerDetails.getEmail());
        provider.setContactPerson(providerDetails.getContactPerson());
        provider.setStatus(providerDetails.getStatus());
        provider.setActive(providerDetails.getActive());
        
        return providerRepository.save(provider);
    }
    
    @Transactional
    public void deleteProvider(Long id) {
        Provider provider = getProviderById(id);
        providerRepository.delete(provider);
    }
}
