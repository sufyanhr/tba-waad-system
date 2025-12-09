import axiosClient from './axiosClient';

// ==============================|| MEMBERS SERVICE ||============================== //

const BASE_URL = '/api/members';

/**
 * Unwrap API response
 */
const unwrap = (response) => {
  if (response?.data) {
    return response.data;
  }
  return response;
};

export const membersService = {
  /**
   * Get paginated members list
   * @param {Object} params - Query parameters (page, size, search, sortBy, sortDir)
   * @returns {Promise<Object>} Paginated members response
   */
  getMembers: async (params = {}) => {
    const response = await axiosClient.get(BASE_URL, { params });
    return unwrap(response);
  },

  /**
   * Get member by ID
   * @param {number} id - Member ID
   * @returns {Promise<Object>} Member details
   */
  getMemberById: async (id) => {
    const response = await axiosClient.get(`${BASE_URL}/${id}`);
    return unwrap(response);
  },

  /**
   * Create new member
   * @param {Object} data - Member data
   * @returns {Promise<Object>} Created member
   */
  createMember: async (data) => {
    const response = await axiosClient.post(BASE_URL, data);
    return unwrap(response);
  },

  /**
   * Update member
   * @param {number} id - Member ID
   * @param {Object} data - Updated member data
   * @returns {Promise<Object>} Updated member
   */
  updateMember: async (id, data) => {
    const response = await axiosClient.put(`${BASE_URL}/${id}`, data);
    return unwrap(response);
  },

  /**
   * Delete member
   * @param {number} id - Member ID
   * @returns {Promise<void>}
   */
  deleteMember: async (id) => {
    const response = await axiosClient.delete(`${BASE_URL}/${id}`);
    return unwrap(response);
  },

  /**
   * Get members selector options
   * @returns {Promise<Array>} Members for dropdown
   */
  getMembersSelector: async () => {
    const response = await axiosClient.get(`${BASE_URL}/selector`);
    return unwrap(response);
  },

  /**
   * Get members count
   * @returns {Promise<number>} Total members count
   */
  getCount: async () => {
    const response = await axiosClient.get(`${BASE_URL}/count`);
    return unwrap(response);
  },

  /**
   * Search members
   * @param {string} query - Search query
   * @returns {Promise<Array>} Filtered members
   */
  search: async (query) => {
    const response = await axiosClient.get(`${BASE_URL}/search`, {
      params: { query }
    });
    return unwrap(response);
  },

  /**
   * Upload members Excel file (placeholder)
   * @param {File} file - Excel file
   * @returns {Promise<Object>} Upload result
   */
  uploadMembersExcel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post(`${BASE_URL}/bulk-upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return unwrap(response);
  }
};

export default membersService;
