package com.waad.tba.modules.audit.service;

import com.waad.tba.modules.audit.entity.AuditLog;
import com.waad.tba.modules.audit.repository.AuditLogRepository;
import com.waad.tba.modules.rbac.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Audit Trail Service - Phase 8.2
 * 
 * Provides centralized audit logging for all sensitive operations.
 * Logs are written asynchronously to avoid performance impact.
 * 
 * @author TBA WAAD System
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditTrailService {

    private final AuditLogRepository repository;

    /**
     * Log a view operation (accessing sensitive data)
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logView(String entityType, Long entityId, User user) {
        if (user == null) {
            log.warn("Cannot log view: user is null");
            return;
        }

        try {
            AuditLog auditLog = AuditLog.builder()
                    .action("VIEW_" + entityType.toUpperCase())
                    .entityType(entityType)
                    .entityId(entityId)
                    .username(user.getUsername())
                    .userId(user.getId())
                    .timestamp(LocalDateTime.now())
                    .details(String.format("User %s (ID=%d) viewed %s (ID=%d)", 
                            user.getUsername(), user.getId(), entityType, entityId))
                    .result("SUCCESS")
                    .build();

            repository.save(auditLog);
            log.debug("Audit log created: {} {} by {}", auditLog.getAction(), entityId, user.getUsername());
        } catch (Exception e) {
            log.error("Failed to create audit log for view operation", e);
        }
    }

    /**
     * Log a generic action with custom details
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(String action, String entityType, Long entityId, User user, String details) {
        if (user == null) {
            log.warn("Cannot log action: user is null");
            return;
        }

        try {
            AuditLog auditLog = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .username(user.getUsername())
                    .userId(user.getId())
                    .timestamp(LocalDateTime.now())
                    .details(details)
                    .result("SUCCESS")
                    .build();

            repository.save(auditLog);
            log.debug("Audit log created: {} by {}", action, user.getUsername());
        } catch (Exception e) {
            log.error("Failed to create audit log for action: {}", action, e);
        }
    }

    /**
     * Log claim approval
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logClaimApproval(Long claimId, User user, String approvedAmount) {
        logAction(
            "APPROVE_CLAIM",
            "Claim",
            claimId,
            user,
            String.format("User %s (ID=%d) approved Claim (ID=%d) with amount %s", 
                    user.getUsername(), user.getId(), claimId, approvedAmount)
        );
    }

    /**
     * Log claim rejection
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logClaimRejection(Long claimId, User user, String reason) {
        logAction(
            "REJECT_CLAIM",
            "Claim",
            claimId,
            user,
            String.format("User %s (ID=%d) rejected Claim (ID=%d) - Reason: %s", 
                    user.getUsername(), user.getId(), claimId, reason)
        );
    }

    /**
     * Log claim creation
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logClaimCreation(Long claimId, User user, String claimNumber) {
        logAction(
            "CREATE_CLAIM",
            "Claim",
            claimId,
            user,
            String.format("User %s (ID=%d) created Claim (ID=%d, Number=%s)", 
                    user.getUsername(), user.getId(), claimId, claimNumber)
        );
    }

    /**
     * Log login success
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logLoginSuccess(String username, Long userId) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .action("LOGIN_SUCCESS")
                    .entityType("User")
                    .entityId(userId)
                    .username(username)
                    .userId(userId)
                    .timestamp(LocalDateTime.now())
                    .details(String.format("User %s (ID=%d) logged in successfully", username, userId))
                    .result("SUCCESS")
                    .build();

            repository.save(auditLog);
            log.debug("Audit log created: LOGIN_SUCCESS for {}", username);
        } catch (Exception e) {
            log.error("Failed to create audit log for login", e);
        }
    }

    /**
     * Log access denied event
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAccessDenied(String action, String entityType, Long entityId, User user, String reason) {
        if (user == null) {
            log.warn("Cannot log access denied: user is null");
            return;
        }

        try {
            AuditLog auditLog = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .username(user.getUsername())
                    .userId(user.getId())
                    .timestamp(LocalDateTime.now())
                    .details(String.format("Access denied: User %s (ID=%d) attempted to %s %s (ID=%d) - %s", 
                            user.getUsername(), user.getId(), action, entityType, entityId, reason))
                    .result("DENIED")
                    .build();

            repository.save(auditLog);
            log.debug("Audit log created: ACCESS_DENIED for {} by {}", action, user.getUsername());
        } catch (Exception e) {
            log.error("Failed to create audit log for access denied", e);
        }
    }
}
