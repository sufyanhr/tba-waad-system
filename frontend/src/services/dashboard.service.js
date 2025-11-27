import api from './api/axiosConfig';

/**
 * Dashboard Service
 * Provides analytics and KPI data aggregation from all modules
 */
const dashboardService = {
  /**
   * Get all KPIs (Key Performance Indicators)
   * @returns {Promise} KPIs data
   */
  getKPIs: async () => {
    try {
      const response = await api.get('/dashboard/kpis');
      return response.data;
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  },

  /**
   * Get claims trend over time (12 months)
   * @returns {Promise} Claims trend data
   */
  getClaimsTrend: async () => {
    try {
      const response = await api.get('/dashboard/claims/trend');
      return response.data;
    } catch (error) {
      console.error('Error fetching claims trend:', error);
      throw error;
    }
  },

  /**
   * Get claims distribution by employer
   * @returns {Promise} Claims by employer data
   */
  getClaimsByEmployer: async () => {
    try {
      const response = await api.get('/dashboard/claims/by-employer');
      return response.data;
    } catch (error) {
      console.error('Error fetching claims by employer:', error);
      throw error;
    }
  },

  /**
   * Get claims distribution by provider
   * @returns {Promise} Claims by provider data
   */
  getClaimsByProvider: async () => {
    try {
      const response = await api.get('/dashboard/claims/by-provider');
      return response.data;
    } catch (error) {
      console.error('Error fetching claims by provider:', error);
      throw error;
    }
  },

  /**
   * Get pre-authorization trend over time (12 months)
   * @returns {Promise} PreAuth trend data
   */
  getPreauthTrend: async () => {
    try {
      const response = await api.get('/dashboard/preauth/trend');
      return response.data;
    } catch (error) {
      console.error('Error fetching preauth trend:', error);
      throw error;
    }
  },

  /**
   * Get pre-authorization distribution by status
   * @returns {Promise} PreAuth by status data
   */
  getPreauthByStatus: async () => {
    try {
      const response = await api.get('/dashboard/preauth/by-status');
      return response.data;
    } catch (error) {
      console.error('Error fetching preauth by status:', error);
      throw error;
    }
  },

  /**
   * Get visits trend over time (12 months)
   * @returns {Promise} Visits trend data
   */
  getVisitsTrend: async () => {
    try {
      const response = await api.get('/dashboard/visits/trend');
      return response.data;
    } catch (error) {
      console.error('Error fetching visits trend:', error);
      throw error;
    }
  },

  /**
   * Get members growth trend over time (12 months)
   * @returns {Promise} Members trend data
   */
  getMembersTrend: async () => {
    try {
      const response = await api.get('/dashboard/members/trend');
      return response.data;
    } catch (error) {
      console.error('Error fetching members trend:', error);
      throw error;
    }
  },

  /**
   * Get latest claims (recent 5)
   * @returns {Promise} Latest claims data
   */
  getLatestClaims: async () => {
    try {
      const response = await api.get('/dashboard/latest-claims');
      return response.data;
    } catch (error) {
      console.error('Error fetching latest claims:', error);
      throw error;
    }
  },

  /**
   * Get latest pre-authorizations (recent 5)
   * @returns {Promise} Latest preauth data
   */
  getLatestPreauth: async () => {
    try {
      const response = await api.get('/dashboard/latest-preauth');
      return response.data;
    } catch (error) {
      console.error('Error fetching latest preauth:', error);
      throw error;
    }
  },

  /**
   * Get latest visits (recent 5)
   * @returns {Promise} Latest visits data
   */
  getLatestVisits: async () => {
    try {
      const response = await api.get('/dashboard/latest-visits');
      return response.data;
    } catch (error) {
      console.error('Error fetching latest visits:', error);
      throw error;
    }
  },

  /**
   * Get services usage by category
   * @returns {Promise} Services usage data
   */
  getServicesUsage: async () => {
    try {
      const response = await api.get('/dashboard/services/usage');
      return response.data;
    } catch (error) {
      console.error('Error fetching services usage:', error);
      throw error;
    }
  }
};

export default dashboardService;
