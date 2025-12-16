# Projektstruktur

Eine saubere und gut organisierte Ordnerstruktur für das Frontend-Projekt.

## 📁 Ordnerstruktur

```
src/
├── App.jsx                          # Haupt-App-Komponente mit Routing
├── main.jsx                         # React Entry Point
│
├── assets/                          # Statische Assets (Bilder, Icons)
│   └── react.svg
│
├── components/                      # Wiederverwendbare Komponenten
│   ├── Navbar/
│   │   ├── index.jsx               # Navbar-Komponente
│   │   └── Navbar.scss             # Navbar-Styling
│   │
│   └── PrivateRoute/
│       └── index.jsx               # Protected Route Komponente
│
├── context/                         # React Context für State Management
│   └── AuthContext/
│       └── index.jsx               # Authentifizierungs-Context
│
├── pages/                          # Seiten-Komponenten
│   ├── Login/
│   │   ├── index.jsx              # Login-Seite
│   │   └── Login.scss             # Login-Styling
│   │
│   ├── Dashboard/
│   │   ├── index.jsx              # Dashboard-Seite
│   │   └── Dashboard.scss         # Dashboard-Styling
│   │
│   └── CreateGroup/
│       ├── index.jsx              # Gruppe erstellen/bearbeiten
│       └── CreateGroup.scss       # CreateGroup-Styling
│
├── services/                       # API Services & Business Logic
│   ├── api.js                     # Axios API Client
│   ├── authService.js             # Authentifizierungs-Service
│   └── groupService.js            # Gruppen-Service
│
└── styles/                         # Globale Styles & Theme
    ├── theme.js                   # Material-UI Theme (Feuerwehr-Design)
    ├── variables.scss             # SCSS Variablen
    └── global.scss                # Globale SCSS Styles
```

## 📝 Konventionen

### Komponenten-Ordner
Jede Komponente hat ihren eigenen Ordner mit:
- `index.jsx` - Die Haupt-Komponente
- `[ComponentName].scss` - Zugehöriges Styling (optional)

### Naming
- **Ordner**: PascalCase (z.B. `CreateGroup/`, `Navbar/`)
- **Dateien**: 
  - Komponenten: `index.jsx`
  - Styles: `[ComponentName].scss`
  - Services: `camelCase.js`

### Import-Pfade
Dank der `index.jsx` Konvention können Komponenten einfach importiert werden:

```javascript
// Statt:
import Login from './pages/Login/index.jsx';

// Einfach:
import Login from './pages/Login';
```

### SCSS Organisation
- Globale Variablen in `styles/variables.scss`
- Globale Styles in `styles/global.scss`
- Komponenten-spezifische Styles im jeweiligen Komponenten-Ordner
- Import von Variablen mit: `@use '../../styles/variables.scss' as *;`

## 🎯 Vorteile dieser Struktur

✅ **Übersichtlich**: Jede Komponente hat ihren eigenen Ordner
✅ **Wartbar**: Styles sind direkt bei der zugehörigen Komponente
✅ **Skalierbar**: Einfaches Hinzufügen neuer Komponenten
✅ **Sauber**: Keine losen Dateien im Stammverzeichnis
✅ **Standard**: Folgt React Best Practices

## 🔄 Migration

Die Struktur wurde von flachen Dateien zu Ordner-basierter Organisation migriert:

**Vorher:**
```
pages/
  Login.jsx
  Login.scss
  Dashboard.jsx
  Dashboard.scss
```

**Nachher:**
```
pages/
  Login/
    index.jsx
    Login.scss
  Dashboard/
    index.jsx
    Dashboard.scss
```

Alle Import-Pfade wurden automatisch aktualisiert.
