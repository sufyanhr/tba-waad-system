package com.waad.tba.modules.benefits.service;

import com.waad.tba.modules.members.model.BenefitTable;
import com.waad.tba.modules.members.repository.BenefitTableRepository;
import com.waad.tba.modules.insurance.model.Policy;
import com.waad.tba.modules.insurance.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BenefitTableService {

    private final BenefitTableRepository benefitTableRepository;
    private final PolicyRepository policyRepository;

    /**
     * إنشاء خدمة جديدة في كتالوج المنافع
     */
    @PreAuthorize("hasAuthority('BENEFITS_MANAGE') or hasRole('ADMIN')")
    public BenefitTable createBenefit(BenefitTable benefit) {
        validateBenefitData(benefit);
        
        // التحقق من عدم تكرار كود الخدمة
        if (benefitTableRepository.findByServiceCode(benefit.getServiceCode()).isPresent()) {
            throw new IllegalArgumentException("Service code already exists: " + benefit.getServiceCode());
        }
        
        benefit.setActive(true);
        return benefitTableRepository.save(benefit);
    }

    /**
     * تحديث خدمة موجودة
     */
    @PreAuthorize("hasAuthority('BENEFITS_MANAGE') or hasRole('ADMIN')")
    public BenefitTable updateBenefit(Long id, BenefitTable benefitData) {
        BenefitTable existing = getBenefitById(id);
        validateBenefitData(benefitData);
        
        // التحقق من عدم تكرار كود الخدمة (باستثناء الخدمة الحالية)
        Optional<BenefitTable> duplicate = benefitTableRepository.findByServiceCode(benefitData.getServiceCode());
        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            throw new IllegalArgumentException("Service code already exists: " + benefitData.getServiceCode());
        }
        
        // تحديث البيانات
        existing.setServiceCode(benefitData.getServiceCode());
        existing.setServiceName(benefitData.getServiceName());
        existing.setServiceCategory(benefitData.getServiceCategory());
        existing.setServiceType(benefitData.getServiceType());
        existing.setOrganizationPrice(benefitData.getOrganizationPrice());
        existing.setCoveragePercent(benefitData.getCoveragePercent());
        existing.setMemberContribution(benefitData.getMemberContribution());
        existing.setMaxLimit(benefitData.getMaxLimit());
        existing.setMaxCount(benefitData.getMaxCount());
        existing.setRequiresApproval(benefitData.getRequiresApproval());
        existing.setNotes(benefitData.getNotes());
        
        return benefitTableRepository.save(existing);
    }

    /**
     * الحصول على خدمة بالمعرف
     */
    @PreAuthorize("hasAuthority('BENEFITS_VIEW') or hasRole('USER')")
    public BenefitTable getBenefitById(Long id) {
        return benefitTableRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Benefit not found with id: " + id));
    }

    /**
     * البحث بالكود الداخلي
     */
    @PreAuthorize("hasAuthority('BENEFITS_VIEW') or hasRole('USER')")
    public Optional<BenefitTable> getBenefitByCode(String serviceCode) {
        return benefitTableRepository.findByServiceCode(serviceCode);
    }

    /**
     * الحصول على الخدمات حسب الفئة
     */
    @PreAuthorize("hasAuthority('BENEFITS_VIEW') or hasRole('USER')")
    public List<BenefitTable> getBenefitsByCategory(String category) {
        return benefitTableRepository.findByServiceCategoryAndActiveTrue(category);
    }

    /**
     * الحصول على جميع الخدمات النشطة
     */
    @PreAuthorize("hasAuthority('BENEFITS_VIEW') or hasRole('USER')")
    public List<BenefitTable> getActiveBenefits() {
        return benefitTableRepository.findByActiveTrue();
    }

    /**
     * تحميل كتالوج الخدمات الأساسي
     */
    @PreAuthorize("hasAuthority('BENEFITS_MANAGE') or hasRole('ADMIN')")
    public void loadInitialCatalog(Long policyId) {
        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
        
        // إنشاء خدمات أساسية
        createLabServices(policy);
        createRadiologyServices(policy);
        createConsultationServices(policy);
        createSurgeryServices(policy);
    }

    // ==== Private Helper Methods ====

    private void validateBenefitData(BenefitTable benefit) {
        if (benefit.getServiceCode() == null || benefit.getServiceCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Service code is required");
        }
        
        if (benefit.getServiceName() == null || benefit.getServiceName().trim().isEmpty()) {
            throw new IllegalArgumentException("Service name is required");
        }
        
        if (benefit.getServiceCategory() == null || benefit.getServiceCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Service category is required");
        }
        
        if (benefit.getOrganizationPrice() == null || benefit.getOrganizationPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Organization price must be greater than zero");
        }
        
        if (benefit.getCoveragePercent() == null || 
            benefit.getCoveragePercent().compareTo(BigDecimal.ZERO) < 0 ||
            benefit.getCoveragePercent().compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Coverage percent must be between 0 and 100");
        }
    }

    private void createLabServices(Policy policy) {
        String[] services = {
            "LAB001:تحليل صورة دم كاملة:LAB:150:80:0",
            "LAB002:تحليل سكر صائم:LAB:75:85:0", 
            "LAB003:تحليل وظائف كلى:LAB:200:80:0",
            "LAB004:تحليل كوليسترول:LAB:120:80:0"
        };
        
        for (String service : services) {
            createServiceFromString(service, policy, "BASIC");
        }
    }

    private void createRadiologyServices(Policy policy) {
        String[] services = {
            "RAD001:أشعة سينية على الصدر:RADIOLOGY:200:75:25",
            "RAD002:سونار البطن:RADIOLOGY:350:70:50",
            "RAD003:أشعة مقطعية:RADIOLOGY:800:60:100"
        };
        
        for (String service : services) {
            createServiceFromString(service, policy, "DIAGNOSTIC");
        }
    }

    private void createConsultationServices(Policy policy) {
        String[] services = {
            "CONS001:استشارة طب عام:CONSULTATION:150:80:30",
            "CONS002:استشارة أطفال:CONSULTATION:200:75:40",
            "CONS003:استشارة قلب:CONSULTATION:300:70:60"
        };
        
        for (String service : services) {
            createServiceFromString(service, policy, "CONSULTATION");
        }
    }

    private void createSurgeryServices(Policy policy) {
        String[] services = {
            "SURG001:استئصال اللوزتين:SURGERY:2500:60:500",
            "SURG002:عملية المرارة:SURGERY:5000:70:1000"
        };
        
        for (String service : services) {
            createServiceFromString(service, policy, "SURGICAL");
        }
    }

    private void createServiceFromString(String serviceData, Policy policy, String serviceType) {
        String[] parts = serviceData.split(":");
        
        if (getBenefitByCode(parts[0]).isEmpty()) {
            BenefitTable benefit = new BenefitTable();
            benefit.setServiceCode(parts[0]);
            benefit.setServiceName(parts[1]);
            benefit.setServiceCategory(parts[2]);
            benefit.setServiceType(serviceType);
            benefit.setOrganizationPrice(new BigDecimal(parts[3]));
            benefit.setCoveragePercent(new BigDecimal(parts[4]));
            benefit.setMemberContribution(new BigDecimal(parts[5]));
            benefit.setMaxLimit(new BigDecimal("5000"));
            benefit.setMaxCount(12);
            benefit.setRequiresApproval(false);
            benefit.setActive(true);
            benefit.setPolicy(policy);
            
            benefitTableRepository.save(benefit);
        }
    }
}