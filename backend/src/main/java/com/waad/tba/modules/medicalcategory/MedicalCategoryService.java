package com.waad.tba.modules.medicalcategory;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Medical Category Service
 * Business logic for managing medical categories
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MedicalCategoryService {

    private final MedicalCategoryRepository repository;

    /**
     * Get all medical categories
     * @return List of all categories
     */
    public List<MedicalCategory> findAll() {
        return repository.findAll();
    }

    /**
     * Get category by ID
     * @param id Category ID
     * @return MedicalCategory
     * @throws RuntimeException if not found
     */
    public MedicalCategory findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical category not found with id: " + id));
    }

    /**
     * Get category by code
     * @param code Category code
     * @return MedicalCategory
     * @throws RuntimeException if not found
     */
    public MedicalCategory findByCode(String code) {
        return repository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Medical category not found with code: " + code));
    }

    /**
     * Create new medical category
     * @param category Category to create
     * @return Created category
     * @throws RuntimeException if code already exists
     */
    @Transactional
    public MedicalCategory create(MedicalCategory category) {
        if (repository.existsByCode(category.getCode())) {
            throw new RuntimeException("Medical category with code " + category.getCode() + " already exists");
        }
        return repository.save(category);
    }

    /**
     * Update existing medical category
     * @param id Category ID
     * @param updatedCategory Updated category data
     * @return Updated category
     * @throws RuntimeException if not found
     */
    @Transactional
    public MedicalCategory update(Long id, MedicalCategory updatedCategory) {
        MedicalCategory existing = findById(id);
        
        // Update fields
        existing.setCode(updatedCategory.getCode());
        existing.setNameAr(updatedCategory.getNameAr());
        existing.setNameEn(updatedCategory.getNameEn());
        existing.setDescription(updatedCategory.getDescription());
        
        return repository.save(existing);
    }

    /**
     * Delete medical category
     * @param id Category ID
     * @throws RuntimeException if not found or has associated services
     */
    @Transactional
    public void delete(Long id) {
        MedicalCategory category = findById(id);
        
        // Check if category has associated medical services
        if (!category.getMedicalServices().isEmpty()) {
            throw new RuntimeException("Cannot delete category with associated medical services. " +
                    "Please reassign or delete the services first.");
        }
        
        repository.deleteById(id);
    }
}
