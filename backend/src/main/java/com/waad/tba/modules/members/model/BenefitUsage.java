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
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * استخدام المنافع - تتبع استهلاك المنافع لكل عضو
 */
@Entity
@Table(name = "benefit_usage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class BenefitUsage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "benefit_id", nullable = false)
    private BenefitTable benefit;
    
    @Column(name = "year", nullable = false)
    private Integer year;  // السنة
    
    @Column(name = "used_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal usedAmount = BigDecimal.ZERO;  // المبلغ المستخدم
    
    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;  // عدد المرات المستخدمة
    
    @Column(name = "used_times", nullable = false)
    private Integer usedTimes = 0;  // عدد المرات المستخدمة (alias)
    
    @Column(name = "remaining_times")
    private Integer remainingTimes;  // عدد المرات المتبقية
    
    @Column(name = "remaining_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal remainingAmount;  // المبلغ المتبقي
    
    @Column(name = "remaining_count", nullable = false)
    private Integer remainingCount;  // عدد المرات المتبقية
    
    @Column(name = "last_usage_date")
    private LocalDate lastUsageDate;  // تاريخ آخر استخدام
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructor لحساب المتبقي
    public BenefitUsage(Member member, Policy policy, BenefitTable benefit, Integer year) {
        this.member = member;
        this.policy = policy;
        this.benefit = benefit;
        this.year = year;
        this.usedAmount = BigDecimal.ZERO;
        this.usedCount = 0;
        this.remainingAmount = benefit.getMaxLimit();
        this.remainingCount = benefit.getMaxCount() != null ? benefit.getMaxCount() : Integer.MAX_VALUE;
    }
    
    /**
     * تحديث الاستخدام وإعادة حساب المتبقي
     */
    public void updateUsage(BigDecimal amount, Integer count) {
        this.usedAmount = this.usedAmount.add(amount);
        this.usedCount += count;
        this.remainingAmount = this.benefit.getMaxLimit().subtract(this.usedAmount);
        if (this.benefit.getMaxCount() != null) {
            this.remainingCount = this.benefit.getMaxCount() - this.usedCount;
        }
        this.lastUsageDate = LocalDate.now();
    }
}