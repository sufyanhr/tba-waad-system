import httpClient from 'api/httpClient';

// ==============================|| INSURANCE COMPANIES API ||============================== //

const insuranceCompaniesApi = {
  getAll: async (params) => {
    return httpClient.get('/insurance-companies', { params });
  },

  getById: async (id) => {
    return httpClient.get(`/insurance-companies/${id}`);
  },

  create: async (data) => {
    return httpClient.post('/insurance-companies', data);
  },

  update: async (id, data) => {
    return httpClient.put(`/insurance-companies/${id}`, data);
  },

  delete: async (id) => {
    return httpClient.delete(`/insurance-companies/${id}`);
  },

  getStats: async () => {
    return httpClient.get('/insurance-companies/stats');
  }
};

export default insuranceCompaniesApi;
