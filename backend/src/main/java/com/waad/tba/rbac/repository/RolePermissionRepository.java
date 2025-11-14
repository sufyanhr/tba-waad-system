package com.waad.tba.rbac.repository;

import com.waad.tba.rbac.model.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    
    List<RolePermission> findByRoleId(Long roleId);
    
    List<RolePermission> findByPermissionId(Long permissionId);
    
    @Query("SELECT rp FROM RolePermission rp WHERE rp.role.id = :roleId AND rp.active = true")
    List<RolePermission> findActiveByRoleId(Long roleId);
    
    @Query("SELECT rp FROM RolePermission rp WHERE rp.permission.id = :permissionId AND rp.active = true")
    List<RolePermission> findActiveByPermissionId(Long permissionId);
    
    Optional<RolePermission> findByRoleIdAndPermissionId(Long roleId, Long permissionId);
    
    boolean existsByRoleIdAndPermissionId(Long roleId, Long permissionId);
    
    @Modifying
    @Query("UPDATE RolePermission rp SET rp.active = false WHERE rp.role.id = :roleId AND rp.permission.id = :permissionId")
    void deactivateRolePermission(Long roleId, Long permissionId);
    
    @Modifying
    @Query("UPDATE RolePermission rp SET rp.active = true WHERE rp.role.id = :roleId AND rp.permission.id = :permissionId")
    void activateRolePermission(Long roleId, Long permissionId);
    
    @Query("SELECT COUNT(rp) FROM RolePermission rp WHERE rp.role.id = :roleId AND rp.active = true")
    long countActivePermissionsByRoleId(Long roleId);
}