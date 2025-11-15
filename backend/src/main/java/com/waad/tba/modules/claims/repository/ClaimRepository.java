package com.waad.tba.modules.claims.repository;

import com.waad.tba.modules.claims.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    Optional<Claim> findByClaimNumber(String claimNumber);
    List<Claim> findByMemberId(Long memberId);
    List<Claim> findByProviderId(Long providerId);
    List<Claim> findByStatus(Claim.ClaimStatus status);

    // ✅ Claims for specific organization
    @Query("SELECT c FROM Claim c WHERE c.member.organization.id = :orgId")
    List<Claim> findByMemberOrganizationId(@Param("orgId") Long organizationId);

    // ✅ Claims by date range
    @Query("SELECT c FROM Claim c WHERE c.serviceDate BETWEEN :startDate AND :endDate")
    List<Claim> findByClaimDateBetween(@Param("startDate") LocalDate startDate, 
                                      @Param("endDate") LocalDate endDate);

    // ✅ Claims by status for organization
    @Query("SELECT c FROM Claim c WHERE c.member.organization.id = :orgId AND c.status = :status")
    List<Claim> findByMemberOrganizationIdAndStatus(@Param("orgId") Long organizationId, 
                                                    @Param("status") Claim.ClaimStatus status);

    // ✅ Claims pending review (older than X days)
    @Query("SELECT c FROM Claim c WHERE c.status = 'PENDING_REVIEW' AND c.serviceDate < :cutoffDate")
    List<Claim> findPendingClaimsOlderThan(@Param("cutoffDate") LocalDate cutoffDate);

    // ✅ High value claims (above threshold)
    @Query("SELECT c FROM Claim c WHERE c.totalAmount > :threshold")
    List<Claim> findHighValueClaims(@Param("threshold") Double threshold);

    // ✅ Dashboard statistics
    List<Claim> findTop10ByOrderByCreatedAtDesc();
    long countByStatus(Claim.ClaimStatus status);
    
    @Query("SELECT SUM(c.totalAmount) FROM Claim c WHERE c.status = 'APPROVED'")
    Double getTotalApprovedAmount();
    
    @Query("SELECT AVG(c.totalAmount) FROM Claim c WHERE c.status = 'APPROVED'")
    Double getAverageClaimAmount();
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.serviceDate >= :startDate AND c.serviceDate <= :endDate")
    Long countClaimsByDateRange(@Param("startDate") LocalDate startDate, 
                               @Param("endDate") LocalDate endDate);

    List<Claim> findByMemberOrganization(com.waad.tba.modules.employers.model.Organization organization);
    List<Claim> findByMember(com.waad.tba.modules.members.model.Member member);
}
