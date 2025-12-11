import axiosServices from '../../utils/axios';

const BASE_URL = '/api/admin/roles';

export const rolesService = {
  // Get all roles
  getAllRoles: () => {
    return axiosServices.get(BASE_URL);
  },

  // Get role by ID
  getRoleById: (id) => {
    return axiosServices.get(`${BASE_URL}/${id}`);
  },

  // Get role by name
  getRoleByName: (name) => {
    return axiosServices.get(`${BASE_URL}/name/${name}`);
  },

  // Search roles
  searchRoles: (query) => {
    return axiosServices.get(`${BASE_URL}/search`, {
      params: { q: query }
    });
  },

  // Create role
  createRole: (roleData) => {
    return axiosServices.post(BASE_URL, roleData);
  },

  // Update role
  updateRole: (id, roleData) => {
    return axiosServices.put(`${BASE_URL}/${id}`, roleData);
  },

  // Delete role
  deleteRole: (id) => {
    return axiosServices.delete(`${BASE_URL}/${id}`);
  },

  // Get users with role
  getUsersWithRole: (id) => {
    return axiosServices.get(`${BASE_URL}/${id}/users`);
  },

  // Assign permissions
  assignPermissions: (id, permissions) => {
    return axiosServices.put(`${BASE_URL}/${id}/permissions`, {
      permissions
    });
  },

  // Remove permissions
  removePermissions: (id, permissions) => {
    return axiosServices.delete(`${BASE_URL}/${id}/permissions`, {
      data: { permissions }
    });
  }
};
