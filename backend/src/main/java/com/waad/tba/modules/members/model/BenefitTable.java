package com.waad.tba.modules.members.model;

import com.waad.tba.modules.insurance.model.Policy;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "benefit_tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class BenefitTable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "service_code", unique = true, nullable = false)
    private String serviceCode;  // كود الخدمة الطبية الداخلي
    
    @Column(name = "service_name", nullable = false)
    private String serviceName;  // اسم الخدمة
    
    @Column(name = "service_category", nullable = false)
    private String serviceCategory;  // فئة الخدمة (تحاليل، أشعة، عمليات...)
    
    @Column(name = "service_type", nullable = false)
    private String serviceType;
    
    @Column(name = "organization_price", precision = 10, scale = 2)
    private BigDecimal organizationPrice;  // سعر المؤسسة
    
    @Column(name = "coverage_percent", precision = 5, scale = 2)
    private BigDecimal coveragePercent;  // نسبة التغطية التأمينية
    
    @Column(name = "member_contribution", precision = 10, scale = 2)
    private BigDecimal memberContribution;  // مساهمة العضو الثابتة
    
    @Column(name = "max_limit", precision = 15, scale = 2)
    private BigDecimal maxLimit;  // الحد الأقصى السنوي
    
    @Column(name = "max_count")
    private Integer maxCount;  // الحد الأقصى لعدد المرات سنوياً
    
    @Column(name = "requires_approval")
    private Boolean requiresApproval = false;  // يتطلب موافقة مسبقة
    
    @Column(name = "active")
    private Boolean active = true;  // نشط أم لا
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @ManyToOne
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
