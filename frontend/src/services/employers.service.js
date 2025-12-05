import axios from 'utils/axios';

const BASE_URL = '/api/employers';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getEmployers = async (params = {}) => {
  const response = await axios.get(BASE_URL, { params });
  return unwrap(response);
};

export const getEmployerById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return unwrap(response);
};

export const createEmployer = async (payload) => {
  const response = await axios.post(BASE_URL, payload);
  return unwrap(response);
};

export const updateEmployer = async (id, payload) => {
  const response = await axios.put(`${BASE_URL}/${id}`, payload);
  return unwrap(response);
};

export const deleteEmployer = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return unwrap(response);
};
