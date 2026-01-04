import api from './api';

const exportService = {
  // Alle Gruppen als Excel exportieren
  exportAllGroups: async () => {
    const response = await api.get('/export/groups/excel', {
      responseType: 'blob',
    });

    // Dateiname aus Content-Disposition Header holen
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'Gruppen_Export.xlsx';

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Blob erstellen und Download triggern
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Einzelne Gruppe als Excel exportieren
  exportSingleGroup: async (groupId) => {
    const response = await api.get(`/export/groups/${groupId}/excel`, {
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `Gruppe_${groupId}.xlsx`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default exportService;

