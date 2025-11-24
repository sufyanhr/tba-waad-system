package com.waad.tba.modules.medicalcategory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Medical Category Repository
 * Provides database access for MedicalCategory entities
 */
@Repository
public interface MedicalCategoryRepository extends JpaRepository<MedicalCategory, Long> {

    /**
     * Find category by unique code
     * @param code Category code
     * @return Optional MedicalCategory
     */
    Optional<MedicalCategory> findByCode(String code);

    /**
     * Check if category exists by code
     * @param code Category code
     * @return true if exists
     */
    boolean existsByCode(String code);
}
