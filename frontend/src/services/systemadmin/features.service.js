import axiosServices from '../../utils/axios';

const BASE_URL = '/api/admin/features';

export const featuresService = {
  // Get all feature flags
  getAllFeatureFlags: () => {
    return axiosServices.get(BASE_URL);
  },

  // Get feature flag by key
  getFeatureFlagByKey: (key) => {
    return axiosServices.get(`${BASE_URL}/${key}`);
  },

  // Create feature flag
  createFeatureFlag: (featureFlagData) => {
    return axiosServices.post(BASE_URL, featureFlagData);
  },

  // Toggle feature flag
  toggleFeatureFlag: (key, enabled) => {
    return axiosServices.put(`${BASE_URL}/${key}/toggle`, null, {
      params: { enabled }
    });
  },

  // Update feature flag
  updateFeatureFlag: (key, featureFlagData) => {
    return axiosServices.put(`${BASE_URL}/${key}`, featureFlagData);
  },

  // Delete feature flag
  deleteFeatureFlag: (key) => {
    return axiosServices.delete(`${BASE_URL}/${key}`);
  }
};
