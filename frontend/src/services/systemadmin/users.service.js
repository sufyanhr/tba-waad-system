import axiosServices from '../../utils/axios';

const BASE_URL = '/api/admin/users';

export const usersService = {
  // Get all users (paginated)
  getAllUsers: (page = 0, size = 10) => {
    return axiosServices.get(BASE_URL, {
      params: { page, size }
    });
  },

  // Get user by ID
  getUserById: (id) => {
    return axiosServices.get(`${BASE_URL}/${id}`);
  },

  // Search users
  searchUsers: (query) => {
    return axiosServices.get(`${BASE_URL}/search`, {
      params: { q: query }
    });
  },

  // Create user
  createUser: (userData) => {
    return axiosServices.post(BASE_URL, userData);
  },

  // Update user
  updateUser: (id, userData) => {
    return axiosServices.put(`${BASE_URL}/${id}`, userData);
  },

  // Delete user
  deleteUser: (id) => {
    return axiosServices.delete(`${BASE_URL}/${id}`);
  },

  // Toggle user status
  toggleUserStatus: (id, active) => {
    return axiosServices.put(`${BASE_URL}/${id}/toggle`, null, {
      params: { active }
    });
  },

  // Reset password
  resetPassword: (id, newPassword) => {
    return axiosServices.put(`${BASE_URL}/${id}/reset-password`, {
      newPassword
    });
  },

  // Assign roles
  assignRoles: (id, roles) => {
    return axiosServices.put(`${BASE_URL}/${id}/roles`, { roles });
  },

  // Remove roles
  removeRoles: (id, roles) => {
    return axiosServices.delete(`${BASE_URL}/${id}/roles`, {
      data: { roles }
    });
  }
};
