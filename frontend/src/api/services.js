import apiClient from './apiClient';

// Users API
export const usersApi = {
  getAll: (params) => apiClient.get('/users', { params }),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`)
};

// Members API
export const membersApi = {
  getAll: (params) => apiClient.get('/members', { params }),
  getById: (id) => apiClient.get(`/members/${id}`),
  create: (data) => apiClient.post('/members', data),
  update: (id, data) => apiClient.put(`/members/${id}`, data),
  delete: (id) => apiClient.delete(`/members/${id}`),
  getStats: () => apiClient.get('/members/stats'),
  getCount: () => apiClient.get('/members/count')
};

// Claims API
export const claimsApi = {
  getAll: (params) => apiClient.get('/claims', { params }),
  getById: (id) => apiClient.get(`/claims/${id}`),
  create: (data) => apiClient.post('/claims', data),
  update: (id, data) => apiClient.put(`/claims/${id}`, data),
  delete: (id) => apiClient.delete(`/claims/${id}`),
  approve: (id, data) => apiClient.post(`/claims/${id}/approve`, data),
  reject: (id, data) => apiClient.post(`/claims/${id}/reject`, data),
  getStats: () => apiClient.get('/claims/stats'),
  getCount: () => apiClient.get('/claims/count')
};

// Employers API
export const employersApi = {
  getAll: (params) => apiClient.get('/employers', { params }),
  getById: (id) => apiClient.get(`/employers/${id}`),
  create: (data) => apiClient.post('/employers', data),
  update: (id, data) => apiClient.put(`/employers/${id}`, data),
  delete: (id) => apiClient.delete(`/employers/${id}`),
  getCount: () => apiClient.get('/employers/count')
};

// Insurance Companies API
export const insuranceApi = {
  getAll: (params) => apiClient.get('/insurance-companies', { params }),
  getById: (id) => apiClient.get(`/insurance-companies/${id}`),
  create: (data) => apiClient.post('/insurance-companies', data),
  update: (id, data) => apiClient.put(`/insurance-companies/${id}`, data),
  delete: (id) => apiClient.delete(`/insurance-companies/${id}`)
};

// Reviewer Companies API
export const reviewersApi = {
  getAll: (params) => apiClient.get('/reviewer-companies', { params }),
  getById: (id) => apiClient.get(`/reviewer-companies/${id}`),
  create: (data) => apiClient.post('/reviewer-companies', data),
  update: (id, data) => apiClient.put(`/reviewer-companies/${id}`, data),
  delete: (id) => apiClient.delete(`/reviewer-companies/${id}`)
};

// Visits API
export const visitsApi = {
  getAll: (params) => apiClient.get('/visits', { params }),
  getById: (id) => apiClient.get(`/visits/${id}`),
  create: (data) => apiClient.post('/visits', data),
  update: (id, data) => apiClient.put(`/visits/${id}`, data),
  delete: (id) => apiClient.delete(`/visits/${id}`)
};

// Dashboard API
export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getClaimsStats: () => apiClient.get('/claims/stats'),
  getMembersCount: () => apiClient.get('/members/count'),
  getEmployersCount: () => apiClient.get('/employers/count'),
  getVisitsCount: () => apiClient.get('/visits/count')
};

export default {
  users: usersApi,
  members: membersApi,
  claims: claimsApi,
  employers: employersApi,
  insurance: insuranceApi,
  reviewers: reviewersApi,
  visits: visitsApi,
  dashboard: dashboardApi
};
