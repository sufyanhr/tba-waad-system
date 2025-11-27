package com.waad.tba.modules.medicalpackage;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.waad.tba.common.dto.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/medical-packages")
@RequiredArgsConstructor
public class MedicalPackageController {

    private final MedicalPackageService service;

    /**
     * GET /api/medical-packages
     * Get all medical packages
     */
    @GetMapping
    @PreAuthorize("hasAuthority('MEDICAL_PACKAGE_READ')")
    public ResponseEntity<ApiResponse<List<MedicalPackage>>> getAll() {
        try {
            List<MedicalPackage> packages = service.findAll();
            return ResponseEntity.ok(
                ApiResponse.success("Medical packages retrieved successfully", packages)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.error("Failed to retrieve medical packages: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/medical-packages/{id}
     * Get medical package by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MEDICAL_PACKAGE_READ')")
    public ResponseEntity<ApiResponse<MedicalPackage>> getById(@PathVariable Long id) {
        try {
            MedicalPackage medicalPackage = service.findById(id);
            return ResponseEntity.ok(
                ApiResponse.success("Medical package retrieved successfully", medicalPackage)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.error("Medical package not found: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/medical-packages/code/{code}
     * Get medical package by code
     */
    @GetMapping("/code/{code}")
    @PreAuthorize("hasAuthority('MEDICAL_PACKAGE_READ')")
    public ResponseEntity<ApiResponse<MedicalPackage>> getByCode(@PathVariable String code) {
        try {
            MedicalPackage medicalPackage = service.findByCode(code);
            return ResponseEntity.ok(
                ApiResponse.success("Medical package retrieved successfully", medicalPackage)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.error("Medical package not found: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/medical-packages/active
     * Get active medical packages only
     */
    @GetMapping("/active")
    @PreAuthorize("hasAuthority('MEDICAL_PACKAGE_READ')")
    public ResponseEntity<ApiResponse<List<MedicalPackage>>> getActive() {
        try {
            List<MedicalPackage> packages = service.findActive();
            return ResponseEntity.ok(
                ApiResponse.success("Active medical packages retrieved successfully", packages)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.error("Failed to retrieve active medical packages: " + e.getMessage())
            );
        }
    }

    /**
     * POST /api/medical-packages
     * Create new medical package
     */
    @PostMapping
    @PreAuthorize("hasAuthority('MEDICAL_PACKAGE_CREATE')")
    public ResponseEntity<ApiResponse<MedicalPackage>> create(@RequestBody MedicalPackageDTO dto) {
        try {
            MedicalPackage created = service.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Medical package created successfully", created)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.error("Failed to create medical package: " + e.getMessage())
            );
        }
    }

    /**
     * PUT /api/medical-packages/{id}
     * Update existing medical package
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MEDICAL_PACKAGE_UPDATE')")
    public ResponseEntity<ApiResponse<MedicalPackage>> update(@PathVariable Long id, @RequestBody MedicalPackageDTO dto) {
        try {
            MedicalPackage updated = service.update(id, dto);
            return ResponseEntity.ok(
                ApiResponse.success("Medical package updated successfully", updated)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.error("Failed to update medical package: " + e.getMessage())
            );
        }
    }

    /**
     * DELETE /api/medical-packages/{id}
     * Delete medical package
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MEDICAL_PACKAGE_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(
                ApiResponse.success("Medical package deleted successfully", null)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.error("Failed to delete medical package: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/medical-packages/count
     * Get total count of medical packages
     */
    @GetMapping("/count")
    @PreAuthorize("hasAuthority('MEDICAL_PACKAGE_READ')")
    public ResponseEntity<ApiResponse<Long>> count() {
        try {
            Long count = service.count();
            return ResponseEntity.ok(
                ApiResponse.success("Package count retrieved successfully", count)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.error("Failed to retrieve package count: " + e.getMessage())
            );
        }
    }
}
