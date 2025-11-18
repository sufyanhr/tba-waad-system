import apiClient from 'api/apiClient';

/**
 * Members API Service
 * Connects to backend /api/members endpoints
 */

export const membersService = {
  // GET /api/members?page=0&size=10
  getAll: async (params = {}) => {
    const response = await apiClient.get('/members', { params });
    return response;
  },

  // GET /api/members/{id}
  getById: async (id) => {
    const response = await apiClient.get(`/members/${id}`);
    return response;
  },

  // POST /api/members
  create: async (memberData) => {
    const response = await apiClient.post('/members', memberData);
    return response;
  },

  // PUT /api/members/{id}
  update: async (id, memberData) => {
    const response = await apiClient.put(`/members/${id}`, memberData);
    return response;
  },

  // DELETE /api/members/{id}
  delete: async (id) => {
    const response = await apiClient.delete(`/members/${id}`);
    return response;
  },

  // GET /api/members/stats
  getStats: async () => {
    const response = await apiClient.get('/members/stats');
    return response;
  },

  // GET /api/members/count
  getCount: async () => {
    const response = await apiClient.get('/members/count');
    return response;
  },

  // GET /api/members/search?query=...
  search: async (query) => {
    const response = await apiClient.get('/members/search', { params: { query } });
    return response;
  }
};

export default membersService;
