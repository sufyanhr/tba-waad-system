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

    // Add Employer ID header for multi-employer filtering
    // Logic: 
    // - If user has EMPLOYER role => use their employerId (auto-locked)
    // - Else (TBA staff) => use selectedEmployerId from localStorage
    try {
      const userRolesStr = localStorage.getItem('userRoles');
      const userRoles = userRolesStr ? JSON.parse(userRolesStr) : [];
      
      if (userRoles.includes('EMPLOYER')) {
        // EMPLOYER role: get from user data (if available via token decode)
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.employerId) {
            config.headers['X-Employer-ID'] = user.employerId.toString();
          }
        }
      } else {
        // TBA staff or other roles: use selected employer from switcher
        const employerId = localStorage.getItem('selectedEmployerId');
        if (employerId) {
          config.headers['X-Employer-ID'] = employerId;
        }
      }
    } catch (e) {
      // Ignore parsing errors
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
