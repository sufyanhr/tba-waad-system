package com.waad.tba.modules.systemadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Role View/Response
 * Phase 2 - System Administration - Role Management
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleViewDto {
    
    private Long id;
    private String name;
    private String description;
    private List<String> permissions;
    private Integer userCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
