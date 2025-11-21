import httpClient from 'api/httpClient';

// ==============================|| VISITS API ||============================== //

const visitsApi = {
  getAll: async (params) => {
    return httpClient.get('/visits', { params });
  },

  getById: async (id) => {
    return httpClient.get(`/visits/${id}`);
  },

  create: async (data) => {
    return httpClient.post('/visits', data);
  },

  update: async (id, data) => {
    return httpClient.put(`/visits/${id}`, data);
  },

  delete: async (id) => {
    return httpClient.delete(`/visits/${id}`);
  },

  getStats: async () => {
    return httpClient.get('/visits/stats');
  }
};

export default visitsApi;
