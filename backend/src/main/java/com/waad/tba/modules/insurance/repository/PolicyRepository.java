package com.waad.tba.modules.insurance.repository;

import com.waad.tba.modules.insurance.model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    
    // البحث الأساسي
    Optional<Policy> findByPolicyNumber(String policyNumber);
    Optional<Policy> findByPolicyCode(String policyCode);
    
    // البحث حسب شركة التأمين
    List<Policy> findByInsuranceCompanyId(Long insuranceCompanyId);
    List<Policy> findByInsuranceCompanyIdAndIsActiveTrue(Long insuranceCompanyId);
    
    // البحث حسب المؤسسة
    List<Policy> findByOrganizationId(Long organizationId);
    List<Policy> findByOrganizationIdAndIsActiveTrue(Long organizationId);
    
    // البحث حسب الحالة
    List<Policy> findByIsActiveTrue();
    List<Policy> findByIsActiveFalse();
    
    // البحث حسب نوع التغطية
    List<Policy> findByCoverageTypeAndIsActiveTrue(Policy.CoverageType coverageType);
    
    // البوليصات المنتهية الصلاحية قريباً
    @Query("SELECT p FROM Policy p WHERE p.isActive = true AND p.endDate BETWEEN :startDate AND :endDate")
    List<Policy> findExpiringPolicies(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // البوليصات النشطة في فترة معينة
    @Query("SELECT p FROM Policy p WHERE p.isActive = true AND p.startDate <= :date AND p.endDate >= :date")
    List<Policy> findActivePoliciesOnDate(@Param("date") LocalDate date);
    
    // إحصائيات
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.isActive = true")
    Long countActivePolicies();
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.insuranceCompany.id = :companyId AND p.isActive = true")
    Long countActivePoliciesByCompany(@Param("companyId") Long companyId);
}
