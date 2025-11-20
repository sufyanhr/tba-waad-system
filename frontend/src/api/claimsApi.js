import axiosClient from './axiosClient';

const base = '/claims';

function unwrapApiResponse(res) {
  // If backend returns ApiResponse { status, data, message }, unwrap to data
  if (res && typeof res === 'object' && 'status' in res) {
    return res.data;
  }
  return res;
}

export async function list(params = {}) { const res = await axiosClient.get(base, { params }); return unwrapApiResponse(res.data || res); }
export async function get(id) { const res = await axiosClient.get(`${base}/${id}`); return unwrapApiResponse(res.data || res); }
export async function createClaim(payload) { const res = await axiosClient.post(base, payload); return unwrapApiResponse(res.data || res); }
export async function updateClaim(id, payload) { const res = await axiosClient.put(`${base}/${id}`, payload); return unwrapApiResponse(res.data || res); }
export async function deleteClaim(id) { const res = await axiosClient.delete(`${base}/${id}`); return unwrapApiResponse(res.data || res); }
export async function count() { const res = await axiosClient.get(`${base}/count`); return unwrapApiResponse(res.data || res); }

// compatibility aliases
export const create = createClaim;
export const update = updateClaim;
export const remove = deleteClaim;

export default { list, get, createClaim, updateClaim, deleteClaim, count, create, update, remove };
