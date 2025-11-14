package com.waad.tba.modules.members.repository;

import com.waad.tba.modules.members.model.BenefitUsage;
import com.waad.tba.modules.members.model.Member;
import com.waad.tba.modules.members.model.BenefitTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BenefitUsageRepository extends JpaRepository<BenefitUsage, Long> {
    
    List<BenefitUsage> findByMemberAndYear(Member member, Integer year);
    
    Optional<BenefitUsage> findByMemberAndBenefitAndYear(Member member, BenefitTable benefit, Integer year);
    
    @Query("SELECT bu FROM BenefitUsage bu WHERE bu.member = :member AND bu.year = :year ORDER BY bu.benefit.serviceCategory")
    List<BenefitUsage> findByMemberAndYearOrderByCategory(Member member, Integer year);
    
    List<BenefitUsage> findByMemberIdAndYear(Long memberId, Integer year);
    
    @Query("SELECT SUM(bu.usedAmount) FROM BenefitUsage bu WHERE bu.member = :member AND bu.year = :year")
    java.math.BigDecimal getTotalUsedAmountByMemberAndYear(Member member, Integer year);
}