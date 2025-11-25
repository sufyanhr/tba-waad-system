package com.waad.tba.modules.visit.repository;

import com.waad.tba.modules.visit.entity.Visit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    
    List<Visit> findByMemberId(Long memberId);
    
    @Query("SELECT v FROM Visit v LEFT JOIN v.member m WHERE " +
           "LOWER(v.doctorName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.specialty) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.diagnosis) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.lastName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Visit> search(@Param("query") String query);

    @Query("SELECT v FROM Visit v LEFT JOIN v.member m WHERE " +
           "LOWER(v.doctorName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(v.specialty) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(v.diagnosis) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(m.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(m.lastName) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Visit> searchPaged(@Param("q") String q, Pageable pageable);
}
