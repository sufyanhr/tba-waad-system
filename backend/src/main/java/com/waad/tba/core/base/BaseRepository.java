package com.waad.tba.core.base;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Base repository interface for all domain entities
 * Provides common query methods
 */
@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity> extends JpaRepository<T, Long> {

    /**
     * Find all active entities
     */
    @Query("SELECT e FROM #{#entityName} e WHERE e.active = true")
    List<T> findAllActive();

    /**
     * Find active entity by ID
     */
    @Query("SELECT e FROM #{#entityName} e WHERE e.id = :id AND e.active = true")
    Optional<T> findActiveById(@Param("id") Long id);

    /**
     * Count active entities
     */
    @Query("SELECT COUNT(e) FROM #{#entityName} e WHERE e.active = true")
    long countActive();

    /**
     * Check if active entity exists by ID
     */
    @Query("SELECT COUNT(e) > 0 FROM #{#entityName} e WHERE e.id = :id AND e.active = true")
    boolean existsActiveById(@Param("id") Long id);

    /**
     * Soft delete by ID - sets active to false
     */
    @Query("UPDATE #{#entityName} e SET e.active = false WHERE e.id = :id")
    void softDeleteById(@Param("id") Long id);

    /**
     * Reactivate entity by ID
     */
    @Query("UPDATE #{#entityName} e SET e.active = true WHERE e.id = :id")
    void activateById(@Param("id") Long id);
}