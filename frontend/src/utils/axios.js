import axios from 'axios';

// ==============================|| AXIOS CLIENT - TBA BACKEND INTEGRATION ||============================== //

const axiosServices = axios.create({ 
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:9092',
  timeout: 30000
});

// ==============================|| REQUEST INTERCEPTOR ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==============================|| RESPONSE INTERCEPTOR ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401 && !window.location.href.includes('/login')) {
      localStorage.removeItem('serviceToken');
      window.location.pathname = '/login';
    }
    
    // Return structured error
    const errorMessage = error.response?.data?.message || error.message || 'Network Error';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export default axiosServices;

// ==============================|| UTILITY FETCHERS ||============================== //

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.get(url, { ...config });
  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.post(url, { ...config });
  return res.data;
};
