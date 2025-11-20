import { createContext, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('accessToken');
    const u = localStorage.getItem('user');
    if (t && u) {
      setAccessToken(t);
      try { setUser(JSON.parse(u)); } catch { /* ignore parse error */ }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const hasRole = (role) => !!user?.roles?.some((r) => (r?.name ?? r) === role);

  const hasPermission = (perm) => !!user?.roles?.some((r) => r?.permissions?.some((p) => (p?.name ?? p) === perm));

  const value = useMemo(() => ({
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    loading,
    login,
    logout,
    hasRole,
    hasPermission
  }), [user, accessToken, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };
