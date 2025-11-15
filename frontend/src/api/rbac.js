// api/rbac.js
import axios from 'utils/axios';

// ==================== ROLES API ====================
export const getRoles = async () => {
  const response = await axios.get('/api/admin/roles');
  return response.data;
};

export const getRole = async (id) => {
  const response = await axios.get(`/api/admin/roles/${id}`);
  return response.data;
};

export const createRole = async (data) => {
  const response = await axios.post('/api/admin/roles', data);
  return response.data;
};

export const updateRole = async (id, data) => {
  const response = await axios.put(`/api/admin/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id) => {
  const response = await axios.delete(`/api/admin/roles/${id}`);
  return response.data;
};

// ==================== PERMISSIONS API ====================
export const getPermissions = async () => {
  const response = await axios.get('/api/admin/permissions');
  return response.data;
};

export const getPermission = async (id) => {
  const response = await axios.get(`/api/admin/permissions/${id}`);
  return response.data;
};

export const createPermission = async (data) => {
  const response = await axios.post('/api/admin/permissions', data);
  return response.data;
};

export const updatePermission = async (id, data) => {
  const response = await axios.put(`/api/admin/permissions/${id}`, data);
  return response.data;
};

// ==================== USERS & ASSIGNMENTS API ====================
export const getUsers = async () => {
  const response = await axios.get('/api/admin/users');
  return response.data;
};

export const assignRolesToUser = async (userId, roleIds) => {
  const response = await axios.post(`/api/admin/users/${userId}/roles`, {
    roleIds
  });
  return response.data;
};

export const assignPermissionsToRole = async (roleId, permissionIds) => {
  const response = await axios.post(`/api/admin/roles/${roleId}/permissions`, {
    permissionIds
  });
  return response.data;
};