# Backend API Endpoints für OAuth

## GitHub OAuth Endpoint

### POST `/api/auth/github`

Der Frontend sendet den Authorization Code, den es von GitHub erhält.

**Request:**
```json
{
  "code": "abc123..." // Der Code von GitHub
}
```

**Response bei Erfolg:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Max",
    "lastName": "Mustermann",
    "provider": "github",
    "githubId": "12345678"
  }
}
```

**Response bei Fehler:**
```json
{
  "message": "GitHub Login fehlgeschlagen: Invalid code"
}
```

---

## Backend Implementation Beispiel (Node.js/Express)

```javascript
// routes/auth.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// GitHub OAuth Configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

router.post('/auth/github', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code fehlt' });
  }

  try {
    // 1. Code gegen Access Token tauschen
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ message: 'Kein Access Token erhalten' });
    }

    // 2. User-Daten von GitHub holen
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = userResponse.data;

    // 3. E-Mail von GitHub holen (falls nicht public)
    let email = githubUser.email;
    if (!email) {
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const primaryEmail = emailResponse.data.find((e) => e.primary);
      email = primaryEmail?.email;
    }

    // 4. User in Datenbank finden oder erstellen
    let user = await User.findOne({ where: { githubId: githubUser.id } });

    if (!user) {
      // Neuen User erstellen
      user = await User.create({
        githubId: githubUser.id,
        email: email,
        firstName: githubUser.name?.split(' ')[0] || githubUser.login,
        lastName: githubUser.name?.split(' ')[1] || '',
        provider: 'github',
        avatar: githubUser.avatar_url,
      });
    }

    // 5. JWT Token generieren
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Response an Frontend
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: user.provider,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('GitHub OAuth Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'GitHub Login fehlgeschlagen',
      error: error.response?.data?.error_description || error.message
    });
  }
});

module.exports = router;
```

---

## Environment Variables (Backend)

```env
GITHUB_CLIENT_ID=deine_github_client_id
GITHUB_CLIENT_SECRET=dein_github_client_secret
JWT_SECRET=dein_jwt_secret
```

---

## Datenbank Schema (Beispiel)

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  password VARCHAR(255), -- NULL für OAuth Users
  provider VARCHAR(50), -- 'email', 'github', 'google', 'facebook'
  githubId VARCHAR(100),
  googleId VARCHAR(100),
  facebookId VARCHAR(100),
  avatar VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Flow Zusammenfassung

1. **Frontend**: User klickt "GitHub" → Weiterleitung zu GitHub OAuth
2. **GitHub**: User autorisiert → Redirect zu Frontend mit `code`
3. **Frontend Callback**: Empfängt `code` → Sendet an Backend: `POST /api/auth/github`
4. **Backend**: 
   - Tauscht `code` gegen `access_token`
   - Holt User-Daten von GitHub API
   - Erstellt/Findet User in DB
   - Generiert JWT Token
   - Sendet Token + User zurück
5. **Frontend**: Speichert Token → Redirect zu Dashboard

---

## Test mit curl

```bash
# Simuliere Frontend Request
curl -X POST http://localhost/api/auth/github \
  -H "Content-Type: application/json" \
  -d '{"code": "github_code_hier"}'
```

---

## Wichtige Punkte

✅ **Client Secret bleibt im Backend** (niemals im Frontend!)
✅ **JWT Token** wird vom Backend generiert
✅ **User-Daten** werden in deiner Datenbank gespeichert
✅ **Access Token** von GitHub wird nicht ans Frontend geschickt
✅ **E-Mail** wird von GitHub geholt (für User-Identifikation)
