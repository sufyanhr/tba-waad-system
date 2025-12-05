import axiosServices from 'utils/axios';

/**
 * Employers Service
 * Handles all employer-related API operations
 */

const BASE_URL = '/employers';

class EmployersService {
  /**
   * List all employers with pagination and filters
   * @param {Object} params - { page, size, search, companyId, sortBy, sortDir }
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
        error: error.message || 'Failed to fetch employers',
        data: null
      };
    }
  }

  /**
   * Get employer by ID
   * @param {number} id - Employer ID
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
        error: error.message || 'Failed to fetch employer',
        data: null
      };
    }
  }

  /**
   * Create new employer
   * @param {Object} data - Employer data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Employer created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create employer',
        data: null
      };
    }
  }

  /**
   * Update employer
   * @param {number} id - Employer ID
   * @param {Object} data - Updated employer data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Employer updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update employer',
        data: null
      };
    }
  }

  /**
   * Delete employer
   * @param {number} id - Employer ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Employer deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete employer',
        data: null
      };
    }
  }

  /**
   * Get total count of employers
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
   * Get all employers (no pagination)
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
        error: error.message || 'Failed to fetch employers',
        data: []
      };
    }
  }
}

export default new EmployersService();
