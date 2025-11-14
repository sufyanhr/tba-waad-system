package com.waad.tba.modules.members.repository;

import com.waad.tba.modules.members.model.BenefitTable;
import com.waad.tba.modules.insurance.model.Policy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BenefitTableRepository extends JpaRepository<BenefitTable, Long> {
    
    // ✅ البحث بالكود الداخلي
    Optional<BenefitTable> findByServiceCode(String serviceCode);
    Optional<BenefitTable> findByServiceCodeAndActiveTrue(String serviceCode);
    
    // ✅ البحث حسب البوليصة
    List<BenefitTable> findByPolicyId(Long policyId);
    List<BenefitTable> findByPolicyAndActiveTrue(Policy policy);
    
    // ✅ البحث حسب الفئة والنوع
    List<BenefitTable> findByServiceType(String serviceType);
    List<BenefitTable> findByServiceCategory(String serviceCategory);
    List<BenefitTable> findByServiceCategoryAndActiveTrue(String serviceCategory);
    
    // ✅ الخدمات النشطة
    List<BenefitTable> findByActiveTrue();
    
    // ✅ الخدمات التي تتطلب موافقة
    List<BenefitTable> findByRequiresApprovalTrue();
    
    // ✅ البحث بعدة أكواد
    List<BenefitTable> findByServiceCodeIn(List<String> serviceCodes);
    
    // ✅ البحث النصي في الاسم والكود
    @Query("SELECT bt FROM BenefitTable bt WHERE " +
           "(LOWER(bt.serviceName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(bt.serviceCode) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "bt.active = true")
    Page<BenefitTable> findByServiceNameContainingIgnoreCaseOrServiceCodeContainingIgnoreCaseAndActiveTrue(
        @Param("searchTerm") String searchTerm1, 
        @Param("searchTerm") String searchTerm2, 
        Pageable pageable);
    
    // ✅ ترتيب الخدمات النشطة
    @Query("SELECT bt FROM BenefitTable bt WHERE bt.policy = :policy AND bt.active = true ORDER BY bt.serviceCategory, bt.serviceName")
    List<BenefitTable> findActiveBenefitsByPolicyOrdered(Policy policy);
    
    // ✅ إحصائيات الخدمات
    @Query("SELECT COUNT(bt) FROM BenefitTable bt WHERE bt.active = true")
    Long countActiveServices();
    
    @Query("SELECT COUNT(bt) FROM BenefitTable bt WHERE bt.serviceCategory = :category AND bt.active = true")
    Long countServicesByCategory(@Param("category") String category);
    
    @Query("SELECT DISTINCT bt.serviceCategory FROM BenefitTable bt WHERE bt.active = true ORDER BY bt.serviceCategory")
    List<String> findDistinctActiveServiceCategories();
}
