package com.waad.tba.modules.claim.repository;

import com.waad.tba.modules.claim.entity.ClaimLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimLineRepository extends JpaRepository<ClaimLine, Long> {
    
    List<ClaimLine> findByClaimId(Long claimId);
    
    List<ClaimLine> findByStatus(ClaimLine.LineStatus status);
    
    @Query("SELECT cl FROM ClaimLine cl WHERE cl.claim.id = :claimId AND cl.status = :status")
    List<ClaimLine> findByClaimIdAndStatus(@Param("claimId") Long claimId, 
                                           @Param("status") ClaimLine.LineStatus status);
    
    @Query("SELECT cl FROM ClaimLine cl WHERE cl.serviceCode = :serviceCode")
    List<ClaimLine> findByServiceCode(@Param("serviceCode") String serviceCode);
}
