import axiosServices from 'utils/axios';

/**
 * Medical Categories Service
 * Handles all medical category-related API operations
 */

const BASE_URL = '/medical-categories';

class MedicalCategoriesService {
  /**
   * List all medical categories with pagination
   * @param {Object} params - { page, size, search, sortBy, sortDir }
   * @returns {Promise}
   */
  async list(params = {}) {
    try {
      const response = await axiosServices.get(BASE_URL, { params });
      return {
        success: true,
        data: response.data?.data || {},
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch medical categories',
        data: null
      };
    }
  }

  /**
   * Get medical category by ID
   * @param {number} id - Medical category ID
   * @returns {Promise}
   */
  async get(id) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch medical category',
        data: null
      };
    }
  }

  /**
   * Create new medical category
   * @param {Object} data - Medical category data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Medical category created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create medical category',
        data: null
      };
    }
  }

  /**
   * Update medical category
   * @param {number} id - Medical category ID
   * @param {Object} data - Updated medical category data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Medical category updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update medical category',
        data: null
      };
    }
  }

  /**
   * Delete medical category
   * @param {number} id - Medical category ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Medical category deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete medical category',
        data: null
      };
    }
  }

  /**
   * Get active medical categories
   * @returns {Promise}
   */
  async getActive() {
    try {
      const response = await axiosServices.get(`${BASE_URL}/active`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch active medical categories',
        data: []
      };
    }
  }

  /**
   * Get total count of medical categories
   * @returns {Promise}
   */
  async count() {
    try {
      const response = await axiosServices.get(`${BASE_URL}/count`);
      return {
        success: true,
        data: response.data?.data || 0,
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch count',
        data: 0
      };
    }
  }

  /**
   * Get all medical categories (no pagination)
   * @returns {Promise}
   */
  async getAll() {
    try {
      const response = await axiosServices.get(`${BASE_URL}/all`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch medical categories',
        data: []
      };
    }
  }
}

export default new MedicalCategoriesService();
