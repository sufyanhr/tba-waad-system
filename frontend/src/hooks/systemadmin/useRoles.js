import { useState } from 'react';
import { rolesService } from '../../services/systemadmin/roles.service';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all roles
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesService.getAllRoles();
      setRoles(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  // Get role by ID
  const getRoleById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesService.getRoleById(id);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get role by name
  const getRoleByName = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesService.getRoleByName(name);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search roles
  const searchRoles = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesService.searchRoles(query);
      setRoles(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search roles');
    } finally {
      setLoading(false);
    }
  };

  // Create role
  const createRole = async (roleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesService.createRole(roleData);
      await fetchRoles();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update role
  const updateRole = async (id, roleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesService.updateRole(id, roleData);
      await fetchRoles();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete role
  const deleteRole = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await rolesService.deleteRole(id);
      await fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get users with role
  const getUsersWithRole = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesService.getUsersWithRole(id);
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users with role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Assign permissions
  const assignPermissions = async (id, permissions) => {
    setLoading(true);
    setError(null);
    try {
      await rolesService.assignPermissions(id, permissions);
      await fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign permissions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove permissions
  const removePermissions = async (id, permissions) => {
    setLoading(true);
    setError(null);
    try {
      await rolesService.removePermissions(id, permissions);
      await fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove permissions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    loading,
    error,
    fetchRoles,
    getRoleById,
    getRoleByName,
    searchRoles,
    createRole,
    updateRole,
    deleteRole,
    getUsersWithRole,
    assignPermissions,
    removePermissions
  };
};
