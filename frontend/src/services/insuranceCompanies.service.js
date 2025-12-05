import axios from 'axios';

const BASE_URL = '/api/insurance-companies';

// Utility to unwrap nested API response
const unwrap = (response) => response?.data?.data ?? response?.data;

/**
 * Get paginated list of insurance companies with optional search
 * @param {Object} params - Query parameters {page, size, search, sortBy, sortDir}
 * @returns {Promise<{items: Array, total: number, page: number, size: number}>}
 */
export const getInsuranceCompanies = async (params = {}) => {
  const response = await axios.get(BASE_URL, { params });
  return unwrap(response);
};

/**
 * Get insurance company by ID
 * @param {number} id - Insurance company ID
 * @returns {Promise<Object>} Insurance company details
 */
export const getInsuranceCompanyById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return unwrap(response);
};

/**
 * Create new insurance company
 * @param {Object} data - Insurance company data
 * @returns {Promise<Object>} Created insurance company
 */
export const createInsuranceCompany = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return unwrap(response);
};

/**
 * Update existing insurance company
 * @param {number} id - Insurance company ID
 * @param {Object} data - Updated insurance company data
 * @returns {Promise<Object>} Updated insurance company
 */
export const updateInsuranceCompany = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return unwrap(response);
};

/**
 * Delete insurance company (soft delete)
 * @param {number} id - Insurance company ID
 * @returns {Promise<void>}
 */
export const deleteInsuranceCompany = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return unwrap(response);
};

/**
 * Get total count of insurance companies
 * @returns {Promise<number>}
 */
export const getInsuranceCompaniesCount = async () => {
  const response = await axios.get(`${BASE_URL}/count`);
  return unwrap(response);
};
