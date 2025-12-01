package com.waad.tba.modules.providercontract.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.waad.tba.modules.providercontract.entity.ProviderCompanyContract;
import com.waad.tba.modules.providercontract.entity.ProviderContractStatus;

/**
 * Repository for ProviderCompanyContract entity
 */
@Repository
public interface ProviderCompanyContractRepository extends JpaRepository<ProviderCompanyContract, Long> {

    /**
     * Find all contracts for a specific company
     */
    List<ProviderCompanyContract> findByCompanyId(Long companyId);

    /**
     * Find all contracts for a specific provider
     */
    List<ProviderCompanyContract> findByProviderId(Long providerId);

    /**
     * Find contract by company and provider
     */
    Optional<ProviderCompanyContract> findByCompanyIdAndProviderId(Long companyId, Long providerId);

    /**
     * Find all contracts for a company with specific status
     */
    List<ProviderCompanyContract> findByCompanyIdAndStatus(Long companyId, ProviderContractStatus status);

    /**
     * Find active contract for a specific company and provider
     */
    Optional<ProviderCompanyContract> findByCompanyIdAndProviderIdAndStatus(
            Long companyId, Long providerId, ProviderContractStatus status);

    /**
     * Check if active contract exists between company and provider
     */
    boolean existsByCompanyIdAndProviderIdAndStatus(
            Long companyId, Long providerId, ProviderContractStatus status);

    /**
     * Check if contract code already exists
     */
    boolean existsByContractCode(String contractCode);

    /**
     * Find contract by contract code
     */
    Optional<ProviderCompanyContract> findByContractCode(String contractCode);

    /**
     * Find all active contracts for a company
     */
    @Query("SELECT c FROM ProviderCompanyContract c WHERE c.company.id = :companyId " +
           "AND c.status = 'ACTIVE' " +
           "AND c.startDate <= :currentDate " +
           "AND (c.endDate IS NULL OR c.endDate >= :currentDate)")
    List<ProviderCompanyContract> findActiveContractsByCompany(
            @Param("companyId") Long companyId, @Param("currentDate") LocalDate currentDate);

    /**
     * Find all contracts expiring soon
     */
    @Query("SELECT c FROM ProviderCompanyContract c WHERE c.status = 'ACTIVE' " +
           "AND c.endDate IS NOT NULL " +
           "AND c.endDate BETWEEN :startDate AND :endDate")
    List<ProviderCompanyContract> findContractsExpiringSoon(
            @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Find expired contracts that are still marked as ACTIVE
     */
    @Query("SELECT c FROM ProviderCompanyContract c WHERE c.status = 'ACTIVE' " +
           "AND c.endDate IS NOT NULL " +
           "AND c.endDate < :currentDate")
    List<ProviderCompanyContract> findExpiredActiveContracts(@Param("currentDate") LocalDate currentDate);

    /**
     * Count active contracts for a provider
     */
    @Query("SELECT COUNT(c) FROM ProviderCompanyContract c WHERE c.provider.id = :providerId " +
           "AND c.status = 'ACTIVE'")
    long countActiveContractsByProvider(@Param("providerId") Long providerId);

    /**
     * Count active contracts for a company
     */
    @Query("SELECT COUNT(c) FROM ProviderCompanyContract c WHERE c.company.id = :companyId " +
           "AND c.status = 'ACTIVE'")
    long countActiveContractsByCompany(@Param("companyId") Long companyId);
}
