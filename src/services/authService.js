import apiClient from './api';

class AuthService {
  // Email/Password Login
  async login(email, password) {
    try {
      const response = await apiClient.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login fehlgeschlagen';
    }
  }

  // Email/Password Registrierung
  async register(email, password, firstName, lastName) {
    try {
      const response = await apiClient.post('/register', {
        email,
        password,
        firstName,
        lastName,
      });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registrierung fehlgeschlagen';
    }
  }

  // Google OAuth Login
  async loginWithGoogle(token) {
    try {
      const response = await apiClient.post('/google', { token });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Google Login fehlgeschlagen';
    }
  }

  // Facebook OAuth Login
  async loginWithFacebook(token) {
    try {
      const response = await apiClient.post('/facebook', { token });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Facebook Login fehlgeschlagen';
    }
  }

  // GitHub OAuth Login
  async loginWithGitHub(code) {
    try {
      const response = await apiClient.post('/github', { code });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'GitHub Login fehlgeschlagen';
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Aktuellen User abrufen
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
