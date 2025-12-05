import axios from 'utils/axios';

const BASE_URL = '/api/members';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getMembers = async (params = {}) => {
  const response = await axios.get(BASE_URL, { params });
  return unwrap(response);
};

export const getMemberById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return unwrap(response);
};

export const createMember = async (payload) => {
  const response = await axios.post(BASE_URL, payload);
  return unwrap(response);
};

export const updateMember = async (id, payload) => {
  const response = await axios.put(`${BASE_URL}/${id}`, payload);
  return unwrap(response);
};

export const deleteMember = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return unwrap(response);
};
