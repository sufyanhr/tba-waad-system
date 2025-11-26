import axiosServices from 'utils/axios';

/**
 * Members Service
 * Handles all member-related API operations
 */

const BASE_URL = '/members';

class MembersService {
  /**
   * List all members with pagination and filters
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
        error: error.message || 'Failed to fetch members',
        data: null
      };
    }
  }

  /**
   * Get member by ID
   * @param {number} id - Member ID
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
        error: error.message || 'Failed to fetch member',
        data: null
      };
    }
  }

  /**
   * Create new member
   * @param {Object} data - Member data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Member created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create member',
        data: null
      };
    }
  }

  /**
   * Update member
   * @param {number} id - Member ID
   * @param {Object} data - Updated member data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Member updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update member',
        data: null
      };
    }
  }

  /**
   * Delete member
   * @param {number} id - Member ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Member deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete member',
        data: null
      };
    }
  }

  /**
   * Get total count of members
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

export default new MembersService();
