import axios from 'axios';

const BASE_URL = '/api/pre-approvals';

const unwrap = (response) => response?.data?.data ?? response?.data;

/**
 * Get pre-approvals with pagination and search
 * @param {Object} params - Query parameters (page, size, search)
 */
export const getPreApprovals = async (params = {}) => {
  const response = await axios.get(BASE_URL, { params });
  return unwrap(response);
};

/**
 * Get pre-approval by ID
 * @param {number} id - Pre-approval ID
 */
export const getPreApprovalById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return unwrap(response);
};

/**
 * Create a new pre-approval
 * @param {Object} data - Pre-approval data
 */
export const createPreApproval = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return unwrap(response);
};

/**
 * Update an existing pre-approval
 * @param {number} id - Pre-approval ID
 * @param {Object} data - Updated data
 */
export const updatePreApproval = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return unwrap(response);
};

/**
 * Delete a pre-approval (soft delete)
 * @param {number} id - Pre-approval ID
 */
export const deletePreApproval = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return unwrap(response);
};

/**
 * Get total count of pre-approvals
 */
export const getPreApprovalsCount = async () => {
  const response = await axios.get(`${BASE_URL}/count`);
  return unwrap(response);
};

export default {
  getPreApprovals,
  getPreApprovalById,
  createPreApproval,
  updatePreApproval,
  deletePreApproval,
  getPreApprovalsCount
};
