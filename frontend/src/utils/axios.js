import axios from 'axios';

// ==============================|| AXIOS CLIENT - TBA BACKEND INTEGRATION ||============================== //

// baseURL should be the backend origin (no trailing /)
// All requests should be made with a leading /api prefix (or will be normalized by helper below)
const axiosServices = axios.create({ 
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8080',
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

// Normalize API url so it always uses the configured API root
const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  // If it's a full URL already, do nothing
  if (/^https?:\/\//i.test(url)) return url;
  // Add leading slash if missing
  if (!url.startsWith('/')) url = '/' + url;
  // If it already contains the api prefix, return as-is
  if (url.startsWith('/api/')) return url;
  // If it contains '/api' after slash (eg '/apix'), return '/api/...' otherwise prefix '/api'
  return `/api${url}`;
};

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.get(normalizeUrl(url), { ...config });
  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, data, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.post(normalizeUrl(url), data, { ...config });
  return res.data;
};
