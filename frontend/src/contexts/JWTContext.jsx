import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

// third-party
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project imports
import Loader from 'components/Loader';
import axios from 'utils/axios';

// ==============================|| JWT CONTEXT & PROVIDER - TBA BACKEND ||============================== //

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  try {
    const decoded = jwtDecode(serviceToken);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          
          // Call backend /api/auth/me to get current user
          const response = await axios.get('/api/auth/me');
          const userData = response.data.data; // Backend wraps in ApiResponse
          
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: userData.id,
                username: userData.username,
                fullName: userData.fullName,
                email: userData.email,
                roles: userData.roles || [],
                permissions: userData.permissions || []
              }
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (identifier, password) => {
    // Backend expects: { identifier: "username or email", password: "password" }
    const response = await axios.post('/api/auth/login', { identifier, password });
    const { token, user: userData } = response.data.data; // Backend wraps in ApiResponse
    
    setSession(token);
    
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: {
          id: userData.id,
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email,
          roles: userData.roles || [],
          permissions: userData.permissions || []
        }
      }
    });
  };

  const register = async (username, email, password, fullName) => {
    const response = await axios.post('/api/auth/register', {
      username,
      email,
      password,
      fullName
    });
    
    const { token, user: userData } = response.data.data;
    setSession(token);
    
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: {
          id: userData.id,
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email,
          roles: userData.roles || [],
          permissions: userData.permissions || []
        }
      }
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email) => {
    await axios.post('/api/auth/forgot-password', { email });
  };

  const updateProfile = () => {
    // TODO: Implement profile update if needed
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = { 
  children: PropTypes.node 
};

export default JWTContext;
