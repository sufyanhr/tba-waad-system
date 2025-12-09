// ==============================|| MEDICAL SERVICES API - TBA DOMAIN ||============================== //
// DOMAIN NOTE: This module represents Medical Services (procedures, tests, imaging)
// Previously called "Products" in template - now aligned with TPA business domain

import apiClient from './axiosClient';

const BASE_URL = '/api/medical-services';

/**
 * Medical Services Service
 * Manages medical procedures, lab tests, imaging services, etc.
 * Used in Products UI (which displays medical services catalog)
 */
export const medicalServicesService = {
  /**
   * Get all medical services
   * @param {Object} params - Optional query parameters (search, category, etc.)
   * @returns {Promise<Array>} List of medical services
   */
  getAll: async (params = {}) => {
    return await apiClient.get(BASE_URL, { params });
  },

  /**
   * Get medical service by ID
   * @param {number} id - Medical service ID
   * @returns {Promise<Object>} Medical service details
   */
  getById: async (id) => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  /**
   * Create new medical service
   * @param {Object} data - Medical service data
   * @returns {Promise<Object>} Created medical service
   */
  create: async (data) => {
    return await apiClient.post(BASE_URL, data);
  },

  /**
   * Update medical service
   * @param {number} id - Medical service ID
   * @param {Object} data - Updated medical service data
   * @returns {Promise<Object>} Updated medical service
   */
  update: async (id, data) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  /**
   * Delete medical service
   * @param {number} id - Medical service ID
   * @returns {Promise<void>}
   */
  remove: async (id) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Search medical services
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching medical services
   */
  search: async (query) => {
    return await apiClient.get(`${BASE_URL}/search`, { params: { query } });
  },

  /**
   * Filter medical services by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Filtered medical services
   */
  getByCategory: async (category) => {
    return await apiClient.get(`${BASE_URL}/category/${category}`);
  }
};

export default medicalServicesService;
