package com.waad.tba.modules.medicalpackage;

import com.waad.tba.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
                ApiResponse.<List<MedicalPackage>>builder()
                    .success(true)
                    .message("Medical packages retrieved successfully")
                    .data(packages)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.<List<MedicalPackage>>builder()
                    .success(false)
                    .message("Failed to retrieve medical packages")
                    .error(e.getMessage())
                    .build()
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
                ApiResponse.<MedicalPackage>builder()
                    .success(true)
                    .message("Medical package retrieved successfully")
                    .data(medicalPackage)
                    .build()
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.<MedicalPackage>builder()
                    .success(false)
                    .message("Medical package not found")
                    .error(e.getMessage())
                    .build()
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
                ApiResponse.<MedicalPackage>builder()
                    .success(true)
                    .message("Medical package retrieved successfully")
                    .data(medicalPackage)
                    .build()
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.<MedicalPackage>builder()
                    .success(false)
                    .message("Medical package not found")
                    .error(e.getMessage())
                    .build()
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
                ApiResponse.<List<MedicalPackage>>builder()
                    .success(true)
                    .message("Active medical packages retrieved successfully")
                    .data(packages)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.<List<MedicalPackage>>builder()
                    .success(false)
                    .message("Failed to retrieve active medical packages")
                    .error(e.getMessage())
                    .build()
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
                ApiResponse.<MedicalPackage>builder()
                    .success(true)
                    .message("Medical package created successfully")
                    .data(created)
                    .build()
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.<MedicalPackage>builder()
                    .success(false)
                    .message("Failed to create medical package")
                    .error(e.getMessage())
                    .build()
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
                ApiResponse.<MedicalPackage>builder()
                    .success(true)
                    .message("Medical package updated successfully")
                    .data(updated)
                    .build()
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.<MedicalPackage>builder()
                    .success(false)
                    .message("Failed to update medical package")
                    .error(e.getMessage())
                    .build()
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
                ApiResponse.<Void>builder()
                    .success(true)
                    .message("Medical package deleted successfully")
                    .build()
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.<Void>builder()
                    .success(false)
                    .message("Failed to delete medical package")
                    .error(e.getMessage())
                    .build()
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
                ApiResponse.<Long>builder()
                    .success(true)
                    .message("Package count retrieved successfully")
                    .data(count)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.<Long>builder()
                    .success(false)
                    .message("Failed to retrieve package count")
                    .error(e.getMessage())
                    .build()
            );
        }
    }
}
