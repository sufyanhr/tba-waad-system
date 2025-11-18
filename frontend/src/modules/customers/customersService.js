import apiClient from 'api/apiClient';

/**
 * Customers API Service
 * Connects to backend /api/customers endpoints
 */

export const customersService = {
  // GET /api/customers?page=0&size=10
  getAll: async (params = {}) => {
    const response = await apiClient.get('/customers', { params });
    return response;
  },

  // GET /api/customers/{id}
  getById: async (id) => {
    const response = await apiClient.get(`/customers/${id}`);
    return response;
  },

  // POST /api/customers
  create: async (customerData) => {
    const response = await apiClient.post('/customers', customerData);
    return response;
  },

  // PUT /api/customers/{id}
  update: async (id, customerData) => {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response;
  },

  // DELETE /api/customers/{id}
  delete: async (id) => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response;
  },

  // GET /api/customers/stats
  getStats: async () => {
    const response = await apiClient.get('/customers/stats');
    return response;
  },

  // GET /api/customers/count
  getCount: async () => {
    const response = await apiClient.get('/customers/count');
    return response;
  }
};

export default customersService;
