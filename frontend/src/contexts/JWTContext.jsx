import { createContext, useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';

// reducer
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project imports
import Loader from 'components/Loader';
import axios from 'utils/axios'; // axiosServices الصحيح
import { useRBACStore } from 'api/rbac'; // RBAC Zustand store

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
  } catch {
    return false;
  }
};

const setSession = (token) => {
  if (token) {
    localStorage.setItem('serviceToken', token);
    if (!axios.defaults.headers) axios.defaults.headers = {};
    if (!axios.defaults.headers.common) axios.defaults.headers.common = {};
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('serviceToken');
    if (axios.defaults.headers?.common?.Authorization) delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| CONTEXT ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('serviceToken');

        if (token && verifyToken(token)) {
          setSession(token);

          const response = await axios.get('/auth/me'); // ✔ بدون /api
          const userData = response.data.data;

          // Initialize RBAC store (Phase 1.5)
          useRBACStore.getState().initialize(userData);

          dispatch({
            type: LOGIN,
            payload: {
              user: userData,
              roles: userData.roles || [],
              permissions: userData.permissions || []
            }
          });
        } else {
          dispatch({ type: LOGOUT });
        }
      } catch (e) {
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);

  // ==============================|| LOGIN ||============================== //

  const login = async (identifier, password) => {
    const response = await axios.post('/auth/login', {
      identifier,
      password
    });

    const { token, user: userData } = response.data.data;

    setSession(token);

    // Initialize RBAC store (Phase 1.5)
    useRBACStore.getState().initialize(userData);

    dispatch({
      type: LOGIN,
      payload: { 
        user: userData,
        roles: userData.roles || [],
        permissions: userData.permissions || []
      }
    });

    // Phase 1.5: Auto-redirect based on role (updated for new role names)
    return getRedirectPath(userData.roles);
  };

  /**
   * Phase 1.5: Get redirect path based on user role (updated for new role names)
   * @param {string[]} roles - Array of user roles
   * @returns {string} - Redirect path
   */
  const getRedirectPath = useCallback((roles) => {
    if (!roles || roles.length === 0) return '/profile';

    // Priority order for roles (Phase 1.5 role names)
    if (roles.includes('ADMIN')) return '/dashboard';
    if (roles.includes('INSURANCE_COMPANY')) return '/dashboard';
    if (roles.includes('EMPLOYER')) return '/members';
    if (roles.includes('REVIEWER')) return '/claims';
    
    // Default fallback
    return '/profile';
  }, []);

  const logout = () => {
    setSession(null);
    
    // Clear RBAC store (Phase 1.5)
    useRBACStore.getState().clear();
    
    dispatch({ type: LOGOUT });
    // redirect to login to ensure UI resets
    try {
      window.location.href = '/login';
    } catch (e) {
      // ignore
    }
  };

  // ==============================|| RBAC HELPER METHODS ||============================== //

  /**
   * Check if user has a specific role
   * @param {string} roleName - The role to check (e.g., 'ADMIN', 'TBA_OPERATIONS')
   * @returns {boolean}
   */
  const hasRole = (roleName) => {
    if (!state.roles || state.roles.length === 0) return false;
    return state.roles.includes(roleName);
  };

  /**
   * Check if user has ANY of the specified roles
   * @param {string[]} roleNames - Array of roles to check
   * @returns {boolean}
   */
  const hasAnyRole = (roleNames) => {
    if (!state.roles || state.roles.length === 0) return false;
    return roleNames.some((role) => state.roles.includes(role));
  };

  /**
   * Check if user has ALL of the specified roles
   * @param {string[]} roleNames - Array of roles to check
   * @returns {boolean}
   */
  const hasAllRoles = (roleNames) => {
    if (!state.roles || state.roles.length === 0) return false;
    return roleNames.every((role) => state.roles.includes(role));
  };

  /**
   * Check if user has a specific permission
   * @param {string} permission - The permission to check
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (!state.permissions || state.permissions.length === 0) return false;
    return state.permissions.includes(permission);
  };

  /**
   * Check if user is ADMIN
   * @returns {boolean}
   */
  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  /**
   * Check if user has any TBA role (TBA_OPERATIONS, TBA_MEDICAL_REVIEWER, TBA_FINANCE, etc.)
   * @returns {boolean}
   */
  const isTBAStaff = () => {
    if (!state.roles || state.roles.length === 0) return false;
    return state.roles.some((role) => role.startsWith('TBA_'));
  };

  if (!state.isInitialized) {
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
