package com.waad.tba.modules.claims.repository;

import com.waad.tba.modules.claims.model.ClaimItem;
import com.waad.tba.modules.claims.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ClaimItemRepository extends JpaRepository<ClaimItem, Long> {
    
    List<ClaimItem> findByClaim(Claim claim);
    
    List<ClaimItem> findByClaimId(Long claimId);
    
    List<ClaimItem> findByServiceCode(String serviceCode);
    
    List<ClaimItem> findByStatus(ClaimItem.ClaimItemStatus status);
    
    @Query("SELECT SUM(ci.totalAmount) FROM ClaimItem ci WHERE ci.claim = :claim")
    BigDecimal getTotalAmountByClaim(Claim claim);
    
    @Query("SELECT SUM(ci.coveredAmount) FROM ClaimItem ci WHERE ci.claim = :claim")
    BigDecimal getTotalCoveredAmountByClaim(Claim claim);
    
    @Query("SELECT ci FROM ClaimItem ci WHERE ci.claim.member.id = :memberId AND ci.serviceCode = :serviceCode")
    List<ClaimItem> findByMemberIdAndServiceCode(Long memberId, String serviceCode);
}