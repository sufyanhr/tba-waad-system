package com.waad.tba.modules.members.service;

import com.waad.tba.core.exception.ResourceNotFoundException;
import com.waad.tba.modules.members.model.BenefitTable;
import com.waad.tba.modules.members.repository.BenefitTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("memberBenefitTableService")
@RequiredArgsConstructor
public class MemberBenefitTableService {
    
    private final BenefitTableRepository benefitTableRepository;
    
    public List<BenefitTable> getAllBenefitTables() {
        return benefitTableRepository.findAll();
    }
    
    public BenefitTable getBenefitTableById(Long id) {
        return benefitTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Benefit Table not found with id: " + id));
    }
    
    public List<BenefitTable> getBenefitTablesByPolicy(Long policyId) {
        return benefitTableRepository.findByPolicyId(policyId);
    }
    
    public List<BenefitTable> getBenefitTablesByServiceType(String serviceType) {
        return benefitTableRepository.findByServiceType(serviceType);
    }
    
    @Transactional
    public BenefitTable createBenefitTable(BenefitTable benefitTable) {
        return benefitTableRepository.save(benefitTable);
    }
    
    @Transactional
    public BenefitTable updateBenefitTable(Long id, BenefitTable benefitTableDetails) {
        BenefitTable benefitTable = getBenefitTableById(id);
        
        benefitTable.setServiceType(benefitTableDetails.getServiceType());
        benefitTable.setCoveragePercent(benefitTableDetails.getCoveragePercent());
        benefitTable.setMaxLimit(benefitTableDetails.getMaxLimit());
        benefitTable.setNotes(benefitTableDetails.getNotes());
        benefitTable.setPolicy(benefitTableDetails.getPolicy());
        
        return benefitTableRepository.save(benefitTable);
    }
    
    @Transactional
    public void deleteBenefitTable(Long id) {
        BenefitTable benefitTable = getBenefitTableById(id);
        benefitTableRepository.delete(benefitTable);
    }
}
