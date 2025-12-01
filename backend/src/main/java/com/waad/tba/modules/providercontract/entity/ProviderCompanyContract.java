package com.waad.tba.modules.providercontract.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.waad.tba.modules.company.entity.Company;
import com.waad.tba.modules.provider.entity.Provider;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a contract between a Provider and a Company (tenant).
 * This establishes the provider network for each company.
 * Only providers with ACTIVE contracts can serve members of that company.
 */
@Entity
@Table(name = "provider_company_contracts", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_contract_code", columnNames = "contractCode"),
        @UniqueConstraint(name = "uk_company_provider", columnNames = {"company_id", "provider_id", "status"})
    },
    indexes = {
        @Index(name = "idx_company_id", columnList = "company_id"),
        @Index(name = "idx_provider_id", columnList = "provider_id"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_company_provider", columnList = "company_id, provider_id")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderCompanyContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Company is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false, 
                foreignKey = @ForeignKey(name = "fk_contract_company"))
    private Company company;

    @NotNull(message = "Provider is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_contract_provider"))
    private Provider provider;

    @NotNull(message = "Contract code is required")
    @Column(nullable = false, unique = true, length = 100)
    private String contractCode;

    @NotNull(message = "Start date is required")
    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @NotNull(message = "Contract status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProviderContractStatus status = ProviderContractStatus.ACTIVE;

    @Column(length = 100)
    private String pricingModel;

    @Column(length = 2000)
    private String notes;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Validate that endDate is after or equal to startDate
     */
    @PrePersist
    @PreUpdate
    private void validateDates() {
        if (endDate != null && startDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after or equal to start date");
        }
    }

    /**
     * Check if contract is currently active
     */
    public boolean isActive() {
        LocalDate now = LocalDate.now();
        return status == ProviderContractStatus.ACTIVE 
                && !startDate.isAfter(now)
                && (endDate == null || !endDate.isBefore(now));
    }

    /**
     * Check if contract has expired based on dates
     */
    public boolean isExpiredByDate() {
        return endDate != null && endDate.isBefore(LocalDate.now());
    }
}
