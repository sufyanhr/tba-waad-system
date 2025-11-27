import axiosServices from 'utils/axios';

/**
 * Medical Packages Service
 * Handles all medical package-related API operations
 */

const BASE_URL = '/medical-packages';

class MedicalPackagesService {
  /**
   * List all medical packages
   * @param {Object} params - Optional query parameters
   * @returns {Promise}
   */
  async list(params = {}) {
    try {
      const response = await axiosServices.get(BASE_URL, { params });
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch medical packages',
        data: []
      };
    }
  }

  /**
   * Get all medical packages (alias for list)
   * @returns {Promise}
   */
  async getAll() {
    return this.list();
  }

  /**
   * Get medical package by ID
   * @param {number} id - Medical package ID
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
        error: error.response?.data?.error || error.message || 'Failed to fetch medical package',
        data: null
      };
    }
  }

  /**
   * Get medical package by code
   * @param {string} code - Medical package code
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
        error: error.response?.data?.error || error.message || 'Failed to fetch medical package',
        data: null
      };
    }
  }

  /**
   * Get active medical packages only
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
        error: error.response?.data?.error || error.message || 'Failed to fetch active medical packages',
        data: []
      };
    }
  }

  /**
   * Create new medical package
   * @param {Object} data - Medical package data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Medical package created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create medical package',
        data: null
      };
    }
  }

  /**
   * Update medical package
   * @param {number} id - Medical package ID
   * @param {Object} data - Updated medical package data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Medical package updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update medical package',
        data: null
      };
    }
  }

  /**
   * Delete medical package
   * @param {number} id - Medical package ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        message: response.data?.message || 'Medical package deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete medical package'
      };
    }
  }

  /**
   * Get total count of medical packages
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
        error: error.response?.data?.error || error.message || 'Failed to fetch package count',
        data: 0
      };
    }
  }
}

export default new MedicalPackagesService();
