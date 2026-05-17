# Deployment Notes

## Current status

- Local Git repository initialized
- Default branch renamed to `main`
- Initial commit created
- Railway config added with Dockerfile deployment
- Health check endpoint available at `/api/health`
- Production build verified locally

## GitHub target

Recommended repository:

- `https://github.com/Sunbii/klawus`

If you prefer a different casing such as `Klawus`, update the commands below accordingly.

## Commands to run after re-authenticating

### 1. Re-authenticate

```powershell
gh auth login -h github.com
railway login
```

### 2. Create and push the GitHub repo

```powershell
gh repo create klawus --public --source . --remote origin --push
```

If the repo already exists:

```powershell
git remote add origin https://github.com/Sunbii/klawus.git
git push -u origin main
```

### 3. Create or link the Railway project

Option A: create a new Railway project from this directory

```powershell
railway init
railway up
```

Option B: create the project in the Railway dashboard, then link and deploy

```powershell
railway link
railway up
```

### 4. After deployment

In Railway:

- generate a public domain
- confirm `/api/health` returns `200`
- confirm the root page loads

## Important files

- `railway.toml`
- `Dockerfile`
- `next.config.mjs`
- `server.js`
- `app/api/health/route.js`
