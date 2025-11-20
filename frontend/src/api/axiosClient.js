import axios from 'axios';
import toast from 'react-hot-toast';

// Unified Axios client for TBA-WAAD
const axiosClient = axios.create({
  baseURL: 'http://localhost:9092/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        toast.error('Session expired. Please login again.');
        if (!window.location.pathname.startsWith('/auth/login')) {
          window.location.href = '/auth/login';
        }
      } else {
        // Map to ApiError schema if present
        const data = response.data;
        const apiError = data && data.status === 'error' ? data : null;
        const message = apiError?.message || data?.message || `Request failed (${response.status})`;
        toast.error(message);
      }
    } else if (error.request) {
      toast.error('Network error. Check your connection.');
    } else {
      toast.error(error.message);
    }
    return Promise.reject(error);
  }
);

export const get = (url, config) => axiosClient.get(url, config).then(r => r.data);
export const post = (url, body, config) => axiosClient.post(url, body, config).then(r => r.data);
export const put = (url, body, config) => axiosClient.put(url, body, config).then(r => r.data);
export const del = (url, config) => axiosClient.delete(url, config).then(r => r.data);

export default axiosClient;
