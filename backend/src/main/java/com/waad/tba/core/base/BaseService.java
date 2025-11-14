package com.waad.tba.core.base;

import com.waad.tba.core.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Base service interface for all domain services
 * Provides common CRUD operations
 */
public abstract class BaseService<T extends BaseEntity, R extends BaseRepository<T>> {

    protected final R repository;

    public BaseService(R repository) {
        this.repository = repository;
    }

    /**
     * Find all entities
     */
    @Transactional(readOnly = true)
    public List<T> findAll() {
        return repository.findAll();
    }

    /**
     * Find all active entities
     */
    @Transactional(readOnly = true)
    public List<T> findAllActive() {
        return repository.findAllActive();
    }

    /**
     * Find entity by ID
     */
    @Transactional(readOnly = true)
    public Optional<T> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * Find active entity by ID
     */
    @Transactional(readOnly = true)
    public Optional<T> findActiveById(Long id) {
        return repository.findActiveById(id);
    }

    /**
     * Get entity by ID or throw exception
     */
    @Transactional(readOnly = true)
    public T getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(getEntityName() + " not found with id: " + id));
    }

    /**
     * Get active entity by ID or throw exception
     */
    @Transactional(readOnly = true)
    public T getActiveById(Long id) {
        return repository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Active " + getEntityName() + " not found with id: " + id));
    }

    /**
     * Save entity
     */
    @Transactional
    public T save(T entity) {
        return repository.save(entity);
    }

    /**
     * Save all entities
     */
    @Transactional
    public List<T> saveAll(List<T> entities) {
        return repository.saveAll(entities);
    }

    /**
     * Delete entity by ID
     */
    @Transactional
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(getEntityName() + " not found with id: " + id);
        }
        repository.deleteById(id);
    }

    /**
     * Soft delete entity by ID
     */
    @Transactional
    public void softDeleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(getEntityName() + " not found with id: " + id);
        }
        repository.softDeleteById(id);
    }

    /**
     * Activate entity by ID
     */
    @Transactional
    public void activateById(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(getEntityName() + " not found with id: " + id);
        }
        repository.activateById(id);
    }

    /**
     * Check if entity exists
     */
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    /**
     * Check if active entity exists
     */
    @Transactional(readOnly = true)
    public boolean existsActiveById(Long id) {
        return repository.existsActiveById(id);
    }

    /**
     * Count all entities
     */
    @Transactional(readOnly = true)
    public long count() {
        return repository.count();
    }

    /**
     * Count active entities
     */
    @Transactional(readOnly = true)
    public long countActive() {
        return repository.countActive();
    }

    /**
     * Get entity name for error messages
     * Should be overridden by subclasses
     */
    protected abstract String getEntityName();
}