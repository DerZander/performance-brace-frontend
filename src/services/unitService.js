import apiClient from './api';

const unitService = {
  // Alle Einheiten abrufen
  getAllUnits: async () => {
    const response = await apiClient.get('/units');
    return response.data;
  },

  // Einheit nach ID abrufen
  getUnitById: async (id) => {
    const response = await apiClient.get(`/units/${id}`);
    return response.data;
  },

  // Neue Einheit erstellen
  createUnit: async (unitData) => {
    const response = await apiClient.post('/units', unitData);
    return response.data;
  },

  // Einheit aktualisieren
  updateUnit: async (id, unitData) => {
    const response = await apiClient.put(`/units/${id}`, unitData);
    return response.data;
  },

  // Einheit löschen
  deleteUnit: async (id) => {
    const response = await apiClient.delete(`/units/${id}`);
    return response.data;
  },
};

export default unitService;



