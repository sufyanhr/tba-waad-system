package com.waad.tba.rbac.service;

import com.waad.tba.core.exception.ResourceNotFoundException;
import com.waad.tba.rbac.model.Permission;
import com.waad.tba.rbac.model.Role;
import com.waad.tba.rbac.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionService permissionService;

    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Role getRoleByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with name: " + name));
    }

    @Transactional
    public Role createRole(Role role) {
        if (roleRepository.existsByName(role.getName())) {
            throw new DataIntegrityViolationException("Role with name '" + role.getName() + "' already exists");
        }
        return roleRepository.save(role);
    }

    @Transactional
    public Role updateRole(Long id, Role roleDetails) {
        Role role = getRoleById(id);

        // Check if the new name conflicts with existing roles (excluding current one)
        if (!role.getName().equals(roleDetails.getName()) && 
            roleRepository.existsByName(roleDetails.getName())) {
            throw new DataIntegrityViolationException("Role with name '" + roleDetails.getName() + "' already exists");
        }

        role.setName(roleDetails.getName());
        role.setDescription(roleDetails.getDescription());

        return roleRepository.save(role);
    }

    @Transactional
    public void deleteRole(Long id) {
        Role role = getRoleById(id);
        
        // Check if role is assigned to any users
        if (!role.getUserRoles().isEmpty()) {
            throw new DataIntegrityViolationException("Cannot delete role that is assigned to users");
        }
        
        roleRepository.delete(role);
    }

    @Transactional
    public Role addPermissionToRole(Long roleId, Long permissionId) {
        Role role = getRoleById(roleId);
        Permission permission = permissionService.getPermissionById(permissionId);

        role.addPermission(permission);
        return roleRepository.save(role);
    }

    @Transactional
    public Role removePermissionFromRole(Long roleId, Long permissionId) {
        Role role = getRoleById(roleId);
        Permission permission = permissionService.getPermissionById(permissionId);

        role.removePermission(permission);
        return roleRepository.save(role);
    }

    @Transactional
    public Role setRolePermissions(Long roleId, Set<Long> permissionIds) {
        Role role = getRoleById(roleId);

        // Clear existing permissions
        role.getPermissions().clear();

        // Add new permissions
        for (Long permissionId : permissionIds) {
            Permission permission = permissionService.getPermissionById(permissionId);
            role.addPermission(permission);
        }

        return roleRepository.save(role);
    }

    @Transactional(readOnly = true)
    public List<Role> getActiveRolesByUserId(Long userId) {
        return roleRepository.findActiveRolesByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Role> getRolesByPermissionId(Long permissionId) {
        return roleRepository.findByPermissionId(permissionId);
    }

    @Transactional(readOnly = true)
    public List<Role> getRolesByNames(List<String> names) {
        return roleRepository.findByNameIn(names);
    }

    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return roleRepository.existsByName(name);
    }
}