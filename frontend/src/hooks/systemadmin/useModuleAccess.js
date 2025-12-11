import { useState } from 'react';
import { modulesService } from '../../services/systemadmin/modules.service';

export const useModuleAccess = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all modules
  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.getAllModules();
      setModules(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  // Get active modules
  const getActiveModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.getActiveModules();
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch active modules');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get module by ID
  const getModuleById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.getModuleById(id);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch module');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get module by key
  const getModuleByKey = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.getModuleByKey(key);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch module');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create module
  const createModule = async (moduleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.createModule(moduleData);
      await fetchModules();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create module');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update module
  const updateModule = async (id, moduleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.updateModule(id, moduleData);
      await fetchModules();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update module');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete module
  const deleteModule = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await modulesService.deleteModule(id);
      await fetchModules();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete module');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle module status
  const toggleModuleStatus = async (id, active) => {
    setLoading(true);
    setError(null);
    try {
      await modulesService.toggleModuleStatus(id, active);
      await fetchModules();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle module status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update module access
  const updateModuleAccess = async (id, allowedRoles, requiredPermissions) => {
    setLoading(true);
    setError(null);
    try {
      await modulesService.updateModuleAccess(id, allowedRoles, requiredPermissions);
      await fetchModules();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update module access');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get modules for role
  const getModulesForRole = async (roleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.getModulesForRole(roleId);
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch modules for role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get modules by feature flag
  const getModulesByFeatureFlag = async (featureFlagKey) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.getModulesByFeatureFlag(featureFlagKey);
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch modules by feature flag');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    modules,
    loading,
    error,
    fetchModules,
    getActiveModules,
    getModuleById,
    getModuleByKey,
    createModule,
    updateModule,
    deleteModule,
    toggleModuleStatus,
    updateModuleAccess,
    getModulesForRole,
    getModulesByFeatureFlag
  };
};
