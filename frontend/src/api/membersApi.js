import axiosClient from './axiosClient';

const base = '/members';

export async function list(params = {}) {
  const res = await axiosClient.get(base, { params });
  return res.data;
}

export const getAll = list;

export async function getById(id) {
  const res = await axiosClient.get(`${base}/${id}`);
  return res.data;
}

export async function createMember(payload) {
  const res = await axiosClient.post(base, payload);
  return res.data;
}

export async function updateMember(id, payload) {
  const res = await axiosClient.put(`${base}/${id}`, payload);
  return res.data;
}

export async function deleteMember(id) {
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
  createMember,
  updateMember,
  deleteMember,
  count
};

