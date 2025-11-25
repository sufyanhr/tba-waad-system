package com.waad.tba.modules.provider.repository;

import com.waad.tba.modules.provider.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    
    Optional<Provider> findByCode(String code);
    
    Optional<Provider> findByLicenseNumber(String licenseNumber);
    
    List<Provider> findByType(Provider.ProviderType type);
    
    List<Provider> findByRegion(String region);
    
    List<Provider> findByCity(String city);
    
    List<Provider> findByContractStatus(Provider.ContractStatus contractStatus);
    
    @Query("SELECT p FROM Provider p WHERE p.type = :type AND p.contractStatus = 'ACTIVE' AND p.active = true")
    List<Provider> findActiveProvidersByType(@Param("type") Provider.ProviderType type);
    
    @Query("SELECT p FROM Provider p WHERE p.region = :region AND p.contractStatus = 'ACTIVE' AND p.active = true")
    List<Provider> findActiveProvidersByRegion(@Param("region") String region);
    
    @Query("SELECT p FROM Provider p WHERE p.contractEndDate < :date AND p.contractStatus = 'ACTIVE'")
    List<Provider> findProvidersWithExpiringContracts(@Param("date") LocalDate date);
    
    @Query("SELECT p FROM Provider p WHERE p.licenseExpiryDate < :date")
    List<Provider> findProvidersWithExpiringLicenses(@Param("date") LocalDate date);
    
    @Query("SELECT p FROM Provider p WHERE " +
           "LOWER(p.nameAr) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.nameEn) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Provider> searchProviders(@Param("search") String search);
    
    boolean existsByCode(String code);
    boolean existsByLicenseNumber(String licenseNumber);
}
