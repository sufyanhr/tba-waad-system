// src/contexts/JWTContext.jsx
import { createContext, useEffect, useReducer, useRef, useCallback } from 'react';
import jwtDecode from 'jwt-decode';

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

  // ======================= INIT ==========================
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (token && verifyToken(token)) {
          setSession(token);
          // غيّر هذا المسار حسب ما عملناه في الـ backend
          const { data } = await axios.get('/api/auth/me');

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: data
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
      const { data } = await axios.post('/api/auth/login', {
        identifier,
        password
      });

      const token = data.token;
      const user = data.user;

      setSession(token);

      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });

      return user;
    },
    [dispatch]
  );

  // ======================= REGISTER ==========================
  const register = useCallback(async (formData) => {
    const { data } = await axios.post('/api/auth/register', formData);
    return data;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    dispatch({ type: LOGOUT });
  }, [dispatch]);

  // لتقليل تحذير الـ Context value changes on every render
  // use a ref + effect to keep a stable reference for the context value
  const contextValueRef = useRef({ ...state, login, logout, register });

  useEffect(() => {
    contextValueRef.current = { ...state, login, logout, register };
  }, [state, login, logout, register]);

  if (!state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={contextValueRef.current}>{children}</JWTContext.Provider>;
};

export default JWTContext;
