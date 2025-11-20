import axiosClient from './axiosClient';

const base = '/employers';

export async function list(params = {}) {
  const res = await axiosClient.get(base, { params });
  return res.data;
}

export const getAll = list; // alias for compatibility

export async function getById(id) {
  const res = await axiosClient.get(`${base}/${id}`);
  return res.data;
}

export async function createEmployer(payload) {
  const res = await axiosClient.post(base, payload);
  return res.data;
}

export async function updateEmployer(id, payload) {
  const res = await axiosClient.put(`${base}/${id}`, payload);
  return res.data;
}

export async function deleteEmployer(id) {
  const res = await axiosClient.delete(`${base}/${id}`);
  return res.data;
}

export async function count() {
  const res = await axiosClient.get(`${base}/count`);
  return res.data;
}

export default {
  list,
  getAll,
  getById,
  createEmployer,
  updateEmployer,
  deleteEmployer,
  count
};
