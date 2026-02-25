# MANAS360 Admin Module

## Current Architecture

The admin **frontend is now merged into the main app** and is no longer run as a standalone React app from `Admin/frontend`.

- Canonical admin UI location: `frontend/main-app/admin`
- Admin backend location: `Admin/backend`
- Admin dashboard route in main app: `http://localhost:3000/#/en/admin-dashboard`

## How to Run (Merged)

From repo root:

```bash
npm run dev:unified
```

Or for admin-focused development:

```bash
./start-admin.sh
```

## Notes

- `Admin/frontend` is now placeholder-only (contains deprecation README, no runnable app).
- All new admin UI changes must be made under `frontend/main-app/admin`.
