# Leistungsspange 2026 - Bedburg Feuerwehr Frontend

Ein modernes Frontend für die Anmeldung und Verwaltung der Leistungsspange 2026 in Bedburg.

## 🚒 Features

- **Authentifizierung**: Login mit E-Mail/Passwort sowie Social Login (Google, Facebook, GitHub)
- **Dashboard**: Übersicht über alle angelegten Gruppen
- **Gruppenverwaltung**: Erstellen, Bearbeiten und Löschen von Gruppen
- **Mitgliederverwaltung**: Hinzufügen von Mitgliedern mit Details (Vorname, Nachname, Geburtsdatum, Geburtsort, Alter)
- **Collapsible Tabellen**: Aufklappbare Gruppentabellen zur besseren Übersicht
- **Feuerwehr-Design**: Rot-gelbes Theme passend zur Feuerwehr

## 🛠️ Technologien

- **React** 18.3
- **Material-UI** (MUI) für moderne UI-Komponenten
- **React Router** für Navigation
- **Axios** für API-Calls
- **SCSS** für individuelles Styling
- **Vite** als Build-Tool

## 📦 Installation

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Production Build erstellen
npm run build

# Production Build lokal testen
npm run preview
```

## 🔧 Konfiguration

### Backend API

Die Backend-URL ist in [src/services/api.js](src/services/api.js) konfiguriert:

```javascript
const API_BASE_URL = 'http://localhost/api';
```

Passen Sie diese URL entsprechend Ihrer Backend-Konfiguration an.

### API Endpoints

Das Frontend erwartet folgende API-Endpoints:

#### Authentifizierung
- `POST /api/auth/login` - Email/Passwort Login
- `POST /api/auth/register` - Neue Registrierung
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/facebook` - Facebook OAuth
- `POST /api/auth/github` - GitHub OAuth

#### Gruppen
- `GET /api/groups` - Alle Gruppen des Users abrufen
- `GET /api/groups/:id` - Einzelne Gruppe abrufen
- `POST /api/groups` - Neue Gruppe erstellen
- `PUT /api/groups/:id` - Gruppe aktualisieren
- `DELETE /api/groups/:id` - Gruppe löschen

#### Mitglieder
- `POST /api/groups/:groupId/members` - Mitglied hinzufügen
- `PUT /api/groups/:groupId/members/:memberId` - Mitglied aktualisieren
- `DELETE /api/groups/:groupId/members/:memberId` - Mitglied löschen

## 📁 Projektstruktur

```
src/
├── components/          # Wiederverwendbare Komponenten
│   ├── Navbar.jsx
│   ├── Navbar.scss
│   └── PrivateRoute.jsx
├── pages/              # Seiten-Komponenten
│   ├── Login.jsx
│   ├── Login.scss
│   ├── Dashboard.jsx
│   ├── Dashboard.scss
│   ├── CreateGroup.jsx
│   └── CreateGroup.scss
├── services/           # API Services
│   ├── api.js
│   ├── authService.js
│   └── groupService.js
├── context/            # React Context
│   └── AuthContext.jsx
├── styles/             # Globale Styles
│   ├── theme.js
│   ├── variables.scss
│   └── global.scss
└── App.jsx             # Haupt-App-Komponente
```

## 🎨 Design-System

### Farben (Feuerwehr-Theme)

- **Primary (Rot)**: `#C1272D`
- **Secondary (Gelb)**: `#FFC107`
- **Background**: `#F5F5F5`
- **Text**: `#212121`

### Komponenten

- Material-UI Komponenten mit individuellem Feuerwehr-Theme
- Responsive Design für Mobile, Tablet und Desktop
- Animierte Übergänge und Hover-Effekte

## 🔐 Authentifizierung

Das Frontend verwendet JWT-Token für die Authentifizierung:

1. Nach erfolgreichem Login wird das Token im `localStorage` gespeichert
2. Das Token wird bei jedem API-Request im `Authorization` Header mitgesendet
3. Bei ungültigem Token (401-Response) erfolgt automatische Weiterleitung zum Login

## 🚀 Deployment

### Production Build

```bash
npm run build
```

Der optimierte Build wird im `dist/` Ordner erstellt.

### Umgebungsvariablen

Für verschiedene Umgebungen können Sie `.env` Dateien verwenden:

```env
VITE_API_BASE_URL=http://localhost/api
```

## 📱 Responsive Design

Die Anwendung ist vollständig responsive:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔜 Geplante Features

- E-Mail-Benachrichtigungen
- Export-Funktion für Gruppen/Mitglieder
- Profilverwaltung
- Statistiken und Berichte
- Druck-Ansicht für Teilnehmerlisten

## 👨‍💻 Entwicklung

```bash
# ESLint ausführen
npm run lint

# Tests ausführen (wenn implementiert)
npm test
```

## 📄 Lizenz

Dieses Projekt ist für die Feuerwehr Bedburg entwickelt.

---

**Kontakt**: Für Fragen oder Anregungen wenden Sie sich bitte an die Feuerwehr Bedburg.
