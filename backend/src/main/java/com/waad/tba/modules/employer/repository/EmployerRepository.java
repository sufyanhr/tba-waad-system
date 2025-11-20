package com.waad.tba.modules.employer.repository;

import com.waad.tba.modules.employer.entity.Employer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Long> {

    // OLD search (deprecated)
    @Query("""
           SELECT e FROM Employer e
           WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(e.contactName) LIKE LOWER(CONCAT('%', :query, '%'))
           """)
    java.util.List<Employer> search(String query);

    // ✅ NEW paginated search
    @Query("""
           SELECT e FROM Employer e
           WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(e.contactName) LIKE LOWER(CONCAT('%', :q, '%'))
           """)
    Page<Employer> searchPaged(String q, Pageable pageable);
}
