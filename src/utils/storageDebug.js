// LocalStorage Debug Utility
// Füge diese Datei in den Browser-Console ein, um localStorage zu debuggen

const StorageDebug = {
  // Alle localStorage Daten anzeigen
  showAll() {
    console.log('=== LocalStorage Inhalte ===');
    console.log('Token:', localStorage.getItem('authToken'));
    console.log('User (Raw):', localStorage.getItem('user'));

    const user = localStorage.getItem('user');
    if (user) {
      try {
        console.log('User (Parsed):', JSON.parse(user));
      } catch (e) {
        console.error('User kann nicht geparst werden:', e);
      }
    }
    console.log('========================');
  },

  // Token prüfen
  checkToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('✅ Token vorhanden');
      console.log('Token-Länge:', token.length);
      console.log('Token-Anfang:', token.substring(0, 20) + '...');
      return true;
    } else {
      console.log('❌ Token fehlt');
      return false;
    }
  },

  // User prüfen
  checkUser() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('✅ User vorhanden');
        console.log('User-Daten:', userData);
        console.log('- ID:', userData.id);
        console.log('- Email:', userData.email);
        console.log('- Name:', userData.firstName, userData.lastName);
        console.log('- Rolle:', userData.role);
        return true;
      } catch (e) {
        console.log('❌ User vorhanden aber ungültig:', e);
        return false;
      }
    } else {
      console.log('❌ User fehlt');
      return false;
    }
  },

  // Vollständiger Check
  fullCheck() {
    console.log('\n=== Vollständiger LocalStorage Check ===');
    const hasToken = this.checkToken();
    const hasUser = this.checkUser();

    if (hasToken && hasUser) {
      console.log('\n✅ Alles OK - User sollte eingeloggt sein');
    } else {
      console.log('\n❌ Problem gefunden - User ist nicht vollständig eingeloggt');
      if (!hasToken) console.log('  → Token fehlt');
      if (!hasUser) console.log('  → User-Daten fehlen');
    }
    console.log('=====================================\n');
  },

  // Test-User erstellen
  createTestUser() {
    console.log('Erstelle Test-User...');
    const testUser = {
      id: 999,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'ADMIN'
    };

    localStorage.setItem('authToken', 'test-token-12345-67890');
    localStorage.setItem('user', JSON.stringify(testUser));

    console.log('✅ Test-User erstellt');
    console.log('Lade Seite neu (F5) um Test zu sehen');
    this.showAll();
  },

  // Alles löschen
  clearAll() {
    console.log('Lösche alle localStorage Daten...');
    localStorage.clear();
    console.log('✅ Alle Daten gelöscht');
    console.log('Lade Seite neu (F5) um Effekt zu sehen');
  },

  // Nur Token löschen
  clearToken() {
    localStorage.removeItem('authToken');
    console.log('✅ Token gelöscht');
  },

  // Nur User löschen
  clearUser() {
    localStorage.removeItem('user');
    console.log('✅ User gelöscht');
  },

  // Network-Requests überwachen
  monitorRequests() {
    console.log('Überwache API-Requests...');
    console.log('Öffne F12 → Network Tab');
    console.log('Filter auf "XHR" oder "Fetch"');
    console.log('Führe Login aus und beobachte:');
    console.log('  1. POST /auth/login - Response sollte token enthalten');
    console.log('  2. GET /auth/me - Mit Authorization Header');
  },

  // Hilfe anzeigen
  help() {
    console.log('\n=== StorageDebug Hilfe ===');
    console.log('StorageDebug.showAll()         - Zeigt alle localStorage Daten');
    console.log('StorageDebug.checkToken()      - Prüft ob Token vorhanden ist');
    console.log('StorageDebug.checkUser()       - Prüft ob User vorhanden ist');
    console.log('StorageDebug.fullCheck()       - Vollständiger Check');
    console.log('StorageDebug.createTestUser()  - Erstellt Test-User (zum Testen)');
    console.log('StorageDebug.clearAll()        - Löscht alle Daten');
    console.log('StorageDebug.clearToken()      - Löscht nur Token');
    console.log('StorageDebug.clearUser()       - Löscht nur User');
    console.log('StorageDebug.monitorRequests() - Anleitung für Network-Monitoring');
    console.log('StorageDebug.help()            - Zeigt diese Hilfe');
    console.log('=========================\n');
  }
};

// Auto-Start
console.log('StorageDebug Utility geladen!');
console.log('Tippe "StorageDebug.help()" für Hilfe');
console.log('Oder "StorageDebug.fullCheck()" für einen Quick-Check\n');

// Export für Node.js (falls benötigt)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageDebug;
}

