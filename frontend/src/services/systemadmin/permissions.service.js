import axiosServices from '../../utils/axios';

const BASE_URL = '/api/admin/permissions';

export const permissionsService = {
  // Get all permissions
  getAllPermissions: () => {
    return axiosServices.get(BASE_URL);
  },

  // Get permission matrix
  getPermissionMatrix: () => {
    return axiosServices.get(`${BASE_URL}/matrix`);
  },

  // Search permissions
  searchPermissions: (query) => {
    return axiosServices.get(`${BASE_URL}/search`, {
      params: { q: query }
    });
  },

  // Assign permission to role
  assignPermissionToRole: (roleId, permission) => {
    return axiosServices.post(`${BASE_URL}/assign`, {
      roleId,
      permission
    });
  },

  // Remove permission from role
  removePermissionFromRole: (roleId, permission) => {
    return axiosServices.post(`${BASE_URL}/remove`, {
      roleId,
      permission
    });
  },

  // Get permissions for role
  getPermissionsForRole: (roleId) => {
    return axiosServices.get(`${BASE_URL}/role/${roleId}`);
  },

  // Get effective permissions for user
  getEffectivePermissionsForUser: (userId) => {
    return axiosServices.get(`${BASE_URL}/user/${userId}`);
  },

  // Bulk assign permissions
  bulkAssign: (roleId, permissions) => {
    return axiosServices.post(`${BASE_URL}/bulk-assign`, {
      roleId,
      permissions
    });
  },

  // Bulk remove permissions
  bulkRemove: (roleId, permissions) => {
    return axiosServices.post(`${BASE_URL}/bulk-remove`, {
      roleId,
      permissions
    });
  }
};
