import { useState } from 'react';
import { permissionsService } from '../../services/systemadmin/permissions.service';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [permissionMatrix, setPermissionMatrix] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all permissions
  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionsService.getAllPermissions();
      setPermissions(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  // Get permission matrix
  const fetchPermissionMatrix = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionsService.getPermissionMatrix();
      setPermissionMatrix(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch permission matrix');
    } finally {
      setLoading(false);
    }
  };

  // Search permissions
  const searchPermissions = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionsService.searchPermissions(query);
      setPermissions(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search permissions');
    } finally {
      setLoading(false);
    }
  };

  // Assign permission to role
  const assignPermissionToRole = async (roleId, permission) => {
    setLoading(true);
    setError(null);
    try {
      await permissionsService.assignPermissionToRole(roleId, permission);
      await fetchPermissionMatrix();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign permission');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove permission from role
  const removePermissionFromRole = async (roleId, permission) => {
    setLoading(true);
    setError(null);
    try {
      await permissionsService.removePermissionFromRole(roleId, permission);
      await fetchPermissionMatrix();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove permission');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get permissions for role
  const getPermissionsForRole = async (roleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionsService.getPermissionsForRole(roleId);
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch permissions for role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get effective permissions for user
  const getEffectivePermissionsForUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionsService.getEffectivePermissionsForUser(userId);
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch effective permissions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Bulk assign permissions
  const bulkAssign = async (roleId, permissions) => {
    setLoading(true);
    setError(null);
    try {
      await permissionsService.bulkAssign(roleId, permissions);
      await fetchPermissionMatrix();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to bulk assign permissions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Bulk remove permissions
  const bulkRemove = async (roleId, permissions) => {
    setLoading(true);
    setError(null);
    try {
      await permissionsService.bulkRemove(roleId, permissions);
      await fetchPermissionMatrix();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to bulk remove permissions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    permissions,
    permissionMatrix,
    loading,
    error,
    fetchPermissions,
    fetchPermissionMatrix,
    searchPermissions,
    assignPermissionToRole,
    removePermissionFromRole,
    getPermissionsForRole,
    getEffectivePermissionsForUser,
    bulkAssign,
    bulkRemove
  };
};
