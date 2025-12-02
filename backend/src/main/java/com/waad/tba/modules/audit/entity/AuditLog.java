package com.waad.tba.modules.audit.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Audit Log Entity - Phase 8.2
 * 
 * Tracks all sensitive operations in the system for compliance and security.
 * 
 * @author TBA WAAD System
 * @version 1.0
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_username", columnList = "username"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_entity", columnList = "entity_type, entity_id"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Action performed (VIEW_MEMBER, APPROVE_CLAIM, REJECT_CLAIM, LOGIN, etc.)
     */
    @Column(nullable = false, length = 100)
    private String action;

    /**
     * Type of entity accessed (Member, Claim, Visit, User, etc.)
     */
    @Column(name = "entity_type", length = 50)
    private String entityType;

    /**
     * ID of the entity accessed
     */
    @Column(name = "entity_id")
    private Long entityId;

    /**
     * Username who performed the action
     */
    @Column(nullable = false, length = 100)
    private String username;

    /**
     * User ID who performed the action
     */
    @Column(name = "user_id")
    private Long userId;

    /**
     * Timestamp when action occurred
     */
    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * Additional details about the action (JSON format or plain text)
     */
    @Column(columnDefinition = "TEXT")
    private String details;

    /**
     * IP address of the user (optional)
     */
    @Column(length = 50)
    private String ipAddress;

    /**
     * Result of the action (SUCCESS, FAILED, DENIED)
     */
    @Column(length = 20)
    @Builder.Default
    private String result = "SUCCESS";
}
