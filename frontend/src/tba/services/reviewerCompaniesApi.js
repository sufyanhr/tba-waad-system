import httpClient from 'api/httpClient';

// ==============================|| REVIEWER COMPANIES API ||============================== //

const reviewerCompaniesApi = {
  getAll: async (params) => {
    return httpClient.get('/reviewer-companies', { params });
  },

  getById: async (id) => {
    return httpClient.get(`/reviewer-companies/${id}`);
  },

  create: async (data) => {
    return httpClient.post('/reviewer-companies', data);
  },

  update: async (id, data) => {
    return httpClient.put(`/reviewer-companies/${id}`, data);
  },

  delete: async (id) => {
    return httpClient.delete(`/reviewer-companies/${id}`);
  },

  getStats: async () => {
    return httpClient.get('/reviewer-companies/stats');
  }
};

export default reviewerCompaniesApi;
