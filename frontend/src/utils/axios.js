import axios from 'axios';

// ==============================|| AXIOS CLIENT - FIXED ||============================== //

const axiosServices = axios.create({
  baseURL: 'http://localhost:8080/api',   // FIXED AND FORCED
  timeout: 30000
});

// ==============================|| REQUEST INTERCEPTOR ||============================== //
axiosServices.interceptors.request.use(
  (config) => {
    // Add Authorization token
    const token = localStorage.getItem('serviceToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add Company ID header for multi-company filtering
    const companyId = localStorage.getItem('selectedCompanyId');
    if (companyId) {
      config.headers['X-Company-ID'] = companyId;
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

// ==============================|| LEGACY FETCHERS (for backward compatibility) ||============================== //
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

export default axiosServices;
