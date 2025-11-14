package com.waad.tba.rbac.repository;

import com.waad.tba.rbac.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    
    List<UserRole> findByUserId(Long userId);
    
    List<UserRole> findByRoleId(Long roleId);
    
    @Query("SELECT ur FROM UserRole ur WHERE ur.user.id = :userId AND ur.active = true")
    List<UserRole> findActiveByUserId(Long userId);
    
    @Query("SELECT ur FROM UserRole ur WHERE ur.role.id = :roleId AND ur.active = true")
    List<UserRole> findActiveByRoleId(Long roleId);
    
    Optional<UserRole> findByUserIdAndRoleId(Long userId, Long roleId);
    
    boolean existsByUserIdAndRoleId(Long userId, Long roleId);
    
    @Modifying
    @Query("UPDATE UserRole ur SET ur.active = false WHERE ur.user.id = :userId AND ur.role.id = :roleId")
    void deactivateUserRole(Long userId, Long roleId);
    
    @Modifying
    @Query("UPDATE UserRole ur SET ur.active = true WHERE ur.user.id = :userId AND ur.role.id = :roleId")
    void activateUserRole(Long userId, Long roleId);
    
    @Query("SELECT COUNT(ur) FROM UserRole ur WHERE ur.user.id = :userId AND ur.active = true")
    long countActiveRolesByUserId(Long userId);
}