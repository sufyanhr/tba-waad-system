package com.waad.tba.service;

import com.waad.tba.exception.ResourceNotFoundException;
import com.waad.tba.model.Policy;
import com.waad.tba.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PolicyService {
    
    private final PolicyRepository policyRepository;
    
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }
    
    public Policy getPolicyById(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id: " + id));
    }
    
    public Policy getPolicyByPolicyNumber(String policyNumber) {
        return policyRepository.findByPolicyNumber(policyNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with policy number: " + policyNumber));
    }
    
    public List<Policy> getPoliciesByInsuranceCompany(Long insuranceCompanyId) {
        return policyRepository.findByInsuranceCompanyId(insuranceCompanyId);
    }
    
    public List<Policy> getPoliciesByOrganization(Long organizationId) {
        return policyRepository.findByOrganizationId(organizationId);
    }
    
    @Transactional
    public Policy createPolicy(Policy policy) {
        return policyRepository.save(policy);
    }
    
    @Transactional
    public Policy updatePolicy(Long id, Policy policyDetails) {
        Policy policy = getPolicyById(id);
        
        policy.setPolicyNumber(policyDetails.getPolicyNumber());
        policy.setCoverageType(policyDetails.getCoverageType());
        policy.setStartDate(policyDetails.getStartDate());
        policy.setEndDate(policyDetails.getEndDate());
        policy.setTotalLimit(policyDetails.getTotalLimit());
        policy.setInsuranceCompany(policyDetails.getInsuranceCompany());
        policy.setOrganization(policyDetails.getOrganization());
        
        return policyRepository.save(policy);
    }
    
    @Transactional
    public void deletePolicy(Long id) {
        Policy policy = getPolicyById(id);
        policyRepository.delete(policy);
    }
}
