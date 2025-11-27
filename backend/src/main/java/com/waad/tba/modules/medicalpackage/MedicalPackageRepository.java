package com.waad.tba.modules.medicalpackage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalPackageRepository extends JpaRepository<MedicalPackage, Long> {
    
    Optional<MedicalPackage> findByCode(String code);
    
    List<MedicalPackage> findByActive(Boolean active);
    
    boolean existsByCode(String code);
    
    @Query("SELECT mp FROM MedicalPackage mp LEFT JOIN FETCH mp.services WHERE mp.id = :id")
    Optional<MedicalPackage> findByIdWithServices(Long id);
    
    @Query("SELECT mp FROM MedicalPackage mp LEFT JOIN FETCH mp.services")
    List<MedicalPackage> findAllWithServices();
}
