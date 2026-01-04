import apiClient from './api';

class GroupService {
  // Alle Gruppen abrufen (für Admins und Kreisjugendwarte, wenn sie auf "Alle Gruppen" klicken)
  async getAllGroupsForAdmins() {
    try {
      const response = await apiClient.get('/groups/all');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Laden aller Gruppen';
    }
  }

  // Alle Gruppen des aktuellen Users abrufen
  async getAllGroups() {
    try {
      const response = await apiClient.get('/groups');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Laden der Gruppen';
    }
  }

  // Alle Gruppen des Users abrufen
  async getGroups() {
    try {
      const response = await apiClient.get('/groups/my');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Laden der Gruppen';
    }
  }

  // Einzelne Gruppe abrufen
  async getGroup(groupId) {
    try {
      const response = await apiClient.get(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Laden der Gruppe';
    }
  }

  // Neue Gruppe erstellen
  async createGroup(groupData) {
    try {
      const response = await apiClient.post('/groups', groupData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Erstellen der Gruppe';
    }
  }

  // Gruppe aktualisieren
  async updateGroup(groupId, groupData) {
    try {
      const response = await apiClient.put(`/groups/${groupId}`, groupData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Aktualisieren der Gruppe';
    }
  }

  // Gruppe löschen
  async deleteGroup(groupId) {
    try {
      const response = await apiClient.delete(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Löschen der Gruppe';
    }
  }

  // Mitglied zu Gruppe hinzufügen
  async addMember(groupId, memberData) {
    try {
      const response = await apiClient.post(`/groups/${groupId}/members`, memberData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Hinzufügen des Mitglieds';
    }
  }

  // Mitglied aktualisieren
  async updateMember(groupId, memberId, memberData) {
    try {
      const response = await apiClient.put(`/groups/${groupId}/members/${memberId}`, memberData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Aktualisieren des Mitglieds';
    }
  }

  // Mitglied löschen
  async deleteMember(groupId, memberId) {
    try {
      const response = await apiClient.delete(`/groups/${groupId}/members/${memberId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Fehler beim Löschen des Mitglieds';
    }
  }
}

export default new GroupService();
