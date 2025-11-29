import axios from 'axios';

// ==============================|| AXIOS CLIENT - FIXED ||============================== //

const axiosServices = axios.create({
  baseURL: 'http://localhost:8080/api',   // FIXED AND FORCED
  timeout: 30000
});

// ==============================|| REQUEST INTERCEPTOR ||============================== //
axiosServices.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('serviceToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================|| RESPONSE INTERCEPTOR ||============================== //
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('serviceToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosServices;
