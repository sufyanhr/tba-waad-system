import apiClient from './axiosClient';

// ==============================|| MEMBERS SERVICE ||============================== //

const BASE_URL = '/api/members';

export const membersService = {
  /**
   * Get all members
   * @returns {Promise<Array>} List of members
   */
  getAll: async () => {
    return await apiClient.get(BASE_URL);
  },

  /**
   * Get member by ID
   * @param {number} id - Member ID
   * @returns {Promise<Object>} Member details
   */
  getById: async (id) => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  /**
   * Get member by member number
   * @param {string} memberNumber - Member number
   * @returns {Promise<Object>} Member details
   */
  getByMemberNumber: async (memberNumber) => {
    return await apiClient.get(`${BASE_URL}/number/${memberNumber}`);
  },

  /**
   * Create new member
   * @param {Object} data - Member data
   * @returns {Promise<Object>} Created member
   */
  create: async (data) => {
    return await apiClient.post(BASE_URL, data);
  },

  /**
   * Update member
   * @param {number} id - Member ID
   * @param {Object} data - Updated member data
   * @returns {Promise<Object>} Updated member
   */
  update: async (id, data) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  /**
   * Delete member
   * @param {number} id - Member ID
   * @returns {Promise<void>}
   */
  remove: async (id) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Get members by employer
   * @param {number} employerId - Employer ID
   * @returns {Promise<Array>} List of members
   */
  getByEmployer: async (employerId) => {
    return await apiClient.get(`${BASE_URL}/employer/${employerId}`);
  },

  /**
   * Search members
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Filtered members
   */
  search: async (searchTerm) => {
    return await apiClient.get(`${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}`);
  }
};

export default membersService;
