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
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = authService.getToken();

        if (currentUser && token) {
          // Validiere Token beim Laden - wenn Backend nicht läuft, überspringen
          try {
            const isValid = await authService.validateToken();
            if (isValid) {
              setUser(currentUser);
            } else {
              // Token ungültig, logout
              authService.logout();
              setUser(null);
            }
          } catch (error) {
            // Backend nicht erreichbar oder Fehler - nutze gespeicherte Daten
            console.warn('Token-Validierung fehlgeschlagen, verwende LocalStorage:', error);
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Fehler beim Initialisieren der Authentifizierung:', error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const userData = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role
    };
    setUser(userData);
    return data;
  };

  const register = async (email, password, firstName, lastName) => {
    const data = await authService.register(email, password, firstName, lastName);
    const userData = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role
    };
    setUser(userData);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUserFromServer();
      setUser(userData);
      return userData;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
