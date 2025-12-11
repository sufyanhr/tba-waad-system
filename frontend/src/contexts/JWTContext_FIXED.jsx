import { createContext, useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';

// reducer
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project imports
import Loader from 'components/Loader';
import axios from 'utils/axios';
import { useRBACStore } from 'api/rbac';

// ==============================|| INITIAL STATE ||============================== //

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  roles: [],
  permissions: []
};

// ==============================|| TOKEN HELPERS ||============================== //

const verifyToken = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    return false;
  }
};

const setSession = (token) => {
  if (token) {
    localStorage.setItem('serviceToken', token);
    if (!axios.defaults.headers) axios.defaults.headers = {};
    if (!axios.defaults.headers.common) axios.defaults.headers.common = {};
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log('✅ Session token set');
  } else {
    localStorage.removeItem('serviceToken');
    if (axios.defaults.headers?.common?.Authorization) {
      delete axios.defaults.headers.common.Authorization;
    }
    console.log('🗑️ Session token cleared');
  }
};

// ==============================|| CONTEXT ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ==============================|| INITIALIZATION - FIXED ||============================== //

  useEffect(() => {
    const init = async () => {
      console.log('🔄 JWTContext: Starting initialization...');
      
      try {
        const token = localStorage.getItem('serviceToken');

        if (token && verifyToken(token)) {
          console.log('✅ Valid token found, fetching user data...');
          setSession(token);

          const response = await axios.get('/auth/me');
          const userData = response.data.data;

          console.log('✅ User data fetched:', userData);

          // CRITICAL FIX: Initialize RBAC store with userData
          useRBACStore.getState().initialize(userData);
          console.log('✅ RBAC store initialized');

          dispatch({
            type: LOGIN,
            payload: {
              user: userData,
              roles: userData.roles || [],
              permissions: userData.permissions || []
            }
          });

          console.log('✅ JWTContext initialization complete');
        } else {
          console.warn('⚠️ No valid token found, user not logged in');
          
          // CRITICAL FIX: Still initialize RBAC with empty state
          useRBACStore.getState().initialize(null);
          
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
        console.error('❌ JWTContext initialization failed:', err);
        
        // CRITICAL FIX: On error, clear everything safely
        setSession(null);
        useRBACStore.getState().clear();
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);

  // ==============================|| LOGIN - FIXED ||============================== //

  const login = async (identifier, password) => {
    console.log('🔄 Login attempt for:', identifier);
    
    try {
      const response = await axios.post('/auth/login', {
        identifier,
        password
      });

      const { token, user: userData } = response.data.data;

      console.log('✅ Login successful:', userData);

      setSession(token);

      // CRITICAL FIX: Initialize RBAC store with fresh userData
      useRBACStore.getState().initialize(userData);
      console.log('✅ RBAC store initialized after login');

      dispatch({
        type: LOGIN,
        payload: { 
          user: userData,
          roles: userData.roles || [],
          permissions: userData.permissions || []
        }
      });

      // Get redirect path based on role
      const redirectPath = getRedirectPath(userData.roles);
      console.log('✅ Login complete, redirecting to:', redirectPath);
      
      return redirectPath;
    } catch (err) {
      console.error('❌ Login failed:', err);
      throw err;
    }
  };

  // ==============================|| LOGOUT - FIXED ||============================== //

  const logout = () => {
    console.log('🔄 Logout initiated...');
    
    setSession(null);
    
    // CRITICAL FIX: Clear RBAC store
    useRBACStore.getState().clear();
    console.log('✅ RBAC store cleared');
    
    dispatch({ type: LOGOUT });
    
    // Hard redirect to login to ensure clean state
    console.log('🔄 Redirecting to /login...');
    window.location.href = '/login';
  };

  // ==============================|| REDIRECT LOGIC - FIXED ||============================== //

  /**
   * Get redirect path based on user role
   * CRITICAL FIX: Updated for new role names (Phase 1.5)
   * @param {string[]} roles - Array of user roles
   * @returns {string} - Redirect path
   */
  const getRedirectPath = useCallback((roles) => {
    if (!roles || roles.length === 0) {
      console.warn('⚠️ No roles found, redirecting to profile');
      return '/profile';
    }

    console.log('🔄 Determining redirect path for roles:', roles);

    // Priority order for roles (Phase 1.5 role names)
    if (roles.includes('ADMIN')) {
      console.log('✅ ADMIN role detected, redirecting to /dashboard');
      return '/dashboard';
    }
    if (roles.includes('INSURANCE_COMPANY')) {
      console.log('✅ INSURANCE_COMPANY role detected, redirecting to /dashboard');
      return '/dashboard';
    }
    if (roles.includes('EMPLOYER')) {
      console.log('✅ EMPLOYER role detected, redirecting to /members');
      return '/members';
    }
    if (roles.includes('REVIEWER')) {
      console.log('✅ REVIEWER role detected, redirecting to /claims');
      return '/claims';
    }
    
    // Default fallback
    console.warn('⚠️ No matching role, redirecting to /profile');
    return '/profile';
  }, []);

  // ==============================|| RBAC HELPER METHODS ||============================== //

  const hasRole = (roleName) => {
    if (!state.roles || state.roles.length === 0) return false;
    return state.roles.includes(roleName);
  };

  const hasAnyRole = (roleNames) => {
    if (!state.roles || state.roles.length === 0) return false;
    return roleNames.some((role) => state.roles.includes(role));
  };

  const hasAllRoles = (roleNames) => {
    if (!state.roles || state.roles.length === 0) return false;
    return roleNames.every((role) => state.roles.includes(role));
  };

  const hasPermission = (permission) => {
    if (!state.permissions || state.permissions.length === 0) return false;
    return state.permissions.includes(permission);
  };

  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  const isTBAStaff = () => {
    if (!state.roles || state.roles.length === 0) return false;
    return state.roles.some((role) => role.startsWith('TBA_'));
  };

  // CRITICAL FIX: Show loader with timeout warning
  if (!state.isInitialized) {
    console.log('🔄 JWTContext: Showing loader (waiting for initialization)...');
    return <Loader />;
  }

  return (
    <JWTContext.Provider 
      value={{ 
        ...state, 
        login, 
        logout, 
        hasRole, 
        hasAnyRole, 
        hasAllRoles, 
        hasPermission,
        isAdmin,
        isTBAStaff,
        getRedirectPath
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
