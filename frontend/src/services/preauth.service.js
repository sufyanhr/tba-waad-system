import axiosServices from 'utils/axios';

/**
 * Pre-Authorizations Service
 * Handles all pre-authorization-related API operations
 */

const BASE_URL = '/pre-authorizations';

class PreAuthorizationsService {
  /**
   * List all pre-authorizations
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
        error: error.message || 'Failed to fetch pre-authorizations',
        data: []
      };
    }
  }

  /**
   * Get pre-authorization by ID
   * @param {number} id - Pre-authorization ID
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
        error: error.message || 'Failed to fetch pre-authorization',
        data: null
      };
    }
  }

  /**
   * Create new pre-authorization
   * @param {Object} data - Pre-authorization data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Pre-authorization created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create pre-authorization',
        data: null
      };
    }
  }

  /**
   * Update pre-authorization
   * @param {number} id - Pre-authorization ID
   * @param {Object} data - Updated pre-authorization data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Pre-authorization updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update pre-authorization',
        data: null
      };
    }
  }

  /**
   * Delete pre-authorization
   * @param {number} id - Pre-authorization ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Pre-authorization deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete pre-authorization',
        data: null
      };
    }
  }

  /**
   * Approve pre-authorization
   * @param {number} id - Pre-authorization ID
   * @param {Object} data - { reviewerId, approvedAmount, reviewerNotes, validityDays }
   * @returns {Promise}
   */
  async approve(id, data) {
    try {
      const { reviewerId, ...bodyData } = data;
      const response = await axiosServices.post(`${BASE_URL}/${id}/approve`, bodyData, {
        params: { reviewerId }
      });
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Pre-authorization approved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to approve pre-authorization',
        data: null
      };
    }
  }

  /**
   * Reject pre-authorization
   * @param {number} id - Pre-authorization ID
   * @param {Object} data - { reviewerId, rejectionReason, reviewerNotes }
   * @returns {Promise}
   */
  async reject(id, data) {
    try {
      const { reviewerId, ...bodyData } = data;
      const response = await axiosServices.post(`${BASE_URL}/${id}/reject`, bodyData, {
        params: { reviewerId }
      });
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Pre-authorization rejected successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to reject pre-authorization',
        data: null
      };
    }
  }

  /**
   * Mark pre-authorization as under review
   * @param {number} id - Pre-authorization ID
   * @param {number} reviewerId - Reviewer ID
   * @returns {Promise}
   */
  async markUnderReview(id, reviewerId) {
    try {
      const response = await axiosServices.post(`${BASE_URL}/${id}/under-review`, null, {
        params: { reviewerId }
      });
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Pre-authorization marked as under review'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update pre-authorization',
        data: null
      };
    }
  }

  /**
   * Get pre-authorizations by status
   * @param {string} status - Status filter
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
        error: error.message || 'Failed to fetch pre-authorizations',
        data: []
      };
    }
  }

  /**
   * Get pre-authorizations by member ID
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
        error: error.message || 'Failed to fetch pre-authorizations',
        data: []
      };
    }
  }

  /**
   * Get pre-authorizations by provider ID
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
        error: error.message || 'Failed to fetch pre-authorizations',
        data: []
      };
    }
  }

  /**
   * Get pre-authorization by pre-auth number
   * @param {string} preAuthNumber - Pre-authorization number
   * @returns {Promise}
   */
  async getByNumber(preAuthNumber) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/number/${preAuthNumber}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch pre-authorization',
        data: null
      };
    }
  }
}

export default new PreAuthorizationsService();
