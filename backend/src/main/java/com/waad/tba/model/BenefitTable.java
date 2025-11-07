package com.waad.tba.model;

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
    
    @Column(name = "service_type", nullable = false)
    private String serviceType;
    
    @Column(name = "coverage_percent", precision = 5, scale = 2)
    private BigDecimal coveragePercent;
    
    @Column(name = "max_limit", precision = 15, scale = 2)
    private BigDecimal maxLimit;
    
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
