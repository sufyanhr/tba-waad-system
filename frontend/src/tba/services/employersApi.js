import httpClient from 'api/httpClient';

// ==============================|| EMPLOYERS API ||============================== //

const employersApi = {
  getAll: async (params) => {
    return httpClient.get('/employers', { params });
  },

  getById: async (id) => {
    return httpClient.get(`/employers/${id}`);
  },

  create: async (data) => {
    return httpClient.post('/employers', data);
  },

  update: async (id, data) => {
    return httpClient.put(`/employers/${id}`, data);
  },

  delete: async (id) => {
    return httpClient.delete(`/employers/${id}`);
  },

  getStats: async () => {
    return httpClient.get('/employers/stats');
  }
};

export default employersApi;
