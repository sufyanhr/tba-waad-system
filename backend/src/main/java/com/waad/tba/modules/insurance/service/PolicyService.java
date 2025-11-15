package com.waad.tba.modules.insurance.service;

import com.waad.tba.modules.insurance.model.Policy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PolicyService {

    public List<Policy> getAllPolicies() {
        // TODO: Implement business logic in Phase A4
        return null;
    }

    public Policy getPolicy(Long id) {
        // TODO: Implement business logic in Phase A4
        return null;
    }

    public Policy createPolicy(Policy policy) {
        // TODO: Implement business logic in Phase A4
        return null;
    }

    public Policy updatePolicy(Long id, Policy policy) {
        // TODO: Implement business logic in Phase A4
        return null;
    }

    public void deletePolicy(Long id) {
        // TODO: Implement business logic in Phase A4
    }

    public Policy getPolicyById(Long id) {
        // TODO: Implement business logic in Phase A4
        return null;
    }

    public Policy getPolicyByPolicyNumber(String policyNumber) {
        // TODO: Implement business logic in Phase A4
        return null;
    }

    public List<Policy> getPoliciesByInsuranceCompany(Long insuranceCompanyId) {
        // TODO: Implement business logic in Phase A4
        return null;
    }

    public List<Policy> getPoliciesByOrganization(Long organizationId) {
        // TODO: Implement business logic in Phase A4
        return null;
    }
}