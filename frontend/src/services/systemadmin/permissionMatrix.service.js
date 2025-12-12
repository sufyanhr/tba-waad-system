/**
 * Permission Matrix Service
 * Responsible for: Permission matrix and role-permission assignments
 * Backend: PermissionMatrixController (/api/admin/permission-matrix)
 * 
 * This service handles ONLY permission matrix operations and role-permission assignments.
 * For permission CRUD operations, use permissions.service.js (RBAC module)
 */

import axiosServices from '../../utils/axios';

const BASE_URL = '/admin/permission-matrix';

export const permissionMatrixService = {
  /**
   * Get permission matrix (all roles × all permissions)
   * GET /api/admin/permission-matrix
   */
  getPermissionMatrix: () => {
    return axiosServices.get(BASE_URL);
  },

  /**
   * Assign permission to role
   * POST /api/admin/permission-matrix/assign
   */
  assignPermissionToRole: (roleId, permissionId) => {
    return axiosServices.post(`${BASE_URL}/assign`, {
      roleId,
      permissionId
    });
  },

  /**
   * Remove permission from role
   * POST /api/admin/permission-matrix/remove
   */
  removePermissionFromRole: (roleId, permissionId) => {
    return axiosServices.post(`${BASE_URL}/remove`, {
      roleId,
      permissionId
    });
  },

  /**
   * Get permissions for specific role
   * GET /api/admin/permission-matrix/role/{roleId}
   */
  getPermissionsForRole: (roleId) => {
    return axiosServices.get(`${BASE_URL}/role/${roleId}`);
  },

  /**
   * Get effective permissions for user (aggregated from all roles)
   * GET /api/admin/permission-matrix/user/{userId}
   */
  getEffectivePermissionsForUser: (userId) => {
    return axiosServices.get(`${BASE_URL}/user/${userId}`);
  },

  /**
   * Bulk assign permissions to role
   * POST /api/admin/permission-matrix/bulk-assign
   */
  bulkAssignPermissions: (roleId, permissionIds) => {
    return axiosServices.post(`${BASE_URL}/bulk-assign`, {
      roleId,
      permissionIds
    });
  },

  /**
   * Bulk remove permissions from role
   * POST /api/admin/permission-matrix/bulk-remove
   */
  bulkRemovePermissions: (roleId, permissionIds) => {
    return axiosServices.post(`${BASE_URL}/bulk-remove`, {
      roleId,
      permissionIds
    });
  }
};

export default permissionMatrixService;

