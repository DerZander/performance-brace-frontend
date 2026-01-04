# Frontend - Anpassungen für das neue Backend

## Änderungen durchgeführt ✅

Das Frontend wurde vollständig an das neue Backend-Authentication-System angepasst.

### 1. authService.js - Komplett überarbeitet

**Änderungen:**
- ✅ Login verwendet jetzt `username` statt `email`
- ✅ Registrierung benötigt `username`, `email`, `password`, `firstName`, `lastName`
- ✅ Response-Struktur angepasst (Backend gibt User-Daten direkt zurück, nicht in `user`-Objekt)
- ✅ Token wird im `Authorization: Bearer <token>` Header gesendet
- ✅ User-Daten werden ohne Token gespeichert
- ✅ Neue Methode `getCurrentUserFromServer()` zum Abrufen aktueller User-Daten
- ✅ Neue Methode `validateToken()` zur Token-Validierung
- ✅ OAuth-Methoden entfernt (da Backend jetzt nur Username/Password nutzt)

**API Endpoints:**
```javascript
// Login
POST /auth/login
Body: { username, password }

// Register
POST /auth/register
Body: { username, email, password, firstName, lastName }

// Aktuellen User abrufen
GET /auth/me
Header: Authorization: Bearer <token>

// Token validieren
GET /auth/validate
Header: Authorization: Bearer <token>
```

### 2. AuthContext - Aktualisiert

**Änderungen:**
- ✅ `login()` erwartet jetzt `(username, password)`
- ✅ `register()` erwartet jetzt `(username, email, password, firstName, lastName)`
- ✅ Token-Validierung beim App-Start
- ✅ Neue Methode `refreshUser()` zum Aktualisieren der User-Daten
- ✅ OAuth-Methoden entfernt
- ✅ User-State korrekt strukturiert mit `id`, `username`, `email`, `firstName`, `lastName`, `role`

### 3. Login-Seite - Umgebaut

**Änderungen:**
- ✅ Username-Feld statt Email beim Login
- ✅ Bei Registrierung: Vorname, Nachname, Username, Email, Passwort
- ✅ Beim Login: Nur Username und Passwort
- ✅ Validation Hints hinzugefügt (Username min. 3 Zeichen, Passwort min. 6 Zeichen)
- ✅ Person-Icon für Username-Feld
- ✅ OAuth-Buttons entfernt
- ✅ Form wird beim Umschalten zwischen Login/Register zurückgesetzt

**UI Struktur:**

**Login:**
```
- Benutzername (required)
- Passwort (required)
- [Anmelden Button]
- [Noch kein Konto? Jetzt registrieren]
```

**Registrierung:**
```
- Vorname | Nachname (Side-by-side)
- Benutzername (min. 3 Zeichen)
- E-Mail
- Passwort (min. 6 Zeichen)
- [Registrieren Button]
- [Bereits registriert? Jetzt anmelden]
```

### 4. api.js - Unverändert

Der API-Client funktioniert bereits korrekt:
- ✅ Token wird automatisch zu Requests hinzugefügt
- ✅ 401-Fehler führen zu automatischem Logout
- ✅ Base URL: `http://localhost:8080/api`

## Datenfluss

### Login-Flow:
```
1. User gibt Username + Passwort ein
2. Frontend → POST /auth/login { username, password }
3. Backend validiert Credentials
4. Backend → { token, id, username, email, firstName, lastName, role }
5. Frontend speichert Token in localStorage
6. Frontend speichert User-Daten in localStorage
7. Frontend setzt User im Context
8. Redirect zu /dashboard
```

### Registrierung-Flow:
```
1. User gibt alle Daten ein (Vorname, Nachname, Username, Email, Passwort)
2. Frontend → POST /auth/register { username, email, password, firstName, lastName }
3. Backend validiert Daten (Username/Email unique, Passwort min. 6 Zeichen)
4. Backend erstellt User mit gehashtem Passwort
5. Backend → { token, id, username, email, firstName, lastName, role }
6. Frontend speichert Token + User-Daten
7. Frontend setzt User im Context
8. Redirect zu /dashboard
```

### Geschützte Requests:
```
1. Frontend holt Token aus localStorage
2. api.js fügt Header hinzu: "Authorization: Bearer <token>"
3. Backend validiert Token
4. Backend extrahiert User aus Token (Principal)
5. Backend führt Request aus
```

## LocalStorage Struktur

**authToken:**
```
"eyJhbGciOiJIUzUxMiJ9..."
```

**user:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "USER"
}
```

## User-Objekt im Context

```javascript
const { user, isAuthenticated, login, register, logout, refreshUser } = useAuth();

// user = {
//   id: 1,
//   username: "admin",
//   email: "admin@example.com",
//   firstName: "Admin",
//   lastName: "User",
//   role: "USER"
// }
```

## Verwendung im Code

### Login:
```javascript
import { useAuth } from '../../context/AuthContext';

const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login(username, password);
    navigate('/dashboard');
  } catch (error) {
    console.error('Login fehlgeschlagen:', error);
  }
};
```

### Registrierung:
```javascript
import { useAuth } from '../../context/AuthContext';

const { register } = useAuth();

const handleRegister = async () => {
  try {
    await register(username, email, password, firstName, lastName);
    navigate('/dashboard');
  } catch (error) {
    console.error('Registrierung fehlgeschlagen:', error);
  }
};
```

### User-Daten anzeigen:
```javascript
import { useAuth } from '../../context/AuthContext';

const { user } = useAuth();

return (
  <div>
    <h1>Willkommen, {user.firstName}!</h1>
    <p>Username: {user.username}</p>
    <p>Email: {user.email}</p>
    <p>Rolle: {user.role}</p>
  </div>
);
```

### Geschützte API-Calls:
```javascript
import apiClient from '../services/api';

// Token wird automatisch hinzugefügt
const response = await apiClient.get('/some-protected-endpoint');
```

## Testing

### Frontend starten:
```bash
cd frontend
npm install  # Falls noch nicht geschehen
npm run dev
```

### Test-Ablauf:

1. **Registrierung testen:**
   - Öffne http://localhost:5173
   - Klicke "Noch kein Konto? Jetzt registrieren"
   - Fülle alle Felder aus:
     - Vorname: Max
     - Nachname: Mustermann
     - Benutzername: maxmuster (min. 3 Zeichen)
     - E-Mail: max@example.com
     - Passwort: test123 (min. 6 Zeichen)
   - Klicke "Registrieren"
   - Du solltest zu /dashboard weitergeleitet werden
   - Oben sollte stehen: "Willkommen, Max!"

2. **Logout testen:**
   - Klicke auf Logout (falls vorhanden)
   - Du wirst zu /login weitergeleitet

3. **Login testen:**
   - Gib Benutzername ein: maxmuster
   - Gib Passwort ein: test123
   - Klicke "Anmelden"
   - Du solltest zu /dashboard weitergeleitet werden

4. **Token-Persistenz testen:**
   - Nach Login: Seite neu laden (F5)
   - Du solltest weiterhin eingeloggt sein
   - Dashboard sollte angezeigt werden

5. **Token-Ablauf testen:**
   - Nach 24 Stunden läuft Token ab
   - Jeder API-Request sollte dann 401 zurückgeben
   - Automatischer Logout und Redirect zu /login

## Browser DevTools Check

### LocalStorage prüfen:
```
1. Öffne DevTools (F12)
2. Tab "Application" (Chrome) / "Storage" (Firefox)
3. LocalStorage → http://localhost:5173
4. Sollte enthalten:
   - authToken: "eyJh..."
   - user: "{\"id\":1,...}"
```

### Network-Requests prüfen:
```
POST http://localhost:8080/api/auth/login
Request Headers:
  Content-Type: application/json
Request Body:
  {"username":"maxmuster","password":"test123"}
Response:
  {"token":"eyJh...","id":1,"username":"maxmuster",...}

GET http://localhost:8080/api/some-endpoint
Request Headers:
  Authorization: Bearer eyJh...
  Content-Type: application/json
```

## Fehlerbehandlung

### Login-Fehler:
- **"Ungültige Anmeldedaten"** → Username oder Passwort falsch
- **Network Error** → Backend läuft nicht

### Registrierungs-Fehler:
- **"Username ist bereits vergeben"** → Username bereits vorhanden
- **"Email ist bereits registriert"** → Email bereits vorhanden
- Validierungsfehler werden als Alert angezeigt

### Token-Fehler:
- **401 Unauthorized** → Token ungültig/abgelaufen
  - Automatischer Logout
  - Redirect zu /login
- **403 Forbidden** → Keine Berechtigung für Ressource

## Zusammenfassung

✅ **3 Dateien aktualisiert:**
1. `authService.js` - Backend-Integration
2. `AuthContext/index.jsx` - State Management
3. `Login/index.jsx` - UI Components

✅ **Features:**
- Username-basiertes Login
- Vollständige Registrierung
- JWT Token Management
- Automatische Token-Validierung
- Persistentes Login (LocalStorage)
- Automatischer Logout bei 401

✅ **Kompatibilität:**
- ✅ Backend API-Struktur
- ✅ JWT Token Format
- ✅ User Principal System
- ✅ CORS-Konfiguration

**Das Frontend ist vollständig an das neue Backend angepasst und einsatzbereit!** 🎉

