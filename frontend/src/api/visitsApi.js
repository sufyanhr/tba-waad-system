import axiosClient from './axiosClient';

const base = '/visits';

function unwrap(res) { if (res && typeof res === 'object' && 'status' in res) return res.data; return res; }

export async function list(params = {}) { const res = await axiosClient.get(base, { params }); return unwrap(res.data || res); }
export async function getById(id) { const res = await axiosClient.get(`${base}/${id}`); return unwrap(res.data || res); }
export async function createVisit(payload) { const res = await axiosClient.post(base, payload); return unwrap(res.data || res); }
export async function updateVisit(id, payload) { const res = await axiosClient.put(`${base}/${id}`, payload); return unwrap(res.data || res); }
export async function deleteVisit(id) { const res = await axiosClient.delete(`${base}/${id}`); return unwrap(res.data || res); }
export async function count() { const res = await axiosClient.get(`${base}/count`); return unwrap(res.data || res); }

export const get = getById;
export const create = createVisit;
export const update = updateVisit;
export const remove = deleteVisit;

export default { list, getById, createVisit, updateVisit, deleteVisit, count };
