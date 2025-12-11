import axiosServices from '../../utils/axios';

const BASE_URL = '/api/admin/modules';

export const modulesService = {
  // Get all modules
  getAllModules: () => {
    return axiosServices.get(BASE_URL);
  },

  // Get active modules
  getActiveModules: () => {
    return axiosServices.get(`${BASE_URL}/active`);
  },

  // Get module by ID
  getModuleById: (id) => {
    return axiosServices.get(`${BASE_URL}/${id}`);
  },

  // Get module by key
  getModuleByKey: (key) => {
    return axiosServices.get(`${BASE_URL}/key/${key}`);
  },

  // Create module
  createModule: (moduleData) => {
    return axiosServices.post(BASE_URL, moduleData);
  },

  // Update module
  updateModule: (id, moduleData) => {
    return axiosServices.put(`${BASE_URL}/${id}`, moduleData);
  },

  // Delete module
  deleteModule: (id) => {
    return axiosServices.delete(`${BASE_URL}/${id}`);
  },

  // Toggle module status
  toggleModuleStatus: (id, active) => {
    return axiosServices.put(`${BASE_URL}/${id}/toggle`, null, {
      params: { active }
    });
  },

  // Update module access
  updateModuleAccess: (id, allowedRoles, requiredPermissions) => {
    return axiosServices.put(`${BASE_URL}/${id}/access`, {
      allowedRoles,
      requiredPermissions
    });
  },

  // Get modules for role
  getModulesForRole: (roleId) => {
    return axiosServices.get(`${BASE_URL}/role/${roleId}`);
  },

  // Get modules by feature flag
  getModulesByFeatureFlag: (featureFlagKey) => {
    return axiosServices.get(`${BASE_URL}/feature/${featureFlagKey}`);
  }
};
