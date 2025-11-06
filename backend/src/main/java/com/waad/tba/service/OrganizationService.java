package com.waad.tba.service;

import com.waad.tba.exception.ResourceNotFoundException;
import com.waad.tba.model.Organization;
import com.waad.tba.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationService {
    
    private final OrganizationRepository organizationRepository;
    
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }
    
    public Organization getOrganizationById(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + id));
    }
    
    @Transactional
    public Organization createOrganization(Organization organization) {
        return organizationRepository.save(organization);
    }
    
    @Transactional
    public Organization updateOrganization(Long id, Organization organizationDetails) {
        Organization organization = getOrganizationById(id);
        
        organization.setName(organizationDetails.getName());
        organization.setRegistrationNumber(organizationDetails.getRegistrationNumber());
        organization.setIndustry(organizationDetails.getIndustry());
        organization.setAddress(organizationDetails.getAddress());
        organization.setPhone(organizationDetails.getPhone());
        organization.setEmail(organizationDetails.getEmail());
        organization.setContactPerson(organizationDetails.getContactPerson());
        organization.setActive(organizationDetails.getActive());
        
        return organizationRepository.save(organization);
    }
    
    @Transactional
    public void deleteOrganization(Long id) {
        Organization organization = getOrganizationById(id);
        organizationRepository.delete(organization);
    }
}
