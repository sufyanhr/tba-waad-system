package com.waad.tba.repository;

import com.waad.tba.model.BenefitTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BenefitTableRepository extends JpaRepository<BenefitTable, Long> {
    List<BenefitTable> findByPolicyId(Long policyId);
    List<BenefitTable> findByServiceType(String serviceType);
}
