import { createContext, useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';

// reducer
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project imports
import Loader from 'components/Loader';
import axios from 'utils/axios'; // axiosServices الصحيح

// ==============================|| INITIAL STATE ||============================== //

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
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

          dispatch({
            type: LOGIN,
            payload: {
              user: userData
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

    dispatch({
      type: LOGIN,
      payload: { user: userData }
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
    // redirect to login to ensure UI resets
    try {
      window.location.href = '/login';
    } catch (e) {
      // ignore
    }
  };

  if (!state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ ...state, login, logout }}>
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
