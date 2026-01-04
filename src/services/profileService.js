import apiClient from './api';

const profileService = {
  // Eigenes Profil abrufen
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  // Profil aktualisieren
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  },

  // Passwort ändern
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/user/profile/password', passwordData);
    return response.data;
  },

  // Profil löschen
  deleteProfile: async () => {
    const response = await apiClient.delete('/user/profile');
    return response.data;
  },
};

export default profileService;

