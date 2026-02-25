# Admin Dashboard - Complete Guide (Merged Architecture)

## Important Change

The admin frontend is no longer a standalone app under `Admin/frontend`.

Canonical locations:
- Admin UI code: `frontend/main-app/admin`
- Admin backend: `backend/admin`

## Run Commands

### Full stack (recommended)
```bash
npm run dev:unified
```

### Admin-focused
```bash
./start-admin.sh
```

## Access URL

- `http://localhost:3000/#/en/admin-dashboard`

## API Expectations

- Admin backend base: `http://localhost:3001/api`
- Analytics endpoints: `/analytics/*`
- Admin endpoints: `/v1/admin/*`

## Notes

- The top-level `Admin` folder has been fully removed.
- All future admin frontend updates should be made only in `frontend/main-app/admin`.
