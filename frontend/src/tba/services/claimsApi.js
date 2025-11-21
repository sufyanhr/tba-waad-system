import axiosClient from './axiosClient';

// ==============================|| CLAIMS API ||============================== //

const claimsApi = {
  // Get all claims
  getAll: async (params) => {
    return axiosClient.get('/claims', { params });
  },

  // Get claim by ID
  getById: async (id) => {
    return axiosClient.get(`/claims/${id}`);
  },

  // Create new claim
  create: async (data) => {
    return axiosClient.post('/claims', data);
  },

  // Update claim
  update: async (id, data) => {
    return axiosClient.put(`/claims/${id}`, data);
  },

  // Delete claim
  delete: async (id) => {
    return axiosClient.delete(`/claims/${id}`);
  },

  // Get claim statistics
  getStats: async () => {
    return axiosClient.get('/claims/stats');
  }
};

export default claimsApi;
