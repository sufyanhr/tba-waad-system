package com.waad.tba.rbac.service;

import com.waad.tba.core.exception.ResourceNotFoundException;
import com.waad.tba.rbac.model.Permission;
import com.waad.tba.rbac.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    @Transactional(readOnly = true)
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Permission getPermissionById(Long id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Permission getPermissionByName(String name) {
        return permissionRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with name: " + name));
    }

    @Transactional
    public Permission createPermission(Permission permission) {
        if (permissionRepository.existsByName(permission.getName())) {
            throw new DataIntegrityViolationException("Permission with name '" + permission.getName() + "' already exists");
        }
        return permissionRepository.save(permission);
    }

    @Transactional
    public Permission updatePermission(Long id, Permission permissionDetails) {
        Permission permission = getPermissionById(id);

        // Check if the new name conflicts with existing permissions (excluding current one)
        if (!permission.getName().equals(permissionDetails.getName()) && 
            permissionRepository.existsByName(permissionDetails.getName())) {
            throw new DataIntegrityViolationException("Permission with name '" + permissionDetails.getName() + "' already exists");
        }

        permission.setName(permissionDetails.getName());
        permission.setDescription(permissionDetails.getDescription());

        return permissionRepository.save(permission);
    }

    @Transactional
    public void deletePermission(Long id) {
        Permission permission = getPermissionById(id);
        
        // Check if permission is used by any roles
        if (!permission.getRoles().isEmpty()) {
            throw new DataIntegrityViolationException("Cannot delete permission that is assigned to roles");
        }
        
        permissionRepository.delete(permission);
    }

    @Transactional(readOnly = true)
    public List<Permission> getPermissionsByRoleId(Long roleId) {
        return permissionRepository.findByRoleId(roleId);
    }

    @Transactional(readOnly = true)
    public List<Permission> getPermissionsByNames(List<String> names) {
        return permissionRepository.findByNameIn(names);
    }

    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return permissionRepository.existsByName(name);
    }
}