import axios from 'axios';
import { useRBACStore } from 'api/rbac';

// ==============================|| AXIOS CLIENT - FIXED ||============================== //

/**
 * CRITICAL FIXES:
 * 1. Force baseURL to http://localhost:8080/api
 * 2. Always attach Authorization header
 * 3. Proper employer header logic
 * 4. Enhanced error logging
 * 5. RBAC store cleanup on 401
 */

const axiosServices = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==============================|| REQUEST INTERCEPTOR - FIXED ||============================== //

axiosServices.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);

    // FIX #1: Always attach Authorization token
    const token = localStorage.getItem('serviceToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Authorization header attached');
    } else {
      console.warn('⚠️ No token found for request');
    }

    // FIX #2: Add Employer ID header with proper logic
    // - If user has EMPLOYER role => locked to their employerId
    // - Else (TBA staff) => use selectedEmployerId from switcher
    const { employerId, roles, user } = useRBACStore.getState();
    
    if (employerId) {
      config.headers['X-Employer-ID'] = employerId.toString();
      console.log('✅ X-Employer-ID header:', employerId);
    } else if (roles?.includes('EMPLOYER') && user?.employerId) {
      // Fallback: if RBAC store not initialized but user data exists
      config.headers['X-Employer-ID'] = user.employerId.toString();
      console.log('✅ X-Employer-ID header (fallback):', user.employerId);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ==============================|| RESPONSE INTERCEPTOR - FIXED ||============================== //

axiosServices.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} [${response.status}]`);
    return response;
  },
  (error) => {
    // FIX #3: Enhanced error logging
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    
    console.error(`❌ API Error: ${method} ${url} [${status}]`, error.response?.data);

    // FIX #4: Handle 401 (Unauthorized) - clear everything
    if (status === 401) {
      console.warn('🚫 401 Unauthorized - Clearing session and redirecting to login');
      
      // Clear token
      localStorage.removeItem('serviceToken');
      
      // Clear RBAC store
      useRBACStore.getState().clear();
      
      // Clear axios headers
      if (axiosServices.defaults.headers?.common?.Authorization) {
        delete axiosServices.defaults.headers.common.Authorization;
      }
      
      // Redirect to login
      window.location.href = '/login';
    }

    // FIX #5: Handle 403 (Forbidden) - stay on page but log
    if (status === 403) {
      console.error('🚫 403 Forbidden - Access denied to resource');
      // Don't redirect, let app handle it (might show 403 page)
    }

    // FIX #6: Handle 500 (Server Error)
    if (status === 500) {
      console.error('🔥 500 Server Error - Backend issue');
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
