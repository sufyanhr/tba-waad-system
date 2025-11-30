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
    
    // Basic finders
    Optional<Claim> findByClaimNumber(String claimNumber);
    Boolean existsByClaimNumber(String claimNumber);
    
    // Find by relations
    List<Claim> findByMemberId(Long memberId);
    List<Claim> findByProviderId(Long providerId);
    
    // Find by status
    List<Claim> findByStatus(Claim.ClaimStatus status);
    Long countByStatus(Claim.ClaimStatus status);
    
    // Find by claim type
    List<Claim> findByClaimType(Claim.ClaimType claimType);
    
    // Date range queries
    List<Claim> findByServiceDateBetween(LocalDate startDate, LocalDate endDate);
    List<Claim> findBySubmissionDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Combined queries
    @Query("SELECT c FROM Claim c WHERE c.member.id = :memberId AND c.status = :status")
    List<Claim> findByMemberIdAndStatus(@Param("memberId") Long memberId, 
                                        @Param("status") Claim.ClaimStatus status);
    
    @Query("SELECT c FROM Claim c WHERE c.providerId = :providerId AND c.status = :status")
    List<Claim> findByProviderIdAndStatus(@Param("providerId") Long providerId, 
                                          @Param("status") Claim.ClaimStatus status);
    
    // Search queries
    @Query("SELECT c FROM Claim c WHERE " +
           "LOWER(c.claimNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.notes) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.providerName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Claim> search(@Param("query") String query);

    @Query("SELECT c FROM Claim c WHERE " +
           "LOWER(c.claimNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.notes) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.providerName) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Claim> searchPaged(@Param("q") String q, Pageable pageable);

    // Statistics queries
    @Query("SELECT FUNCTION('MONTH', c.serviceDate) as month, " +
           "FUNCTION('YEAR', c.serviceDate) as year, " +
           "COUNT(c), SUM(c.totalClaimed), SUM(c.totalApproved) " +
           "FROM Claim c " +
           "WHERE c.serviceDate BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('YEAR', c.serviceDate), FUNCTION('MONTH', c.serviceDate) " +
           "ORDER BY year, month")
    List<Object[]> getMonthlyStatistics(@Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c.serviceDate, COUNT(c), SUM(c.totalClaimed) " +
           "FROM Claim c " +
           "WHERE c.serviceDate BETWEEN :startDate AND :endDate " +
           "GROUP BY c.serviceDate " +
           "ORDER BY c.serviceDate")
    List<Object[]> getDailyStatistics(@Param("startDate") LocalDate startDate, 
                                      @Param("endDate") LocalDate endDate);
    
    // Employer-filtered queries
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.member.employer.id = :employerId")
    Long countByMember_Employer_Id(@Param("employerId") Long employerId);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.member.employer.id = :employerId AND c.status = :status")
    Long countByMember_Employer_IdAndStatus(@Param("employerId") Long employerId, @Param("status") Claim.ClaimStatus status);
    
    @Query("SELECT c.serviceDate, COUNT(c) " +
           "FROM Claim c " +
           "WHERE c.member.employer.id = :employerId " +
           "AND c.serviceDate BETWEEN :startDate AND :endDate " +
           "GROUP BY c.serviceDate " +
           "ORDER BY c.serviceDate")
    List<Object[]> getDailyStatisticsByEmployer(@Param("employerId") Long employerId,
                                                @Param("startDate") LocalDate startDate, 
                                                @Param("endDate") LocalDate endDate);
    
    // Financial summary
    @Query("SELECT SUM(c.totalClaimed), SUM(c.totalApproved) " +
           "FROM Claim c " +
           "WHERE c.status = :status")
    Object[] getFinancialSummaryByStatus(@Param("status") Claim.ClaimStatus status);
}
