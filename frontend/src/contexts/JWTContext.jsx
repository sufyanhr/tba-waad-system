// src/contexts/JWTContext.jsx
import { createContext, useEffect, useReducer, useRef, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';
// project imports
import Loader from 'components/Loader';
import axios from 'utils/axios';

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// التحقق من صلاحية التوكن
const verifyToken = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Invalid JWT token', error);
    return false;
  }
};

// ضبط التوكن في localStorage و axios
const setSession = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Helper functions for role and permission checks
  const hasRole = useCallback((role) => {
    return state.user?.roles?.includes(role) || false;
  }, [state.user]);

  const hasAnyRole = useCallback((roles) => {
    if (!roles || roles.length === 0) return true;
    return roles.some(role => hasRole(role));
  }, [hasRole]);

  const hasPermission = useCallback((permission) => {
    return state.user?.permissions?.includes(permission) || false;
  }, [state.user]);

  const hasAnyPermission = useCallback((permissions) => {
    if (!permissions || permissions.length === 0) return true;
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  // ======================= INIT ==========================
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (token && verifyToken(token)) {
          setSession(token);
          // Auto-restore user from token
          const decoded = jwtDecode(token);
          
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: decoded.userId,
                username: decoded.sub,
                fullName: decoded.fullName,
                email: decoded.email,
                roles: decoded.roles || [],
                permissions: decoded.permissions || []
              }
            }
          });
        } else {
          dispatch({ type: LOGOUT });
        }
      } catch (error) {
        console.error('Init auth error', error);
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, [dispatch]);

  // ======================= LOGIN ==========================
  const login = useCallback(
    async (identifier, password) => {
      try {
        const { data } = await axios.post('/api/auth/login', { identifier, password });

        const token = data.token;
        const user = data.user;

        setSession(token);

        dispatch({
          type: LOGIN,
          payload: { isLoggedIn: true, user }
        });

        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data || "Login failed" };
      }
    },
    [dispatch]
  );

  // ======================= REGISTER ==========================
  const register = useCallback(async (formData) => {
    try {
      const { data } = await axios.post('/api/auth/register', formData);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data || "Register failed" };
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    dispatch({ type: LOGOUT });
  }, [dispatch]);

  // لتقليل تحذير الـ Context value changes on every render
  // use a ref + effect to keep a stable reference for the context value
  const contextValueRef = useRef({ 
    ...state, 
    login, 
    logout, 
    register, 
    hasRole, 
    hasAnyRole, 
    hasPermission, 
    hasAnyPermission 
  });

  useEffect(() => {
    contextValueRef.current = { 
      ...state, 
      login, 
      logout, 
      register, 
      hasRole, 
      hasAnyRole, 
      hasPermission, 
      hasAnyPermission 
    };
  }, [state, login, logout, register, hasRole, hasAnyRole, hasPermission, hasAnyPermission]);

  if (!state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={contextValueRef.current}>{children}</JWTContext.Provider>;
};

export default JWTContext;
