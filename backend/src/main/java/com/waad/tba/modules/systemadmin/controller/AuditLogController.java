package com.waad.tba.modules.systemadmin.controller;

import com.waad.tba.common.dto.ResponseDto;
import com.waad.tba.modules.systemadmin.entity.AuditLog;
import com.waad.tba.modules.systemadmin.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Audit Log Controller
 * Phase 2 - System Administration
 * 
 * Manages audit logs (SUPER_ADMIN only)
 * Base Path: /api/admin/audit
 */
@RestController
@RequestMapping("/api/admin/audit")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "System Admin - Audit Log", description = "Audit log management (SUPER_ADMIN only)")
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * GET /api/admin/audit
     * Get all audit logs (paginated)
     */
    @GetMapping
    @Operation(summary = "Get all audit logs", description = "Retrieve all audit logs with pagination")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved audit logs"),
        @ApiResponse(responseCode = "403", description = "Access denied - SUPER_ADMIN only")
    })
    public ResponseEntity<ResponseDto<Page<AuditLog>>> getAllAuditLogs(Pageable pageable) {
        log.info("GET /api/admin/audit - Get all audit logs (page {})", pageable.getPageNumber());
        
        Page<AuditLog> logs = auditLogService.getAllAuditLogs(pageable);
        
        return ResponseEntity.ok(ResponseDto.<Page<AuditLog>>builder()
                .success(true)
                .message("Audit logs retrieved successfully")
                .data(logs)
                .build());
    }

    /**
     * GET /api/admin/audit/user/{userId}
     * Get audit logs by user ID
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get audit logs by user", description = "Retrieve audit logs for specific user")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Audit logs retrieved successfully")
    })
    public ResponseEntity<ResponseDto<Page<AuditLog>>> getAuditLogsByUser(
            @PathVariable Long userId,
            Pageable pageable) {
        
        log.info("GET /api/admin/audit/user/{} - Get audit logs by user", userId);
        
        Page<AuditLog> logs = auditLogService.getAuditLogsByUser(userId, pageable);
        
        return ResponseEntity.ok(ResponseDto.<Page<AuditLog>>builder()
                .success(true)
                .message("User audit logs retrieved successfully")
                .data(logs)
                .build());
    }

    /**
     * GET /api/admin/audit/entity/{entityType}/{entityId}
     * Get audit logs by entity
     */
    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Get audit logs by entity", description = "Retrieve audit logs for specific entity")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Audit logs retrieved successfully")
    })
    public ResponseEntity<ResponseDto<Page<AuditLog>>> getAuditLogsByEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            Pageable pageable) {
        
        log.info("GET /api/admin/audit/entity/{}/{} - Get audit logs by entity", entityType, entityId);
        
        Page<AuditLog> logs = auditLogService.getAuditLogsByEntity(entityType, entityId, pageable);
        
        return ResponseEntity.ok(ResponseDto.<Page<AuditLog>>builder()
                .success(true)
                .message("Entity audit logs retrieved successfully")
                .data(logs)
                .build());
    }

    /**
     * GET /api/admin/audit/actions
     * Get all distinct action types
     */
    @GetMapping("/actions")
    @Operation(summary = "Get all action types", description = "Retrieve all distinct action types from audit logs")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Action types retrieved successfully")
    })
    public ResponseEntity<ResponseDto<List<String>>> getAllActionTypes() {
        log.info("GET /api/admin/audit/actions - Get all action types");
        
        List<String> actions = auditLogService.getAllActionTypes();
        
        return ResponseEntity.ok(ResponseDto.<List<String>>builder()
                .success(true)
                .message("Action types retrieved successfully")
                .data(actions)
                .build());
    }

    /**
     * GET /api/admin/audit/action/{action}
     * Get audit logs by action type
     */
    @GetMapping("/action/{action}")
    @Operation(summary = "Get audit logs by action", description = "Retrieve audit logs for specific action type")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Audit logs retrieved successfully")
    })
    public ResponseEntity<ResponseDto<Page<AuditLog>>> getAuditLogsByAction(
            @PathVariable String action,
            Pageable pageable) {
        
        log.info("GET /api/admin/audit/action/{} - Get audit logs by action", action);
        
        Page<AuditLog> logs = auditLogService.getAuditLogsByAction(action, pageable);
        
        return ResponseEntity.ok(ResponseDto.<Page<AuditLog>>builder()
                .success(true)
                .message("Action audit logs retrieved successfully")
                .data(logs)
                .build());
    }
}
