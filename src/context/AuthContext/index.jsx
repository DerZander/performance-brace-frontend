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
        const token = authService.getToken();
        const cachedUser = authService.getCurrentUser();

        // Wenn Token UND User vorhanden sind, sofort laden
        if (token && cachedUser) {
          console.log('User aus Cache geladen:', cachedUser);
          setUser(cachedUser);
          setLoading(false);

          // Optional: Im Hintergrund frische Daten holen (ohne await)
          authService.getCurrentUserFromServer()
            .then(freshUserData => {
              console.log('Frische User-Daten geladen:', freshUserData);
              setUser(freshUserData);
            })
            .catch(error => {
              console.warn('Fehler beim Laden frischer Daten, behalte Cache:', error);
              // Bei Fehler einfach gecachte Daten behalten
            });
        } else {
          // Kein Token oder User - nicht eingeloggt
          console.log('Kein Token oder User gefunden');
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth-Initialisierung fehlgeschlagen:', error);
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
    // User sofort setzen
    setUser(userData);
    // Sicherstellen dass es in localStorage ist
    localStorage.setItem('user', JSON.stringify(userData));
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
    // User sofort setzen
    setUser(userData);
    // Sicherstellen dass es in localStorage ist
    localStorage.setItem('user', JSON.stringify(userData));
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

  // Rollen-Hilfsfunktionen
  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole(['ADMIN']);
  const isKreisjugendwart = () => hasRole(['KREISJUGENDWART']);
  const isJugendwart = () => hasRole(['JUGENDWART']);
  const canManageAll = () => hasRole(['ADMIN', 'KREISJUGENDWART']);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    hasRole,
    isAdmin,
    isKreisjugendwart,
    isJugendwart,
    canManageAll,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
