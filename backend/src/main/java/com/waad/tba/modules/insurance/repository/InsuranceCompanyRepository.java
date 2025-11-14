package com.waad.tba.modules.insurance.repository;

import com.waad.tba.modules.insurance.model.InsuranceCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InsuranceCompanyRepository extends JpaRepository<InsuranceCompany, Long> {
    Optional<InsuranceCompany> findByEmail(String email);
    Optional<InsuranceCompany> findByName(String name);
}
