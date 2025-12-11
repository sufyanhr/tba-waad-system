import { useState } from 'react';
import { featuresService } from '../../services/systemadmin/features.service';

export const useFeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all feature flags
  const fetchFeatureFlags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await featuresService.getAllFeatureFlags();
      setFeatureFlags(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feature flags');
    } finally {
      setLoading(false);
    }
  };

  // Get feature flag by key
  const getFeatureFlagByKey = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const response = await featuresService.getFeatureFlagByKey(key);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feature flag');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create feature flag
  const createFeatureFlag = async (featureFlagData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await featuresService.createFeatureFlag(featureFlagData);
      await fetchFeatureFlags();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create feature flag');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle feature flag
  const toggleFeatureFlag = async (key, enabled) => {
    setLoading(true);
    setError(null);
    try {
      await featuresService.toggleFeatureFlag(key, enabled);
      await fetchFeatureFlags();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle feature flag');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update feature flag
  const updateFeatureFlag = async (key, featureFlagData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await featuresService.updateFeatureFlag(key, featureFlagData);
      await fetchFeatureFlags();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update feature flag');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete feature flag
  const deleteFeatureFlag = async (key) => {
    setLoading(true);
    setError(null);
    try {
      await featuresService.deleteFeatureFlag(key);
      await fetchFeatureFlags();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete feature flag');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    featureFlags,
    loading,
    error,
    fetchFeatureFlags,
    getFeatureFlagByKey,
    createFeatureFlag,
    toggleFeatureFlag,
    updateFeatureFlag,
    deleteFeatureFlag
  };
};
