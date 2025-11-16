package com.waad.tba.modules.visit.repository;

import com.waad.tba.modules.visit.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    
    List<Visit> findByMemberId(Long memberId);
    
    @Query("SELECT v FROM Visit v WHERE " +
           "LOWER(v.doctorName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.specialty) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Visit> search(String query);
}
