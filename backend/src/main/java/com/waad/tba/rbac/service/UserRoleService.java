package com.waad.tba.rbac.service;

import com.waad.tba.core.exception.ResourceNotFoundException;
import com.waad.tba.rbac.model.Role;
import com.waad.tba.security.model.User;
import com.waad.tba.rbac.model.UserRole;
import com.waad.tba.rbac.repository.UserRoleRepository;
import com.waad.tba.security.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;
    private final UserService userService;
    private final RoleService roleService;

    @Transactional(readOnly = true)
    public List<UserRole> getAllUserRoles() {
        return userRoleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public UserRole getUserRoleById(Long id) {
        return userRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserRole not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<UserRole> getUserRolesByUserId(Long userId) {
        return userRoleRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<UserRole> getActiveUserRolesByUserId(Long userId) {
        return userRoleRepository.findActiveByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<UserRole> getUserRolesByRoleId(Long roleId) {
        return userRoleRepository.findByRoleId(roleId);
    }

    @Transactional(readOnly = true)
    public List<UserRole> getActiveUserRolesByRoleId(Long roleId) {
        return userRoleRepository.findActiveByRoleId(roleId);
    }

    @Transactional
    public UserRole assignRoleToUser(Long userId, Long roleId) {
        User user = userService.getUserById(userId);
        Role role = roleService.getRoleById(roleId);

        if (userRoleRepository.existsByUserIdAndRoleId(userId, roleId)) {
            throw new DataIntegrityViolationException("User already has this role assigned");
        }

        UserRole userRole = new UserRole(user, role);
        return userRoleRepository.save(userRole);
    }

    @Transactional
    public void removeRoleFromUser(Long userId, Long roleId) {
        UserRole userRole = userRoleRepository.findByUserIdAndRoleId(userId, roleId)
                .orElseThrow(() -> new ResourceNotFoundException("UserRole not found for user " + userId + " and role " + roleId));
        
        userRoleRepository.delete(userRole);
    }

    @Transactional
    public UserRole activateUserRole(Long id) {
        UserRole userRole = getUserRoleById(id);
        userRole.setActive(true);
        return userRoleRepository.save(userRole);
    }

    @Transactional
    public UserRole deactivateUserRole(Long id) {
        UserRole userRole = getUserRoleById(id);
        userRole.setActive(false);
        return userRoleRepository.save(userRole);
    }

    @Transactional
    public void setUserRoles(Long userId, Set<Long> roleIds) {
        // Remove all existing roles for the user
        List<UserRole> existingUserRoles = userRoleRepository.findByUserId(userId);
        userRoleRepository.deleteAll(existingUserRoles);

        // Add new roles
        for (Long roleId : roleIds) {
            assignRoleToUser(userId, roleId);
        }
    }

    @Transactional(readOnly = true)
    public List<Role> getActiveRolesByUserId(Long userId) {
        return userRoleRepository.findActiveByUserId(userId)
                .stream()
                .map(UserRole::getRole)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countActiveRolesByUserId(Long userId) {
        return userRoleRepository.countActiveRolesByUserId(userId);
    }

    @Transactional(readOnly = true)
    public boolean userHasRole(Long userId, String roleName) {
        return userRoleRepository.findActiveByUserId(userId)
                .stream()
                .anyMatch(userRole -> userRole.getRole().getName().equals(roleName));
    }

    @Transactional(readOnly = true)
    public boolean userHasAnyRole(Long userId, List<String> roleNames) {
        return userRoleRepository.findActiveByUserId(userId)
                .stream()
                .anyMatch(userRole -> roleNames.contains(userRole.getRole().getName()));
    }
}