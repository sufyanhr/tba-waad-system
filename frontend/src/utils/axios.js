import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9090',
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !window.location.href.includes('/auth/login')) {
      localStorage.removeItem('accessToken');
      window.location.pathname = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, bodyOrConfig] = Array.isArray(args) ? args : [args];
  const { data, ...config } = bodyOrConfig || {};
  const res = await axiosInstance.post(url, data ?? bodyOrConfig, { ...config });
  return res.data;
};
