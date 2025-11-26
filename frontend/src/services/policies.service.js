import axiosServices from 'utils/axios';

/**
 * Policies Service
 * Handles all policy-related API operations
 */

const BASE_URL = '/policies';

class PoliciesService {
  /**
   * List all policies
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
        error: error.message || 'Failed to fetch policies',
        data: []
      };
    }
  }

  /**
   * Get policy by ID
   * @param {number} id - Policy ID
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
        error: error.message || 'Failed to fetch policy',
        data: null
      };
    }
  }

  /**
   * Create new policy
   * @param {Object} data - Policy data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Policy created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create policy',
        data: null
      };
    }
  }

  /**
   * Update policy
   * @param {number} id - Policy ID
   * @param {Object} data - Updated policy data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Policy updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update policy',
        data: null
      };
    }
  }

  /**
   * Delete policy
   * @param {number} id - Policy ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Policy deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete policy',
        data: null
      };
    }
  }

  /**
   * Get active policies
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
        error: error.message || 'Failed to fetch active policies',
        data: []
      };
    }
  }

  /**
   * Get policies by employer ID
   * @param {number} employerId - Employer ID
   * @returns {Promise}
   */
  async getByEmployer(employerId) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/employer/${employerId}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch policies',
        data: []
      };
    }
  }

  /**
   * Get policies by insurance company ID
   * @param {number} insuranceCompanyId - Insurance company ID
   * @returns {Promise}
   */
  async getByInsuranceCompany(insuranceCompanyId) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/insurance/${insuranceCompanyId}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch policies',
        data: []
      };
    }
  }

  /**
   * Get policy by policy number
   * @param {string} policyNumber - Policy number
   * @returns {Promise}
   */
  async getByNumber(policyNumber) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/number/${policyNumber}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch policy',
        data: null
      };
    }
  }

  /**
   * Update policy status
   * @param {number} id - Policy ID
   * @param {string} status - New status
   * @returns {Promise}
   */
  async updateStatus(id, status) {
    try {
      const response = await axiosServices.patch(`${BASE_URL}/${id}/status`, null, {
        params: { status }
      });
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Policy status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update policy status',
        data: null
      };
    }
  }
}

export default new PoliciesService();
