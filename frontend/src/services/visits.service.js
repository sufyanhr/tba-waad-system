import axiosServices from 'utils/axios';

/**
 * Visits Service
 * Handles all visit-related API operations
 */

const BASE_URL = '/visits';

class VisitsService {
  /**
   * List all visits with pagination
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
        error: error.message || 'Failed to fetch visits',
        data: null
      };
    }
  }

  /**
   * Get visit by ID
   * @param {number} id - Visit ID
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
        error: error.message || 'Failed to fetch visit',
        data: null
      };
    }
  }

  /**
   * Create new visit
   * @param {Object} data - Visit data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Visit created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create visit',
        data: null
      };
    }
  }

  /**
   * Update visit
   * @param {number} id - Visit ID
   * @param {Object} data - Updated visit data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Visit updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update visit',
        data: null
      };
    }
  }

  /**
   * Delete visit
   * @param {number} id - Visit ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Visit deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete visit',
        data: null
      };
    }
  }

  /**
   * Get visits by member
   * @param {number} memberId - Member ID
   * @returns {Promise}
   */
  async getByMember(memberId) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/member/${memberId}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch visits',
        data: []
      };
    }
  }

  /**
   * Get visits by provider
   * @param {number} providerId - Provider ID
   * @returns {Promise}
   */
  async getByProvider(providerId) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/provider/${providerId}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch visits',
        data: []
      };
    }
  }

  /**
   * Get total count of visits
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
}

export default new VisitsService();
