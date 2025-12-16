# GitHub OAuth Setup

## 1. GitHub OAuth App erstellen

1. Gehe zu [GitHub Developer Settings](https://github.com/settings/developers)
2. Klicke auf "New OAuth App"
3. Fülle das Formular aus:
   - **Application name**: Leistungsspange 2026 - Bedburg
   - **Homepage URL**: `http://localhost:5173` (für Development)
   - **Authorization callback URL**: `http://localhost:5173/auth/github/callback`
4. Klicke auf "Register application"
5. Kopiere die **Client ID**
6. Generiere ein neues **Client Secret** und kopiere es

## 2. Environment Variables konfigurieren

Erstelle eine `.env` Datei im Frontend-Ordner:

```env
VITE_GITHUB_CLIENT_ID=deine_github_client_id
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/auth/github/callback
```

**Wichtig**: Füge `.env` zur `.gitignore` hinzu, damit Secrets nicht im Repository landen!

## 3. Backend-Konfiguration

Das Backend muss folgenden Endpoint bereitstellen:

### POST `/api/auth/github`

**Request Body:**
```json
{
  "code": "github_authorization_code"
}
```

**Backend sollte:**
1. Den `code` gegen ein Access Token bei GitHub tauschen:
   ```
   POST https://github.com/login/oauth/access_token
   {
     "client_id": "YOUR_CLIENT_ID",
     "client_secret": "YOUR_CLIENT_SECRET",
     "code": "CODE_FROM_FRONTEND"
   }
   ```

2. Mit dem Access Token die User-Daten von GitHub holen:
   ```
   GET https://api.github.com/user
   Authorization: Bearer ACCESS_TOKEN
   ```

3. User in der Datenbank anlegen/finden und JWT-Token zurückgeben:
   ```json
   {
     "token": "jwt_token",
     "user": {
       "id": 1,
       "email": "user@example.com",
       "firstName": "Max",
       "lastName": "Mustermann"
     }
   }
   ```

## 4. OAuth Flow

### Frontend-Flow:
1. User klickt auf "GitHub" Button
2. Frontend generiert OAuth URL mit State (CSRF-Schutz)
3. User wird zu GitHub weitergeleitet
4. User autorisiert die App
5. GitHub leitet zurück zu `/auth/github/callback?code=...&state=...`
6. Callback-Seite validiert State
7. Code wird an Backend gesendet
8. Backend gibt JWT-Token zurück
9. User ist eingeloggt und wird zum Dashboard weitergeleitet

### Sicherheit:
- **State-Parameter**: Schützt vor CSRF-Angriffen
- **Code-Austausch**: Passiert im Backend (Client Secret bleibt geheim)
- **HTTPS in Production**: OAuth sollte nur über HTTPS laufen

## 5. Production Setup

Für Production musst du:
1. Eine neue OAuth App mit Production-URLs erstellen
2. Environment Variables auf dem Server setzen
3. Callback URLs anpassen:
   - Frontend: `https://deine-domain.de/auth/github/callback`
   - Backend: `https://api.deine-domain.de`

## Testen

1. Starte das Frontend: `npm run dev`
2. Gehe zu `/login`
3. Klicke auf "GitHub"
4. Autorisiere die App
5. Du solltest zum Dashboard weitergeleitet werden

## Troubleshooting

**"Redirect URI mismatch"**: 
- Prüfe, dass die Callback-URL in der GitHub App exakt übereinstimmt

**"Invalid State"**:
- State wird in sessionStorage gespeichert - stelle sicher, dass Cookies/Storage nicht blockiert sind

**"Token exchange failed"**:
- Prüfe Backend-Logs
- Stelle sicher, dass Client Secret im Backend korrekt ist
