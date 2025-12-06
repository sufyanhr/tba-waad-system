import axios from 'axios';

const BASE_URL = '/api/insurance-policies';

// Utility to unwrap nested API response
const unwrap = (response) => response?.data?.data ?? response?.data;

/**
 * Get paginated list of insurance policies with optional search
 * @param {Object} params - Query parameters {page, size, search, sortBy, sortDir}
 * @returns {Promise<{items: Array, total: number, page: number, size: number}>}
 */
export const getInsurancePolicies = async (params = {}) => {
  const response = await axios.get(BASE_URL, { params });
  return unwrap(response);
};

/**
 * Get insurance policy by ID
 * @param {number} id - Insurance policy ID
 * @returns {Promise<Object>} Insurance policy details
 */
export const getInsurancePolicyById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return unwrap(response);
};

/**
 * Create new insurance policy
 * @param {Object} data - Insurance policy data
 * @returns {Promise<Object>} Created insurance policy
 */
export const createInsurancePolicy = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return unwrap(response);
};

/**
 * Update existing insurance policy
 * @param {number} id - Insurance policy ID
 * @param {Object} data - Updated insurance policy data
 * @returns {Promise<Object>} Updated insurance policy
 */
export const updateInsurancePolicy = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return unwrap(response);
};

/**
 * Delete insurance policy (soft delete)
 * @param {number} id - Insurance policy ID
 * @returns {Promise<void>}
 */
export const deleteInsurancePolicy = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return unwrap(response);
};

/**
 * Get benefit packages for a policy
 * @param {number} policyId - Policy ID
 * @returns {Promise<Array>} List of benefit packages
 */
export const getBenefitPackages = async (policyId) => {
  const response = await axios.get(`${BASE_URL}/${policyId}/packages`);
  return unwrap(response);
};

/**
 * Create benefit package for a policy
 * @param {number} policyId - Policy ID
 * @param {Object} data - Benefit package data
 * @returns {Promise<Object>} Created benefit package
 */
export const createBenefitPackage = async (policyId, data) => {
  const response = await axios.post(`${BASE_URL}/${policyId}/packages`, data);
  return unwrap(response);
};

/**
 * Update benefit package
 * @param {number} id - Benefit package ID
 * @param {Object} data - Updated benefit package data
 * @returns {Promise<Object>} Updated benefit package
 */
export const updateBenefitPackage = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/packages/${id}`, data);
  return unwrap(response);
};

/**
 * Delete benefit package (soft delete)
 * @param {number} id - Benefit package ID
 * @returns {Promise<void>}
 */
export const deleteBenefitPackage = async (id) => {
  const response = await axios.delete(`${BASE_URL}/packages/${id}`);
  return unwrap(response);
};

/**
 * Get total count of insurance policies
 * @returns {Promise<number>}
 */
export const getInsurancePoliciesCount = async () => {
  const response = await axios.get(`${BASE_URL}/count`);
  return unwrap(response);
};
