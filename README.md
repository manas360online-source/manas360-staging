
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Unified Merge Workflow

- Deep-scan folder relationships and merge status:
   `npm run scan:merge`
- Run as one full stack (frontend + root backend + admin backend + payment backend):
   `npm run dev:unified`
- Admin UI is now merged into main frontend at:
   `frontend/main-app/admin`
- Open admin dashboard route:
   `http://localhost:3000/#/en/admin-dashboard`
- Deep scan report output:
   `docs/DEEPSCAN_MERGE_REPORT.md`
