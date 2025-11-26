import axiosServices from 'utils/axios';

/**
 * Benefit Packages Service
 * Handles all benefit package-related API operations
 */

const BASE_URL = '/benefit-packages';

class BenefitPackagesService {
  /**
   * List all benefit packages
   * @returns {Promise}
   */
  async list() {
    try {
      const response = await axiosServices.get(BASE_URL);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch benefit packages',
        data: []
      };
    }
  }

  /**
   * Get benefit package by ID
   * @param {number} id - Benefit package ID
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
        error: error.message || 'Failed to fetch benefit package',
        data: null
      };
    }
  }

  /**
   * Create new benefit package
   * @param {Object} data - Benefit package data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Benefit package created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create benefit package',
        data: null
      };
    }
  }

  /**
   * Update benefit package
   * @param {number} id - Benefit package ID
   * @param {Object} data - Updated benefit package data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Benefit package updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update benefit package',
        data: null
      };
    }
  }

  /**
   * Delete benefit package
   * @param {number} id - Benefit package ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Benefit package deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete benefit package',
        data: null
      };
    }
  }

  /**
   * Get active benefit packages
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
        error: error.message || 'Failed to fetch active benefit packages',
        data: []
      };
    }
  }

  /**
   * Get benefit package by code
   * @param {string} code - Benefit package code
   * @returns {Promise}
   */
  async getByCode(code) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/code/${code}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch benefit package',
        data: null
      };
    }
  }
}

export default new BenefitPackagesService();
