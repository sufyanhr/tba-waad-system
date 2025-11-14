package com.waad.tba.modules.claims.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * تفاصيل عناصر المطالبة - جدول تفصيلي لكل خدمة في المطالبة
 */
@Entity
@Table(name = "claim_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ClaimItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;
    
    @Column(name = "service_code", nullable = false)
    private String serviceCode;  // كود الخدمة الطبية
    
    @Column(name = "service_name", nullable = false)
    private String serviceName;  // اسم الخدمة
    
    @Column(name = "service_category")
    private String serviceCategory;  // فئة الخدمة (تحاليل، أشعة، عمليات...)
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;  // الكمية
    
    @Column(name = "unit_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;  // سعر الوحدة
    
    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;  // المبلغ الإجمالي
    
    @Column(name = "covered_amount", precision = 10, scale = 2)
    private BigDecimal coveredAmount;  // المبلغ المغطى
    
    @Column(name = "member_contribution", precision = 10, scale = 2)
    private BigDecimal memberContribution;  // مساهمة العضو
    
    @Column(name = "coverage_percentage", precision = 5, scale = 2)
    private BigDecimal coveragePercentage;  // نسبة التغطية
    
    @Column(name = "rejection_reason")
    private String rejectionReason;  // سبب الرفض إن وجد
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ClaimItemStatus status = ClaimItemStatus.PENDING;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum ClaimItemStatus {
        PENDING,      // في الانتظار
        APPROVED,     // موافق عليه
        REJECTED,     // مرفوض
        PARTIAL       // موافق عليه جزئياً
    }
}