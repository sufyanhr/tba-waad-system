import httpClient from 'api/httpClient';

// ==============================|| REPORTS & STATISTICS API ||============================== //

const reportsApi = {
  /**
   * Get dashboard statistics
   * @returns {Promise<object>}
   */
  getDashboardStats: async () => {
    try {
      const response = await httpClient.get('/reports/dashboard');
      return response;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },

  /**
   * Get claims statistics
   * @param {object} params - Query parameters (dateFrom, dateTo, etc.)
   * @returns {Promise<object>}
   */
  getClaimsStats: async (params = {}) => {
    try {
      const response = await httpClient.get('/reports/claims', { params });
      return response;
    } catch (error) {
      console.error('Get claims stats error:', error);
      throw error;
    }
  },

  /**
   * Get financial summary
   * @param {object} params - Query parameters (period, year, month, etc.)
   * @returns {Promise<object>}
   */
  getFinancialSummary: async (params = {}) => {
    try {
      const response = await httpClient.get('/reports/financial', { params });
      return response;
    } catch (error) {
      console.error('Get financial summary error:', error);
      throw error;
    }
  },

  /**
   * Get claims by status
   * @returns {Promise<{pending: number, approved: number, rejected: number, total: number}>}
   */
  getClaimsByStatus: async () => {
    try {
      const response = await httpClient.get('/reports/claims/by-status');
      return response;
    } catch (error) {
      console.error('Get claims by status error:', error);
      throw error;
    }
  },

  /**
   * Get members statistics
   * @returns {Promise<object>}
   */
  getMembersStats: async () => {
    try {
      const response = await httpClient.get('/reports/members');
      return response;
    } catch (error) {
      console.error('Get members stats error:', error);
      throw error;
    }
  },

  /**
   * Get visits statistics
   * @param {object} params - Query parameters
   * @returns {Promise<object>}
   */
  getVisitsStats: async (params = {}) => {
    try {
      const response = await httpClient.get('/reports/visits', { params });
      return response;
    } catch (error) {
      console.error('Get visits stats error:', error);
      throw error;
    }
  },

  /**
   * Get employers statistics
   * @returns {Promise<object>}
   */
  getEmployersStats: async () => {
    try {
      const response = await httpClient.get('/reports/employers');
      return response;
    } catch (error) {
      console.error('Get employers stats error:', error);
      throw error;
    }
  },

  /**
   * Export report to Excel
   * @param {string} reportType - Type of report (claims, members, visits, etc.)
   * @param {object} params - Query parameters
   * @returns {Promise<Blob>}
   */
  exportToExcel: async (reportType, params = {}) => {
    try {
      const response = await httpClient.get(`/reports/${reportType}/export/excel`, {
        params,
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Export to Excel error:', error);
      throw error;
    }
  },

  /**
   * Export report to PDF
   * @param {string} reportType - Type of report
   * @param {object} params - Query parameters
   * @returns {Promise<Blob>}
   */
  exportToPDF: async (reportType, params = {}) => {
    try {
      const response = await httpClient.get(`/reports/${reportType}/export/pdf`, {
        params,
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Export to PDF error:', error);
      throw error;
    }
  },

  /**
   * Get custom report
   * @param {object} reportConfig - Report configuration
   * @returns {Promise<object>}
   */
  getCustomReport: async (reportConfig) => {
    try {
      const response = await httpClient.post('/reports/custom', reportConfig);
      return response;
    } catch (error) {
      console.error('Get custom report error:', error);
      throw error;
    }
  }
};

export default reportsApi;
