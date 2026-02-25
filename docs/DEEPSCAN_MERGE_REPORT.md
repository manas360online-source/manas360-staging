# Deep Scan Merge Report

Generated: 2026-02-24T04:58:22.178Z

## Merge Status

- Root app is functioning as a single integrated frontend shell (confirmed by successful root build).
- Integration happens in `App.tsx` with feature apps consolidated under `frontend/apps/*`.
- Physical flattening snapshot under `artifacts/merged-app-snapshot/` has been removed during cleanup.

## Deep Scan Summary

- Top-level folders scanned: 12
- package.json files discovered: 21
- Feature folders directly integrated by root App: 11

## Previous Physical Merge Snapshot

- Files copied: 59781
- Files overwritten (newest wins): 118
- Files skipped (existing newer): 49

## Integrated Folders (Used by Root App)

- Admin
- frontend/apps/cbt-session-engine
- frontend/apps/certification-platform
- frontend/apps/corporate-wellness
- frontend/apps/group-sessions
- frontend/apps/meera-ai-chatbot
- frontend/apps/patient-matching
- frontend/apps/school-wellness
- frontend/apps/single-meeting-jitsi
- frontend/apps/therapist-onboarding
- frontend/apps/therapist-registration-flow

## Standalone Package Roots (Not wired into Root App imports)

- backend/payment-gateway/package.json

## Top-level Folders Not Directly Imported by Root App

- .github
- artifacts
- backend
- docs
- frontend
- integrations
- migrations
- python-services
- scripts

## Recommended One-Application Operation

- Use `npm run dev:unified` at repository root to run frontend + root backend + admin backend + payment backend together.
- Keep root folder as source-of-truth runtime shell.
- Do not build from historical snapshots; use root runtime folders only.

## Next Consolidation Targets

- Consolidate duplicate nested projects under `frontend/apps/therapist-onboarding/` into one canonical implementation.
- Move remaining backend modules into unified `backend/*` layout as documented.
- Normalize ports/env per backend service to avoid clashes.
