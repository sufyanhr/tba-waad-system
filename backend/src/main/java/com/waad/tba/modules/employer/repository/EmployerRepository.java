package com.waad.tba.modules.employer.repository;

import com.waad.tba.modules.employer.entity.Employer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Long> {

    // Check if code exists
    boolean existsByCode(String code);
    
    // Check if code exists for other employers (exclude current one during update)
    boolean existsByCodeAndIdNot(String code, Long id);
    
    // Find by companyId
    Page<Employer> findByCompanyId(Long companyId, Pageable pageable);

    // OLD search (deprecated)
    @Query("""
           SELECT e FROM Employer e
           WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(e.contactName) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(e.code) LIKE LOWER(CONCAT('%', :query, '%'))
           """)
    java.util.List<Employer> search(String query);

    // ✅ NEW paginated search
    @Query("""
           SELECT e FROM Employer e
           WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(e.contactName) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(e.code) LIKE LOWER(CONCAT('%', :q, '%'))
           """)
    Page<Employer> searchPaged(@Param("q") String q, Pageable pageable);
    
    // ✅ NEW paginated search with companyId filter
    @Query("""
           SELECT e FROM Employer e
           WHERE e.companyId = :companyId
           AND (LOWER(e.name) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(e.contactName) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(e.code) LIKE LOWER(CONCAT('%', :q, '%')))
           """)
    Page<Employer> searchPagedByCompany(@Param("companyId") Long companyId, @Param("q") String q, Pageable pageable);
    
    // ✅ Find active employers for selector (multi-employer filter)
    @Query("SELECT e FROM Employer e WHERE e.active = true ORDER BY e.name ASC")
    java.util.List<Employer> findActiveEmployersForSelector();
}
