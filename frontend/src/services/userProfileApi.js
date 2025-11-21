import httpClient from 'api/httpClient';

// ==============================|| USER PROFILE API ||============================== //

const userProfileApi = {
  /**
   * Get current user profile
   * @returns {Promise<object>}
   */
  getProfile: async () => {
    try {
      const response = await httpClient.get('/users/me');
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update current user profile
   * @param {object} data - Updated profile data
   * @returns {Promise<object>}
   */
  updateProfile: async (data) => {
    try {
      const response = await httpClient.put('/users/me', data);
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Change password
   * @param {object} data - {currentPassword, newPassword}
   * @returns {Promise<object>}
   */
  changePassword: async (data) => {
    try {
      const response = await httpClient.put('/users/me/password', data);
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Upload profile avatar
   * @param {File} file - Avatar image file
   * @returns {Promise<{url: string}>}
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await httpClient.post('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  },

  /**
   * Get user settings
   * @returns {Promise<object>}
   */
  getSettings: async () => {
    try {
      const response = await httpClient.get('/users/me/settings');
      return response;
    } catch (error) {
      console.error('Get settings error:', error);
      throw error;
    }
  },

  /**
   * Update user settings
   * @param {object} settings - User settings
   * @returns {Promise<object>}
   */
  updateSettings: async (settings) => {
    try {
      const response = await httpClient.put('/users/me/settings', settings);
      return response;
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  },

  /**
   * Get user activities log
   * @param {object} params - Query parameters
   * @returns {Promise<Array>}
   */
  getActivities: async (params = {}) => {
    try {
      const response = await httpClient.get('/users/me/activities', { params });
      return response;
    } catch (error) {
      console.error('Get activities error:', error);
      throw error;
    }
  }
};

export default userProfileApi;
