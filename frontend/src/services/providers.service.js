import axios from 'axios';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getProviders = (params) => axios.get('/api/providers', { params }).then(unwrap);

export const getProviderById = (id) => axios.get(`/api/providers/${id}`).then(unwrap);

export const createProvider = (data) => axios.post('/api/providers', data).then(unwrap);

export const updateProvider = (id, data) => axios.put(`/api/providers/${id}`, data).then(unwrap);

export const deleteProvider = (id) => axios.delete(`/api/providers/${id}`).then(unwrap);

export const getActiveProviders = () => axios.get('/api/providers/active').then(unwrap);

export const getProvidersCount = () => axios.get('/api/providers/count').then(unwrap);

export const getProviderContracts = (providerId) => axios.get(`/api/provider-contracts/provider/${providerId}`).then(unwrap);
