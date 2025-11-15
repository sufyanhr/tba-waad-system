package com.waad.tba.modules.insurance.model;

import com.waad.tba.core.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "policy_benefit_limits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class PolicyBenefitLimit extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @Column(name = "benefit_code", nullable = false, length = 50)
    private String benefitCode; // e.g. LAB01, XRAY02

    @Column(name = "annual_limit")
    private Double annualLimit; // annual limit for this benefit

    @Column(name = "monthly_limit")
    private Double monthlyLimit; // optional

    @Column(name = "visit_limit")
    private Double visitLimit; // optional

    @Column(name = "used_amount")
    @Builder.Default
    private Double usedAmount = 0.0; // default 0

    @Column(name = "used_visits")
    @Builder.Default
    private Double usedVisits = 0.0; // default 0

    @Enumerated(EnumType.STRING)
    @Column(name = "coverage_type")
    private Policy.CoverageType coverageType; // ENUM from Policy model (FULL, PARTIAL, CUSTOM)
}