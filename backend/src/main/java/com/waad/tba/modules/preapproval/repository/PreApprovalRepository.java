package com.waad.tba.modules.preapproval.repository;

import com.waad.tba.modules.preapproval.entity.PreApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for PreApproval entity
 */
@Repository
public interface PreApprovalRepository extends JpaRepository<PreApproval, Long> {

    /**
     * Search pre-approvals with pagination
     * Searches by provider name, diagnosis, or member name
     */
    @Query("""
            SELECT p FROM PreApproval p
            LEFT JOIN FETCH p.member m
            LEFT JOIN FETCH p.insuranceCompany ic
            LEFT JOIN FETCH p.insurancePolicy ip
            LEFT JOIN FETCH p.benefitPackage bp
            WHERE (:keyword IS NULL OR :keyword = '' OR
                   LOWER(p.providerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                   LOWER(p.diagnosis) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                   LOWER(m.fullNameArabic) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                   LOWER(m.civilId) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<PreApproval> searchPaged(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Find all pre-approvals by member ID
     */
    @Query("""
            SELECT p FROM PreApproval p
            LEFT JOIN FETCH p.insuranceCompany
            LEFT JOIN FETCH p.insurancePolicy
            LEFT JOIN FETCH p.benefitPackage
            WHERE p.member.id = :memberId
            ORDER BY p.createdAt DESC
            """)
    List<PreApproval> findByMemberId(@Param("memberId") Long memberId);

    /**
     * Count total pre-approvals
     */
    @Query("SELECT COUNT(p) FROM PreApproval p WHERE p.active = true")
    Long countActive();
}
