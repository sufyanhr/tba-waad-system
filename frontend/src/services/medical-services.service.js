import axiosServices from 'utils/axios';

/**
 * Medical Services Service
 * Handles all medical service-related API operations
 */

const BASE_URL = '/medical-services';

class MedicalServicesService {
  /**
   * List all medical services with pagination
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
        error: error.message || 'Failed to fetch medical services',
        data: null
      };
    }
  }

  /**
   * Get medical service by ID
   * @param {number} id - Medical service ID
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
        error: error.message || 'Failed to fetch medical service',
        data: null
      };
    }
  }

  /**
   * Create new medical service
   * @param {Object} data - Medical service data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Medical service created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create medical service',
        data: null
      };
    }
  }

  /**
   * Update medical service
   * @param {number} id - Medical service ID
   * @param {Object} data - Updated medical service data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Medical service updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update medical service',
        data: null
      };
    }
  }

  /**
   * Delete medical service
   * @param {number} id - Medical service ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Medical service deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete medical service',
        data: null
      };
    }
  }

  /**
   * Get medical service by code
   * @param {string} code - Service code
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
        error: error.message || 'Failed to fetch medical service',
        data: null
      };
    }
  }

  /**
   * Get active medical services
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
        error: error.message || 'Failed to fetch active medical services',
        data: []
      };
    }
  }

  /**
   * Get medical services by category
   * @param {number} categoryId - Medical category ID
   * @returns {Promise}
   */
  async getByCategory(categoryId) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/category/${categoryId}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch medical services',
        data: []
      };
    }
  }

  /**
   * Get total count of medical services
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
   * Get all medical services (no pagination)
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
        error: error.message || 'Failed to fetch medical services',
        data: []
      };
    }
  }
}

export default new MedicalServicesService();
