package com.waad.tba.modules.insurance.repository;

import com.waad.tba.modules.insurance.model.PolicyBenefitLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyBenefitLimitRepository extends JpaRepository<PolicyBenefitLimit, Long> {
}