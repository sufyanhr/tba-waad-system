package com.waad.tba.modules.claim.repository;

import com.waad.tba.modules.claim.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
           "LOWER(c.diagnosis) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Claim> search(String query);
    
    @Query("SELECT c.visitDate, COUNT(c) FROM Claim c " +
           "WHERE c.visitDate BETWEEN :startDate AND :endDate " +
           "GROUP BY c.visitDate ORDER BY c.visitDate")
    List<Object[]> countClaimsPerDay(LocalDate startDate, LocalDate endDate);
}
