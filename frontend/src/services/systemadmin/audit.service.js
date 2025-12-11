import axiosServices from '../../utils/axios';

const BASE_URL = '/api/admin/audit';

export const auditService = {
  // Get all audit logs
  getAllAuditLogs: (page = 0, size = 20) => {
    return axiosServices.get(BASE_URL, {
      params: { page, size }
    });
  },

  // Get audit logs by user
  getAuditLogsByUser: (userId, page = 0, size = 20) => {
    return axiosServices.get(`${BASE_URL}/user/${userId}`, {
      params: { page, size }
    });
  },

  // Get audit logs by entity
  getAuditLogsByEntity: (entityType, entityId, page = 0, size = 20) => {
    return axiosServices.get(`${BASE_URL}/entity/${entityType}/${entityId}`, {
      params: { page, size }
    });
  },

  // Get all action types
  getAllActionTypes: () => {
    return axiosServices.get(`${BASE_URL}/actions`);
  },

  // Get audit logs by action
  getAuditLogsByAction: (action, page = 0, size = 20) => {
    return axiosServices.get(`${BASE_URL}/action/${action}`, {
      params: { page, size }
    });
  }
};
