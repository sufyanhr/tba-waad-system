/**
 * Role Management Service
 * Responsible for: Role-user relationships and role-permission assignments
 * Backend: RoleManagementController (/api/admin/role-management)
 * 
 * This service handles ONLY role relationship management.
 * For role CRUD operations, use roles.service.js (RBAC module)
 */

import axiosServices from '../../utils/axios';

const BASE_URL = '/admin/role-management';

export const roleManagementService = {
  /**
   * Get users with specific role
   * GET /api/admin/role-management/{id}/users
   */
  getUsersWithRole: (roleId) => {
    return axiosServices.get(`${BASE_URL}/${roleId}/users`);
  },

  /**
   * Assign permissions to role
   * PUT /api/admin/role-management/{id}/permissions
   */
  assignPermissions: (roleId, permissionNames) => {
    return axiosServices.put(`${BASE_URL}/${roleId}/permissions`, {
      permissions: permissionNames
    });
  },

  /**
   * Remove permissions from role
   * DELETE /api/admin/role-management/{id}/permissions
   */
  removePermissions: (roleId, permissionNames) => {
    return axiosServices.delete(`${BASE_URL}/${roleId}/permissions`, {
      data: { permissions: permissionNames }
    });
  }
};

export default roleManagementService;
