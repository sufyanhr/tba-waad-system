import axiosServices from 'utils/axios';

/**
 * Providers Service
 * Handles all provider-related API operations
 */

const BASE_URL = '/providers';

class ProvidersService {
  /**
   * List all providers with pagination
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
        error: error.message || 'Failed to fetch providers',
        data: null
      };
    }
  }

  /**
   * Get provider by ID
   * @param {number} id - Provider ID
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
        error: error.message || 'Failed to fetch provider',
        data: null
      };
    }
  }

  /**
   * Create new provider
   * @param {Object} data - Provider data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Provider created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create provider',
        data: null
      };
    }
  }

  /**
   * Update provider
   * @param {number} id - Provider ID
   * @param {Object} data - Updated provider data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Provider updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update provider',
        data: null
      };
    }
  }

  /**
   * Delete provider
   * @param {number} id - Provider ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Provider deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete provider',
        data: null
      };
    }
  }

  /**
   * Get active providers
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
        error: error.message || 'Failed to fetch active providers',
        data: []
      };
    }
  }

  /**
   * Get provider by license number
   * @param {string} licenseNumber - License number
   * @returns {Promise}
   */
  async getByLicense(licenseNumber) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/license/${licenseNumber}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch provider',
        data: null
      };
    }
  }

  /**
   * Get providers by type
   * @param {string} type - Provider type (HOSPITAL, CLINIC, PHARMACY, LABORATORY, etc.)
   * @returns {Promise}
   */
  async getByType(type) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/type/${type}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch providers',
        data: []
      };
    }
  }

  /**
   * Get total count of providers
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
   * Get all providers (no pagination)
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
        error: error.message || 'Failed to fetch providers',
        data: []
      };
    }
  }
}

export default new ProvidersService();
