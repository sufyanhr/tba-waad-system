// api/rbac.js
import axiosClient from 'api/axiosClient';

// ==================== ROLES API ====================
export const getRoles = async () => (await axiosClient.get('/admin/roles')).data;

export const getRole = async (id) => (await axiosClient.get(`/admin/roles/${id}`)).data;

export const createRole = async (data) => (await axiosClient.post('/admin/roles', data)).data;

export const updateRole = async (id, data) => (await axiosClient.put(`/admin/roles/${id}`, data)).data;

export const deleteRole = async (id) => (await axiosClient.delete(`/admin/roles/${id}`)).data;

// ==================== PERMISSIONS API ====================
export const getPermissions = async () => (await axiosClient.get('/admin/permissions')).data;

export const getPermission = async (id) => (await axiosClient.get(`/admin/permissions/${id}`)).data;

export const createPermission = async (data) => (await axiosClient.post('/admin/permissions', data)).data;

export const updatePermission = async (id, data) => (await axiosClient.put(`/admin/permissions/${id}`, data)).data;

// ==================== USERS & ASSIGNMENTS API ====================
export const getUsers = async () => (await axiosClient.get('/admin/users')).data;

export const assignRolesToUser = async (userId, roleIds) => (await axiosClient.post(`/admin/users/${userId}/roles`, { roleIds })).data;

export const assignPermissionsToRole = async (roleId, permissionIds) => (await axiosClient.post(`/admin/roles/${roleId}/permissions`, { permissionIds })).data;
