import apiClient from './api';

class AuthService {
  // Email/Password Login
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        // Speichere User-Daten ohne Token
        const userData = {
          id: response.data.id,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login fehlgeschlagen';
    }
  }

  // Registrierung
  async register(email, password, firstName, lastName) {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        // Speichere User-Daten ohne Token
        const userData = {
          id: response.data.id,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registrierung fehlgeschlagen';
    }
  }

  // Aktuellen User vom Server abrufen
  async getCurrentUserFromServer() {
    try {
      const response = await apiClient.get('/auth/me');
      const userData = {
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role
      };
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Abrufen der User-Daten';
    }
  }

  // Token validieren
  async validateToken() {
    try {
      const response = await apiClient.get('/auth/validate');
      return response.data;
    } catch (error) {
      return false;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Aktuellen User aus LocalStorage abrufen
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Prüfen, ob User eingeloggt ist
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Token abrufen
  getToken() {
    return localStorage.getItem('authToken');
  }
}

export default new AuthService();
