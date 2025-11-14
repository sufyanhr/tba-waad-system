package com.waad.tba.rbac.repository;

import com.waad.tba.rbac.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    Optional<Role> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT r FROM Role r WHERE r.name IN :names")
    List<Role> findByNameIn(List<String> names);
    
    @Query("SELECT r FROM Role r JOIN r.userRoles ur WHERE ur.user.id = :userId AND ur.active = true")
    List<Role> findActiveRolesByUserId(Long userId);
    
    @Query("SELECT r FROM Role r JOIN r.permissions p WHERE p.id = :permissionId")
    List<Role> findByPermissionId(Long permissionId);
}