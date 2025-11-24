import apiClient from './axiosClient';

// ==============================|| MEDICAL CATEGORIES SERVICE ||============================== //

const BASE_URL = '/api/medical-categories';

/**
 * Medical Categories Service
 * Manages medical service categories for TPA system
 * Categories: Lab Tests, Radiology, Dental, Surgery, Emergency, OP, IP, Consultation, Pathology, Procedures
 */
const medicalCategoriesService = {
  /**
   * Get all medical categories
   * @returns {Promise<Array>} List of medical categories
   */
  getAll: async () => {
    try {
      const data = await apiClient.get(BASE_URL);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('[Medical Categories Service] Failed to fetch categories:', error);
      return []; // Graceful fallback
    }
  },

  /**
   * Get medical category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Medical category details
   */
  getById: async (id) => {
    try {
      return await apiClient.get(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`[Medical Categories Service] Failed to fetch category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get medical category by code
   * @param {string} code - Category code (e.g., LAB, RAD, DENT)
   * @returns {Promise<Object>} Medical category details
   */
  getByCode: async (code) => {
    try {
      return await apiClient.get(`${BASE_URL}/code/${code}`);
    } catch (error) {
      console.error(`[Medical Categories Service] Failed to fetch category by code ${code}:`, error);
      throw error;
    }
  },

  /**
   * Create new medical category
   * @param {Object} data - Category data
   * @param {string} data.code - Unique category code
   * @param {string} data.nameAr - Arabic name
   * @param {string} data.nameEn - English name
   * @param {string} [data.description] - Optional description
   * @returns {Promise<Object>} Created category
   */
  create: async (data) => {
    try {
      return await apiClient.post(BASE_URL, data);
    } catch (error) {
      console.error('[Medical Categories Service] Failed to create category:', error);
      throw error;
    }
  },

  /**
   * Update medical category
   * @param {number} id - Category ID
   * @param {Object} data - Updated category data
   * @returns {Promise<Object>} Updated category
   */
  update: async (id, data) => {
    try {
      return await apiClient.put(`${BASE_URL}/${id}`, data);
    } catch (error) {
      console.error(`[Medical Categories Service] Failed to update category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete medical category
   * @param {number} id - Category ID
   * @returns {Promise<void>}
   * @throws {Error} If category has associated medical services
   */
  remove: async (id) => {
    try {
      return await apiClient.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`[Medical Categories Service] Failed to delete category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get categories formatted for dropdown/select options
   * @returns {Promise<Array>} Array of { value, label, labelAr, labelEn } objects
   */
  getOptions: async () => {
    try {
      const categories = await medicalCategoriesService.getAll();
      return categories.map(cat => ({
        value: cat.id,
        label: cat.nameEn || cat.nameAr,
        labelAr: cat.nameAr,
        labelEn: cat.nameEn,
        code: cat.code
      }));
    } catch (error) {
      console.error('[Medical Categories Service] Failed to fetch category options:', error);
      return [];
    }
  }
};

export default medicalCategoriesService;
