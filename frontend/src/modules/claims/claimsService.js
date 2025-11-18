import apiClient from 'api/apiClient';

/**
 * Claims API Service
 * Connects to backend /api/claims endpoints
 */

export const claimsService = {
  // GET /api/claims?page=0&size=10
  getAll: async (params = {}) => {
    const response = await apiClient.get('/claims', { params });
    return response;
  },

  // GET /api/claims/{id}
  getById: async (id) => {
    const response = await apiClient.get(`/claims/${id}`);
    return response;
  },

  // POST /api/claims
  create: async (claimData) => {
    const response = await apiClient.post('/claims', claimData);
    return response;
  },

  // PUT /api/claims/{id}
  update: async (id, claimData) => {
    const response = await apiClient.put(`/claims/${id}`, claimData);
    return response;
  },

  // DELETE /api/claims/{id}
  delete: async (id) => {
    const response = await apiClient.delete(`/claims/${id}`);
    return response;
  },

  // POST /api/claims/{id}/approve
  approve: async (id, approvalData) => {
    const response = await apiClient.post(`/claims/${id}/approve`, approvalData);
    return response;
  },

  // POST /api/claims/{id}/reject
  reject: async (id, rejectionData) => {
    const response = await apiClient.post(`/claims/${id}/reject`, rejectionData);
    return response;
  },

  // GET /api/claims/stats
  getStats: async () => {
    const response = await apiClient.get('/claims/stats');
    return response;
  },

  // GET /api/claims/count
  getCount: async () => {
    const response = await apiClient.get('/claims/count');
    return response;
  },

  // GET /api/claims/pending
  getPending: async (params = {}) => {
    const response = await apiClient.get('/claims/pending', { params });
    return response;
  },

  // GET /api/claims/approved
  getApproved: async (params = {}) => {
    const response = await apiClient.get('/claims/approved', { params });
    return response;
  },

  // GET /api/claims/rejected
  getRejected: async (params = {}) => {
    const response = await apiClient.get('/claims/rejected', { params });
    return response;
  }
};

export default claimsService;
