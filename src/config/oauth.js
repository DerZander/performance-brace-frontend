// OAuth Konfiguration für Social Logins

// Dynamische URL-Erkennung für Plesk-Deployment
const getBaseUrls = () => {
  // Prüfe ob wir in einer Browser-Umgebung sind
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;

    // Wenn wir nicht auf localhost sind, verwende die aktuelle Domain
    if (!currentOrigin.includes('localhost') && !currentOrigin.includes('127.0.0.1')) {
      return {
        api: `${currentOrigin}/api`,
        frontend: currentOrigin
      };
    }
  }

  // Fallback auf Environment-Variablen oder localhost
  return {
    api: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    frontend: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
  };
};

const { api: API_BASE_URL, frontend: FRONTEND_BASE_URL } = getBaseUrls();

export const OAUTH_CONFIG = {
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id',
    redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI || `${FRONTEND_BASE_URL}/auth/github/callback`,
    scope: 'read:user user:email',
    // authorizeUrl: 'https://github.com/login/oauth/authorize',
    authorizeUrl: `${API_BASE_URL}/oauth2/authorization/github`,
  },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id',
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${FRONTEND_BASE_URL}/auth/google/callback`,
    scope: 'profile email',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  },
  facebook: {
    clientId: import.meta.env.VITE_FACEBOOK_APP_ID || 'your_facebook_app_id',
    redirectUri: import.meta.env.VITE_FACEBOOK_REDIRECT_URI || `${FRONTEND_BASE_URL}/auth/facebook/callback`,
    scope: 'email,public_profile',
    authorizeUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  },
};

// Helper-Funktion zum Generieren der OAuth URL
export const getOAuthUrl = (provider) => {
  const config = OAUTH_CONFIG[provider];
  if (!config) {
    throw new Error(`Unbekannter Provider: ${provider}`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: provider === 'google' ? 'code' : 'code',
    state: generateState(), // CSRF Protection
  });

  if (provider === 'google') {
    params.append('access_type', 'offline');
    params.append('prompt', 'consent');
  }

  return `${config.authorizeUrl}?${params.toString()}`;
};

// Generiere einen zufälligen State-String für CSRF-Schutz
const generateState = () => {
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('oauth_state', state);
  return state;
};

// Validiere State nach Callback
export const validateState = (state) => {
  const savedState = sessionStorage.getItem('oauth_state');
  sessionStorage.removeItem('oauth_state');
  return state === savedState;
};
