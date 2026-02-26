## Flash It Climbing

### Uruchomienie w Dockerze

1. Zbuduj i odpal cały stack:

```bash
docker compose up --build
```

1. Usługi:

- **Frontend**: `http://localhost:3000`
- **Backend (FastAPI)**: `http://localhost:8000`
- **Health check**: `GET http://localhost:8000/health`

MongoDB działa w kontenerze `mongodb` z nazwą bazy `flashit` (dane w wolumenie `mongodb_data`).