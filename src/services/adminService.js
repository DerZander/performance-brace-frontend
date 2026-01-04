import api from './api';

const adminService = {
  // Alle Benutzer abrufen
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Benutzerrolle ändern
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Benutzer löschen
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

export default adminService;

