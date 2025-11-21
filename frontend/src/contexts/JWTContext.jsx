import { createContext, useEffect, useReducer } from 'react';

// third-party
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project imports
import Loader from 'components/Loader';
import authService from 'services/authService';
import { getAccessToken } from 'api/httpClient';

// constant
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

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = getAccessToken();
        
        if (accessToken && verifyToken(accessToken)) {
          // Get user from localStorage first (faster)
          const storedUser = authService.getUser();
          
          if (storedUser) {
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user: storedUser
              }
            });
            
            // Optionally refresh user data from backend
            try {
              const response = await authService.getCurrentUser();
              const user = response.user || response;
              
              dispatch({
                type: LOGIN,
                payload: {
                  isLoggedIn: true,
                  user
                }
              });
            } catch (err) {
              console.error('Failed to refresh user data:', err);
              // Keep using stored user data
            }
          } else {
            // No stored user, fetch from backend
            const response = await authService.getCurrentUser();
            const user = response.user || response;
            
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user
              }
            });
          }
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

  const login = async (email, password) => {
    try {
      const { user } = await authService.login(email, password);
      
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });
      
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      const response = await authService.register({
        email,
        password,
        firstName,
        lastName
      });
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await authService.resetPassword(email, otp, newPassword);
      return response;
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      const user = response.user || response;
      
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });
      
      return user;
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      register, 
      resetPassword, 
      updateProfile 
    }}>
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;
