package com.waad.tba.modules.insurance.service;

import com.waad.tba.core.exception.ResourceNotFoundException;
import com.waad.tba.modules.insurance.model.InsuranceCompany;
import com.waad.tba.modules.insurance.repository.InsuranceCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InsuranceCompanyService {
    
    private final InsuranceCompanyRepository insuranceCompanyRepository;
    
    public List<InsuranceCompany> getAllInsuranceCompanies() {
        return insuranceCompanyRepository.findAll();
    }
    
    public InsuranceCompany getInsuranceCompanyById(Long id) {
        return insuranceCompanyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Insurance Company not found with id: " + id));
    }
    
    public InsuranceCompany getInsuranceCompanyByEmail(String email) {
        return insuranceCompanyRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Insurance Company not found with email: " + email));
    }
    
    @Transactional
    public InsuranceCompany createInsuranceCompany(InsuranceCompany insuranceCompany) {
        return insuranceCompanyRepository.save(insuranceCompany);
    }
    
    @Transactional
    public InsuranceCompany updateInsuranceCompany(Long id, InsuranceCompany insuranceCompanyDetails) {
        InsuranceCompany insuranceCompany = getInsuranceCompanyById(id);
        
        insuranceCompany.setName(insuranceCompanyDetails.getName());
        insuranceCompany.setContactInfo(insuranceCompanyDetails.getContactInfo());
        insuranceCompany.setEmail(insuranceCompanyDetails.getEmail());
        insuranceCompany.setPhone(insuranceCompanyDetails.getPhone());
        insuranceCompany.setAddress(insuranceCompanyDetails.getAddress());
        
        return insuranceCompanyRepository.save(insuranceCompany);
    }
    
    @Transactional
    public void deleteInsuranceCompany(Long id) {
        InsuranceCompany insuranceCompany = getInsuranceCompanyById(id);
        insuranceCompanyRepository.delete(insuranceCompany);
    }
}
