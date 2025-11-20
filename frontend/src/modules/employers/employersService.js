import axiosClient from 'api/axiosClient';

/**
 * Employers API Service
 * Connects to backend /api/employers endpoints
 */

export const exampleEmployer = () => ({
  name: 'Acme Corp',
  registrationNumber: 'REG-123456',
  sector: 'Technology',
  email: 'hr@acme.example',
  phone: '+1234567890'
});

export const employersService = {
  // GET /api/employers?page=0&size=10
  getAll: async (params = {}) => {
    const { data } = await axiosClient.get('/employers', { params });
    return data;
  },

  // GET /api/employers/{id}
  getById: async (id) => {
    const { data } = await axiosClient.get(`/employers/${id}`);
    return data;
  },

  // POST /api/employers
  create: async (employerData) => {
    const { data } = await axiosClient.post('/employers', employerData);
    return data;
  },

  // PUT /api/employers/{id}
  update: async (id, employerData) => {
    const { data } = await axiosClient.put(`/employers/${id}`, employerData);
    return data;
  },

  // DELETE /api/employers/{id}
  delete: async (id) => {
    const { data } = await axiosClient.delete(`/employers/${id}`);
    return data;
  },

  // GET /api/employers/count
  getCount: async () => {
    const { data } = await axiosClient.get('/employers/count');
    return data;
  },

  // GET /api/employers/{id}/employees
  getEmployees: async (id, params = {}) => {
    const { data } = await axiosClient.get(`/employers/${id}/employees`, { params });
    return data;
  }
};

export default employersService;
