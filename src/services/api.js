import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - fügt Token zu Anfragen hinzu
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - behandelt Fehler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Nicht umleiten wenn wir gerade beim Login/Register sind
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
                            error.config?.url?.includes('/auth/register');

      if (!isAuthEndpoint) {
        // Token abgelaufen oder ungültig - nur bei anderen Endpoints
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Nur umleiten wenn wir nicht bereits auf Login-Seite sind
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
