import apiClient from './axiosClient';

// ==============================|| EMPLOYERS SERVICE ||============================== //

const BASE_URL = '/api/employers';

export const employersService = {
  /**
   * Get all employers
   * @returns {Promise<Array>} List of employers
   */
  getAll: async () => {
    return await apiClient.get(BASE_URL);
  },

  /**
   * Get employer by ID
   * @param {number} id - Employer ID
   * @returns {Promise<Object>} Employer details
   */
  getById: async (id) => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  /**
   * Create new employer
   * @param {Object} data - Employer data
   * @returns {Promise<Object>} Created employer
   */
  create: async (data) => {
    return await apiClient.post(BASE_URL, data);
  },

  /**
   * Update employer
   * @param {number} id - Employer ID
   * @param {Object} data - Updated employer data
   * @returns {Promise<Object>} Updated employer
   */
  update: async (id, data) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  /**
   * Delete employer
   * @param {number} id - Employer ID
   * @returns {Promise<void>}
   */
  remove: async (id) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Search employers
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Filtered employers
   */
  search: async (searchTerm) => {
    return await apiClient.get(`${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}`);
  }
};

export default employersService;
