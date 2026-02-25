# Admin Dashboard - Merged Run Guide

## Status

The standalone admin frontend has been retired.

- Deprecated path: `Admin/frontend`
- Active admin UI path: `frontend/main-app/admin`
- Active admin route: `http://localhost:3000/#/en/admin-dashboard`

## Start Services

From repository root:

```bash
npm run dev:unified
```

This starts:
- main frontend (Vite)
- root backend
- admin backend (`backend/admin`)
- payment backend

## Admin-Only Dev Flow

```bash
./start-admin.sh
```

This starts:
- admin backend on `http://localhost:3001`
- main frontend on `http://localhost:3000`

Then open:

- `http://localhost:3000/#/en/admin-dashboard`

## Troubleshooting

- If port `5000` is occupied by macOS `ControlCenter`, run backend on another port.
- If admin APIs return auth errors, sign in again to refresh admin token.
- If data does not load, ensure `backend/admin` is running and reachable at `http://localhost:3001`.
