package com.waad.tba.core.base;

import com.waad.tba.core.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Base controller class for all domain controllers
 * Provides common CRUD endpoints
 */
@SecurityRequirement(name = "Bearer Authentication")
public abstract class BaseController<T extends BaseEntity, S extends BaseService<T, ?>> {

    protected final S service;

    public BaseController(S service) {
        this.service = service;
    }

    /**
     * Get all entities
     */
    @GetMapping
    @Operation(summary = "Get all entities")
    public ResponseEntity<List<T>> getAll() {
        List<T> entities = service.findAllActive();
        return ResponseEntity.ok(entities);
    }

    /**
     * Get entity by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get entity by ID")
    public ResponseEntity<T> getById(
            @Parameter(description = "Entity ID") @PathVariable Long id) {
        T entity = service.getActiveById(id);
        return ResponseEntity.ok(entity);
    }

    /**
     * Create new entity
     */
    @PostMapping
    @Operation(summary = "Create new entity")
    public ResponseEntity<T> create(@Valid @RequestBody T entity) {
        T saved = service.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Update existing entity
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update existing entity")
    public ResponseEntity<T> update(
            @Parameter(description = "Entity ID") @PathVariable Long id,
            @Valid @RequestBody T entity) {
        // Ensure the entity exists
        service.getActiveById(id);
        entity.setId(id);
        T updated = service.save(entity);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete entity (soft delete)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete entity")
    public ResponseEntity<ApiResponse> delete(
            @Parameter(description = "Entity ID") @PathVariable Long id) {
        service.softDeleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, getEntityName() + " deleted successfully"));
    }

    /**
     * Activate entity
     */
    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate entity")
    public ResponseEntity<ApiResponse> activate(
            @Parameter(description = "Entity ID") @PathVariable Long id) {
        service.activateById(id);
        return ResponseEntity.ok(new ApiResponse(true, getEntityName() + " activated successfully"));
    }

    /**
     * Check if entity exists
     */
    @GetMapping("/{id}/exists")
    @Operation(summary = "Check if entity exists")
    public ResponseEntity<Boolean> exists(
            @Parameter(description = "Entity ID") @PathVariable Long id) {
        boolean exists = service.existsActiveById(id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Get entity count
     */
    @GetMapping("/count")
    @Operation(summary = "Get entity count")
    public ResponseEntity<Long> count() {
        long count = service.countActive();
        return ResponseEntity.ok(count);
    }

    /**
     * Get entity name for responses
     * Should be overridden by subclasses
     */
    protected abstract String getEntityName();
}