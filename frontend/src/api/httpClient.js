import axios from 'axios';
import { toast } from 'react-hot-toast';

// ==============================|| HTTP CLIENT - MAIN API ||============================== //

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token management
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setAccessToken = (token) => localStorage.setItem('accessToken', token);
const setRefreshToken = (token) => localStorage.setItem('refreshToken', token);
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// ==============================|| REQUEST INTERCEPTOR ||============================== //

httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==============================|| RESPONSE INTERCEPTOR ||============================== //

httpClient.interceptors.response.use(
  (response) => {
    // Return data.data if it exists (Spring Boot ApiResponse pattern)
    // Otherwise return data directly
    return response.data?.data !== undefined ? response.data.data : response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(httpClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          clearTokens();
          toast.error('Session expired. Please login again.');
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        // Attempt to refresh token
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092/api'}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { token, accessToken, refreshToken: newRefreshToken } = response.data?.data || response.data;
        const newToken = token || accessToken;
        
        setAccessToken(newToken);
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }

        isRefreshing = false;
        onTokenRefreshed(newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        clearTokens();
        toast.error('Session expired. Please login again.');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      const message = error.response.data?.message || 'Access denied. Insufficient permissions.';
      toast.error(message);
      console.error('Access forbidden:', message);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      const message = error.response.data?.message || 'Resource not found';
      toast.error(message);
      console.error('Resource not found:', error.config.url);
    }

    // Handle 400 Bad Request (validation errors)
    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Invalid request. Please check your input.';
      toast.error(message);
      console.error('Validation error:', error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      const message = error.response.data?.message || 'Internal server error. Please try again later.';
      toast.error(message);
      console.error('Server error:', message);
    }

    // Network or timeout errors
    if (!error.response) {
      const message = error.code === 'ECONNABORTED' 
        ? 'Request timeout. Please check your connection.' 
        : 'Network error. Please check your connection.';
      toast.error(message);
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ==============================|| EXPORT ||============================== //

export default httpClient;

// Export token management utilities
export { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens };
