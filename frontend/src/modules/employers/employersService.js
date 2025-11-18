import apiClient from 'api/apiClient';

/**
 * Employers API Service
 * Connects to backend /api/employers endpoints
 */

export const employersService = {
  // GET /api/employers?page=0&size=10
  getAll: async (params = {}) => {
    const response = await apiClient.get('/employers', { params });
    return response;
  },

  // GET /api/employers/{id}
  getById: async (id) => {
    const response = await apiClient.get(`/employers/${id}`);
    return response;
  },

  // POST /api/employers
  create: async (employerData) => {
    const response = await apiClient.post('/employers', employerData);
    return response;
  },

  // PUT /api/employers/{id}
  update: async (id, employerData) => {
    const response = await apiClient.put(`/employers/${id}`, employerData);
    return response;
  },

  // DELETE /api/employers/{id}
  delete: async (id) => {
    const response = await apiClient.delete(`/employers/${id}`);
    return response;
  },

  // GET /api/employers/count
  getCount: async () => {
    const response = await apiClient.get('/employers/count');
    return response;
  },

  // GET /api/employers/{id}/employees
  getEmployees: async (id, params = {}) => {
    const response = await apiClient.get(`/employers/${id}/employees`, { params });
    return response;
  }
};

export default employersService;
