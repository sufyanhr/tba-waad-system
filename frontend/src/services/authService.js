import httpClient, { setAccessToken, setRefreshToken, clearTokens } from 'api/httpClient';

// ==============================|| AUTH SERVICE ||============================== //

const authService = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: object, accessToken: string, refreshToken?: string}>}
   */
  async login(email, password) {
    try {
      const response = await httpClient.post('/auth/login', {
        identifier: email, // Backend accepts username or email as 'identifier'
        password
      });

      const { token, user } = response;

      // Backend returns 'token' not 'accessToken'
      const accessToken = token;

      // Store tokens
      setAccessToken(accessToken);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(user));

      return { user, accessToken, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<{user: object}>}
   */
  async register(userData) {
    try {
      const response = await httpClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    clearTokens();
    // Optional: call backend logout endpoint
    // await httpClient.post('/auth/logout');
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<{message: string}>}
   */
  async requestPasswordReset(email) {
    try {
      const response = await httpClient.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },

  /**
   * Reset password with OTP
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @param {string} newPassword - New password
   * @returns {Promise<{message: string}>}
   */
  async resetPassword(email, otp, newPassword) {
    try {
      const response = await httpClient.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      return response;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  /**
   * Verify OTP code
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @returns {Promise<{valid: boolean}>}
   */
  async verifyOTP(email, otp) {
    try {
      const response = await httpClient.post('/auth/verify-otp', { email, otp });
      return response;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<{user: object}>}
   */
  async getCurrentUser() {
    try {
      const response = await httpClient.get('/users/me');
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {object} userData - Updated user data
   * @returns {Promise<{user: object}>}
   */
  async updateProfile(userData) {
    try {
      const response = await httpClient.put('/users/me', userData);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.user || response));
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  /**
   * Get stored user data
   * @returns {object|null}
   */
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService;
