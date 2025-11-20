import apiClient from 'api/apiClient';

export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials);
  // Support ApiResponse wrapper or direct
  const data = response.data?.data ? response.data.data : response.data || response;
  const token = data.token;
  const user = data.user;
  return { token, user };
}

const authService = {
  // Login user
  async login(username, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password
      });

      const { token, user } = response.data || response;

      if (token && user) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user, token };
      }

      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, user } = response.data || response;

      if (token && user) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user, token };
      }

      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Get token
  getToken() {
    return localStorage.getItem('accessToken');
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      await apiClient.post('/auth/forgot-password', { email });
      return { success: true, message: 'Reset OTP sent to your email' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to send reset email'
      };
    }
  },

  // Reset password
  async resetPassword(email, otp, newPassword) {
    try {
      await apiClient.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to reset password'
      };
    }
  },

  // Check user role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  },

  // Check user permission
  hasPermission(permission) {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }
};

export default authService;
