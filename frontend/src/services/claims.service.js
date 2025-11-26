import axiosServices from 'utils/axios';

/**
 * Claims Service
 * Handles all claim-related API operations
 */

const BASE_URL = '/claims';

class ClaimsService {
  /**
   * List all claims with pagination
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
        error: error.message || 'Failed to fetch claims',
        data: null
      };
    }
  }

  /**
   * Get claim by ID
   * @param {number} id - Claim ID
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
        error: error.message || 'Failed to fetch claim',
        data: null
      };
    }
  }

  /**
   * Create new claim
   * @param {Object} data - Claim data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Claim created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create claim',
        data: null
      };
    }
  }

  /**
   * Update claim
   * @param {number} id - Claim ID
   * @param {Object} data - Updated claim data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Claim updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update claim',
        data: null
      };
    }
  }

  /**
   * Delete claim
   * @param {number} id - Claim ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Claim deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete claim',
        data: null
      };
    }
  }

  /**
   * Approve claim
   * @param {number} id - Claim ID
   * @param {Object} data - { reviewerId, approvedAmount }
   * @returns {Promise}
   */
  async approve(id, data) {
    try {
      const response = await axiosServices.post(`${BASE_URL}/${id}/approve`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Claim approved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to approve claim',
        data: null
      };
    }
  }

  /**
   * Reject claim
   * @param {number} id - Claim ID
   * @param {Object} data - { reviewerId, rejectionReason }
   * @returns {Promise}
   */
  async reject(id, data) {
    try {
      const response = await axiosServices.post(`${BASE_URL}/${id}/reject`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Claim rejected successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to reject claim',
        data: null
      };
    }
  }

  /**
   * Get claims by status
   * @param {string} status - Claim status
   * @returns {Promise}
   */
  async getByStatus(status) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/status/${status}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch claims',
        data: []
      };
    }
  }

  /**
   * Get total count of claims
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
   * Get all claims (no pagination) - Deprecated
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
        error: error.message || 'Failed to fetch claims',
        data: []
      };
    }
  }
}

export default new ClaimsService();
