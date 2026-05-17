# K-lawus

K-lawus is an evidence-led community protection platform focused on fraud prevention, landlord-tenant disputes, and victim support for Korean-American communities and the people who do business with them.

## Local development

```bash
npm install
npm run dev
```

## Production

The app is configured for Railway deployment with:

- `Dockerfile`
- `railway.toml`
- custom `server.js` entrypoint
- health check at `/api/health`

## Core documents

- `PROJECT_BRIEF.md` for mission, editorial standards, and MVP scope
