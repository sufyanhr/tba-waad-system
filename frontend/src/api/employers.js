import axios from '../utils/axios';

/**
 * Employers API Service
 * Handles all employer-related API calls
 */

export const getEmployers = (companyId, params = {}) => {
  const queryParams = { ...params };
  if (companyId) {
    queryParams.companyId = companyId;
  }
  return axios.get('/api/employers', { params: queryParams });
};

export const getEmployerById = (id) => {
  return axios.get(`/api/employers/${id}`);
};

export const createEmployer = (data) => {
  return axios.post('/api/employers', data);
};

export const updateEmployer = (id, data) => {
  return axios.put(`/api/employers/${id}`, data);
};

export const deleteEmployer = (id) => {
  return axios.delete(`/api/employers/${id}`);
};

export default {
  getEmployers,
  getEmployerById,
  createEmployer,
  updateEmployer,
  deleteEmployer
};
