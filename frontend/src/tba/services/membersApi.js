import httpClient from 'api/httpClient';

// ==============================|| MEMBERS API ||============================== //

const membersApi = {
  getAll: async (params) => {
    return httpClient.get('/members', { params });
  },

  getById: async (id) => {
    return httpClient.get(`/members/${id}`);
  },

  create: async (data) => {
    return httpClient.post('/members', data);
  },

  update: async (id, data) => {
    return httpClient.put(`/members/${id}`, data);
  },

  delete: async (id) => {
    return httpClient.delete(`/members/${id}`);
  },

  getStats: async () => {
    return httpClient.get('/members/stats');
  }
};

export default membersApi;
