/**
 * User Management Service
 * Responsible for: User account operations (status, password, roles)
 * Backend: UserManagementController (/api/admin/user-management)
 * 
 * This service handles ONLY user account management.
 * For user CRUD operations, use users.service.js (RBAC module)
 */

import axiosServices from '../../utils/axios';

const BASE_URL = '/admin/user-management';

export const userManagementService = {
  /**
   * Toggle user active status
   * PUT /api/admin/user-management/{id}/toggle
   */
  toggleUserStatus: (id) => {
    return axiosServices.put(`${BASE_URL}/${id}/toggle`);
  },

  /**
   * Reset user password
   * PUT /api/admin/user-management/{id}/reset-password
   */
  resetPassword: (id, passwordData) => {
    return axiosServices.put(`${BASE_URL}/${id}/reset-password`, passwordData);
  },

  /**
   * Assign roles to user
   * PUT /api/admin/user-management/{id}/roles
   */
  assignRoles: (id, roleNames) => {
    return axiosServices.put(`${BASE_URL}/${id}/roles`, { roleNames });
  },

  /**
   * Remove roles from user
   * DELETE /api/admin/user-management/{id}/roles
   */
  removeRoles: (id, roleNames) => {
    return axiosServices.delete(`${BASE_URL}/${id}/roles`, {
      data: { roleNames }
    });
  }
};

export default userManagementService;
