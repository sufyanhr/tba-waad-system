package com.waad.tba.modules.claim.repository;

import com.waad.tba.modules.claim.entity.Claim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Optional<Claim> findByClaimNumber(String claimNumber);
    Boolean existsByClaimNumber(String claimNumber);
    List<Claim> findByStatus(Claim.ClaimStatus status);
    Long countByStatus(Claim.ClaimStatus status);
    
    @Query("SELECT c FROM Claim c WHERE " +
           "LOWER(c.claimNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.notes) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Claim> search(String query);

    @Query("SELECT c FROM Claim c WHERE " +
           "LOWER(c.claimNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.notes) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Claim> searchPaged(@Param("q") String q, Pageable pageable);

    @Query("SELECT c.claimDate, COUNT(c) FROM Claim c " +
           "WHERE c.claimDate BETWEEN :startDate AND :endDate " +
           "GROUP BY c.claimDate ORDER BY c.claimDate")
    List<Object[]> countClaimsPerDay(LocalDate startDate, LocalDate endDate);
}
