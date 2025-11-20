import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:9092/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return data directly if it's wrapped in ApiResponse format
    if (response.data && response.data.status === 'success') {
      return response.data.data ? response.data : response;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }

      // Handle 403 Forbidden - No permission
      if (status === 403) {
        console.error('Access denied');
        // Optionally redirect to unauthorized page
      }

      // Extract error message
      const message = data?.message || data?.error || 'An error occurred';
      return Promise.reject(new Error(message));
    }

    // Network error
    if (error.request) {
      return Promise.reject(new Error('Network error - Please check your connection'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
