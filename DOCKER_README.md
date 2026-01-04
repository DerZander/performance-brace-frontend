# Docker Setup für Performance Brace Frontend

Dieses Repository enthält Docker-Konfigurationen für Development und Production.

## Voraussetzungen

- Docker
- Docker Compose
- .env Datei (kopiere .env.example zu .env und fülle die Werte aus)

## Development

### Starten
```bash
docker-compose up
```

Die Anwendung ist erreichbar unter: http://localhost:5173

### Im Hintergrund starten
```bash
docker-compose up -d
```

### Logs ansehen
```bash
docker-compose logs -f
```

### Stoppen
```bash
docker-compose down
```

## Production

### Mit Node.js serve
```bash
docker-compose up --build
```

### Mit Nginx (empfohlen für Production)
```bash
docker-compose -f docker-compose.production.yml up --build
```

Oder mit Dockerfile.production:
```bash
docker build -f Dockerfile.production -t performance-brace-frontend:prod .
docker run -p 80:80 performance-brace-frontend:prod
```

## Mit Backend

Wenn du auch das Backend starten möchtest:
```bash
docker-compose -f docker-compose.full.yml up
```

## Nützliche Befehle

### Container neu bauen
```bash
docker-compose build --no-cache
```

### In den Container einloggen
```bash
docker exec -it performance-brace-frontend sh
```

### Alle Container und Volumes löschen
```bash
docker-compose down -v
```

## Troubleshooting

### Port bereits in Verwendung
Ändere den Port in docker-compose.yml:
```yaml
ports:
  - "3000:5173"  # Ändere 5173 zu einem anderen Port
```

### Node modules Probleme
```bash
docker-compose down -v
docker-compose up --build
```
