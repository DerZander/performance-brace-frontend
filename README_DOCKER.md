# Frontend - Performance Brace

## ⚠️ WICHTIG

**Verwende NICHT die alten docker-compose Dateien in diesem Verzeichnis!**

Die Hauptkonfiguration befindet sich im Root-Verzeichnis:
- `../docker-compose.yml` - Standard (mit Backend im Docker-Netzwerk)
- `../docker-compose.prod.yml` - Für Plesk Production (standalone)
- `../docker-compose.dev.yml` - Für lokale Entwicklung

## 📁 Dockerfiles

Dieses Verzeichnis enthält mehrere Dockerfiles für verschiedene Szenarien:

### `Dockerfile` (Standard)
- Für Entwicklung mit docker-compose
- Backend über Docker-Netzwerk erreichbar (`backend:8080`)
- nginx proxyt zu Backend

### `Dockerfile.plesk` (Production/Plesk)
- Für Plesk Deployment
- Standalone ohne Backend-Proxy
- Plesk nginx macht das Routing

### `Dockerfile.production` (Alt)
- Legacy, nicht mehr verwendet

## 🚀 Lokale Entwicklung (ohne Docker)

```bash
# Dependencies installieren
npm install

# Development Server starten (Hot Reload)
npm run dev

# Läuft auf: http://localhost:5173
```

### Mit Backend in Docker

```bash
# Im Root-Verzeichnis: Backend + DB starten
cd ..
docker-compose -f docker-compose.dev.yml up -d

# Frontend lokal starten
cd frontend
npm run dev
```

## 🔧 Umgebungsvariablen

### Für lokale Entwicklung

Erstelle `.env` im Frontend-Verzeichnis:

```env
VITE_API_URL=http://localhost:8080/api
```

### Für Docker Build

Die VITE_API_URL wird als Build Argument übergeben:

```bash
docker build --build-arg VITE_API_URL=https://jf.zander.digital/api -f Dockerfile.plesk .
```

## 📦 Build

```bash
# Production Build
npm run build

# Output: dist/ Verzeichnis

# Preview des Builds
npm run preview
```

## 🐳 Für Plesk Deployment

Siehe Hauptverzeichnis:
- `../PLESK_QUICKSTART.md`
- `../PLESK_DEPLOYMENT.md`

Das `Dockerfile.plesk` wird automatisch verwendet.

## 📋 nginx Konfigurationen

### `nginx.conf` (Standard)
- Mit Backend-Proxy zu `backend:8080`
- Für docker-compose mit Backend im gleichen Netzwerk

### `nginx-standalone.conf` (Plesk)
- Ohne Backend-Proxy
- Nur Frontend-Serving
- Für Plesk, wo nginx das Routing übernimmt

## 🔍 Troubleshooting

### "Container is unhealthy"

Das kann passieren wenn:
1. Der Backend-Container nicht erreichbar ist (bei Standard nginx.conf)
2. Der Health Check fehlschlägt

**Lösung für Plesk:** 
- Verwende `Dockerfile.plesk` (tut docker-compose.prod.yml automatisch)
- Oder: Entferne Backend-Proxy aus nginx.conf

### Build-Fehler

```bash
# Cache löschen
rm -rf node_modules dist
npm install
npm run build
```

### Port bereits belegt

```bash
# Ändere Port in package.json oder beim Start
npm run dev -- --port 3001
```

## 📚 Scripts

```bash
npm run dev          # Development Server
npm run build        # Production Build
npm run preview      # Preview Production Build
npm run lint         # ESLint
```

