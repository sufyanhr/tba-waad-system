import axios from 'axios';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getClaims = (params) => 
  axios.get('/api/claims', { params }).then(unwrap);

export const getClaimById = (id) => 
  axios.get(`/api/claims/${id}`).then(unwrap);

export const createClaim = (data) => 
  axios.post('/api/claims', data).then(unwrap);

export const updateClaim = (id, data) => 
  axios.put(`/api/claims/${id}`, data).then(unwrap);

export const deleteClaim = (id) => 
  axios.delete(`/api/claims/${id}`).then(unwrap);

export const getClaimsCount = () => 
  axios.get('/api/claims/count').then(unwrap);

export const getClaimsByMember = (memberId) => 
  axios.get(`/api/claims/member/${memberId}`).then(unwrap);

export const getClaimsByPreApproval = (preApprovalId) => 
  axios.get(`/api/claims/pre-approval/${preApprovalId}`).then(unwrap);
