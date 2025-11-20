import axiosClient from './axiosClient';

const base = '/reviewer-companies';

function unwrap(res) {
  if (res && typeof res === 'object' && 'status' in res) return res.data;
  return res;
}

export async function list(params = {}) { const res = await axiosClient.get(base, { params }); return unwrap(res.data || res); }
export async function getById(id) { const res = await axiosClient.get(`${base}/${id}`); return unwrap(res.data || res); }
export async function createReviewer(payload) { const res = await axiosClient.post(base, payload); return unwrap(res.data || res); }
export async function updateReviewer(id, payload) { const res = await axiosClient.put(`${base}/${id}`, payload); return unwrap(res.data || res); }
export async function deleteReviewer(id) { const res = await axiosClient.delete(`${base}/${id}`); return unwrap(res.data || res); }
export async function count() { const res = await axiosClient.get(`${base}/count`); return unwrap(res.data || res); }

// compatibility aliases
export const create = createReviewer;
export const update = updateReviewer;
export const remove = deleteReviewer;
export default { list, getById, createReviewer, updateReviewer, deleteReviewer, count, create, update, remove };
