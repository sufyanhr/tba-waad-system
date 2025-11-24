package com.waad.tba.modules.medicalcategory;

import com.waad.tba.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Medical Category REST Controller
 * Provides API endpoints for medical category management
 */
@RestController
@RequestMapping("/api/medical-categories")
@RequiredArgsConstructor
public class MedicalCategoryController {

    private final MedicalCategoryService service;

    /**
     * Get all medical categories
     * GET /api/medical-categories
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalCategory>>> getAllCategories() {
        try {
            List<MedicalCategory> categories = service.findAll();
            return ResponseEntity.ok(ApiResponse.success(
                    "Medical categories retrieved successfully",
                    categories
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Failed to retrieve medical categories: " + e.getMessage()
            ));
        }
    }

    /**
     * Get medical category by ID
     * GET /api/medical-categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalCategory>> getCategoryById(@PathVariable Long id) {
        try {
            MedicalCategory category = service.findById(id);
            return ResponseEntity.ok(ApiResponse.success(
                    "Medical category retrieved successfully",
                    category
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Medical category not found: " + e.getMessage()
            ));
        }
    }

    /**
     * Get medical category by code
     * GET /api/medical-categories/code/{code}
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<MedicalCategory>> getCategoryByCode(@PathVariable String code) {
        try {
            MedicalCategory category = service.findByCode(code);
            return ResponseEntity.ok(ApiResponse.success(
                    "Medical category retrieved successfully",
                    category
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Medical category not found: " + e.getMessage()
            ));
        }
    }

    /**
     * Create new medical category
     * POST /api/medical-categories
     */
    @PostMapping
    public ResponseEntity<ApiResponse<MedicalCategory>> createCategory(@RequestBody MedicalCategory category) {
        try {
            MedicalCategory created = service.create(category);
            return ResponseEntity.ok(ApiResponse.success(
                    "Medical category created successfully",
                    created
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Failed to create medical category: " + e.getMessage()
            ));
        }
    }

    /**
     * Update medical category
     * PUT /api/medical-categories/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalCategory>> updateCategory(
            @PathVariable Long id,
            @RequestBody MedicalCategory category) {
        try {
            MedicalCategory updated = service.update(id, category);
            return ResponseEntity.ok(ApiResponse.success(
                    "Medical category updated successfully",
                    updated
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Failed to update medical category: " + e.getMessage()
            ));
        }
    }

    /**
     * Delete medical category
     * DELETE /api/medical-categories/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(ApiResponse.success(
                    "Medical category deleted successfully",
                    null
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Failed to delete medical category: " + e.getMessage()
            ));
        }
    }
}
