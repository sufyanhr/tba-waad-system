import { useState } from 'react';
import { auditService } from '../../services/systemadmin/audit.service';

export const useAuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    total: 0
  });

  // Fetch all audit logs
  const fetchAuditLogs = async (page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await auditService.getAllAuditLogs(page, size);
      setAuditLogs(response.data.data || []);
      setPagination({
        page: response.data.page || page,
        size: response.data.size || size,
        total: response.data.total || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  // Get audit logs by user
  const getAuditLogsByUser = async (userId, page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await auditService.getAuditLogsByUser(userId, page, size);
      setAuditLogs(response.data.data || []);
      setPagination({
        page: response.data.page || page,
        size: response.data.size || size,
        total: response.data.total || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs by user');
    } finally {
      setLoading(false);
    }
  };

  // Get audit logs by entity
  const getAuditLogsByEntity = async (entityType, entityId, page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await auditService.getAuditLogsByEntity(entityType, entityId, page, size);
      setAuditLogs(response.data.data || []);
      setPagination({
        page: response.data.page || page,
        size: response.data.size || size,
        total: response.data.total || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs by entity');
    } finally {
      setLoading(false);
    }
  };

  // Get all action types
  const fetchActionTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await auditService.getAllActionTypes();
      setActionTypes(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch action types');
    } finally {
      setLoading(false);
    }
  };

  // Get audit logs by action
  const getAuditLogsByAction = async (action, page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await auditService.getAuditLogsByAction(action, page, size);
      setAuditLogs(response.data.data || []);
      setPagination({
        page: response.data.page || page,
        size: response.data.size || size,
        total: response.data.total || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs by action');
    } finally {
      setLoading(false);
    }
  };

  return {
    auditLogs,
    actionTypes,
    loading,
    error,
    pagination,
    fetchAuditLogs,
    getAuditLogsByUser,
    getAuditLogsByEntity,
    fetchActionTypes,
    getAuditLogsByAction
  };
};
