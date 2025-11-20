import axiosClient from './axiosClient';

const base = '/insurance-companies';

function unwrap(res) { if (res && typeof res === 'object' && 'status' in res) return res.data; return res; }

export async function list(params = {}) { const res = await axiosClient.get(base, { params }); return unwrap(res.data || res); }
export async function getById(id) { const res = await axiosClient.get(`${base}/${id}`); return unwrap(res.data || res); }
export async function createInsurance(payload) { const res = await axiosClient.post(base, payload); return unwrap(res.data || res); }
export async function updateInsurance(id, payload) { const res = await axiosClient.put(`${base}/${id}`, payload); return unwrap(res.data || res); }
export async function deleteInsurance(id) { const res = await axiosClient.delete(`${base}/${id}`); return unwrap(res.data || res); }
export async function count() { const res = await axiosClient.get(`${base}/count`); return unwrap(res.data || res); }

export const get = getById;
export const create = createInsurance;
export const update = updateInsurance;
export const remove = deleteInsurance;

export default { list, getById, createInsurance, updateInsurance, deleteInsurance, count };
