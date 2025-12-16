import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prüfe, ob User bereits eingeloggt ist
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (email, password, firstName, lastName) => {
    const data = await authService.register(email, password, firstName, lastName);
    setUser(data.user);
    return data;
  };

  const loginWithGoogle = async (token) => {
    const data = await authService.loginWithGoogle(token);
    setUser(data.user);
    return data;
  };

  const loginWithFacebook = async (token) => {
    const data = await authService.loginWithFacebook(token);
    setUser(data.user);
    return data;
  };

  const loginWithGitHub = async (code) => {
    const data = await authService.loginWithGitHub(code);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    loginWithGitHub,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
