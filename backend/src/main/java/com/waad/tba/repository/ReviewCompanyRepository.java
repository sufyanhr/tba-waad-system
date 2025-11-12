package com.waad.tba.repository;

import com.waad.tba.model.ReviewCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewCompanyRepository extends JpaRepository<ReviewCompany, Long> {
    Optional<ReviewCompany> findByEmail(String email);
    Optional<ReviewCompany> findByName(String name);
}
