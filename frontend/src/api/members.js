import axios from 'utils/axios';

/**
 * Get all members with pagination and filters
 * @param {Object} params - { page, size, search, companyId, sortBy, sortDir }
 * @returns {Promise}
 */
export const getMembers = (params = {}) => {
  return axios.get('/api/members', { params });
};

/**
 * Get member by ID
 * @param {number} id - Member ID
 * @returns {Promise}
 */
export const getMemberById = (id) => {
  return axios.get(`/api/members/${id}`);
};

/**
 * Create new member
 * @param {Object} data - Member data
 * @returns {Promise}
 */
export const createMember = (data) => {
  return axios.post('/api/members', data);
};

/**
 * Update member
 * @param {number} id - Member ID
 * @param {Object} data - Updated member data
 * @returns {Promise}
 */
export const updateMember = (id, data) => {
  return axios.put(`/api/members/${id}`, data);
};

/**
 * Delete member
 * @param {number} id - Member ID
 * @returns {Promise}
 */
export const deleteMember = (id) => {
  return axios.delete(`/api/members/${id}`);
};

/**
 * Get total count of members
 * @returns {Promise}
 */
export const getMembersCount = () => {
  return axios.get('/api/members/count');
};
