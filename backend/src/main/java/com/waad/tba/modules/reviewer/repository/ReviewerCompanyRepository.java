package com.waad.tba.modules.reviewer.repository;

import com.waad.tba.modules.reviewer.entity.ReviewerCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewerCompanyRepository extends JpaRepository<ReviewerCompany, Long> {
    
    @Query("SELECT r FROM ReviewerCompany r WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.medicalDirector) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<ReviewerCompany> search(String query);
}
