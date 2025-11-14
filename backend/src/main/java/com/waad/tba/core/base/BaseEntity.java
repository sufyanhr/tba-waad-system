package com.waad.tba.core.base;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Base entity class for all domain entities
 * Provides common fields and auditing functionality
 */
@MappedSuperclass
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    /**
     * Equality based on ID for persisted entities
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        BaseEntity that = (BaseEntity) obj;
        return id != null && id.equals(that.getId());
    }

    /**
     * Hash code based on ID for persisted entities
     */
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    /**
     * Check if entity is persisted (has ID)
     */
    public boolean isPersisted() {
        return id != null;
    }

    /**
     * Soft delete by setting active to false
     */
    public void softDelete() {
        this.active = false;
    }

    /**
     * Reactivate entity
     */
    public void activate() {
        this.active = true;
    }
}