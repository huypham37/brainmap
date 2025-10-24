# Railway Backend Deployment Guide

## 🎯 Quick Setup (5 minutes)

Your backend is now ready for Railway deployment! Follow these steps:

### Step 1: Push Backend Changes to GitHub

First, let's commit the Railway-ready backend code:

```bash
cd /Users/mac/Documents/Documents\ -\ MacBook\ Pro/01-CodeLab/01-personal-project/brainmap
git add backend/
git commit -m "Prepare backend for Railway deployment

- Add PostgreSQL support with fallback to SQLite for local dev
- Configure CORS for production with environment variable
- Add gunicorn for production server
- Add Procfile for Railway
- Make port configurable via environment variable"
git push
```

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with your GitHub account
3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `brainmap` repository
   - Railway will detect it's a monorepo

4. **Configure the Service**:
   - Click on your service
   - Go to "Settings"
   - Set **Root Directory**: `backend`
   - Set **Start Command**: Leave empty (uses Procfile automatically)

5. **Add PostgreSQL Database**:
   - In your project dashboard, click "+ New"
   - Select "Database" → "Add PostgreSQL"
   - Railway will automatically set the `DATABASE_URL` environment variable

6. **Add Environment Variables**:
   - Go to your service → "Variables" tab
   - Add these variables:
     - `CORS_ORIGIN` = `https://huypham37.github.io`
     - `FLASK_ENV` = `production`
   - Note: `DATABASE_URL` and `PORT` are set automatically by Railway

7. **Deploy**:
   - Railway will automatically deploy
   - Wait for deployment to complete (usually 1-2 minutes)

8. **Get Your API URL**:
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the URL (e.g., `your-app-name.up.railway.app`)

### Step 3: Update Frontend with Backend URL

Once you have your Railway URL:

```bash
cd /Users/mac/Documents/Documents\ -\ MacBook\ Pro/01-CodeLab/01-personal-project/brainmap/frontend

# Update the environment file
echo "VITE_API_BASE_URL=https://your-app-name.up.railway.app/api" > .env.production

# Rebuild frontend
npm run build

# Copy to Hugo site
rm -rf ../../huypham37.github.io/static/brainmap/*
cp -r dist/* ../../huypham37.github.io/static/brainmap/

# Commit and push
cd ../../huypham37.github.io
git add static/brainmap/
git commit -m "Connect frontend to Railway backend"
git push
```

### Step 4: Test Your Deployment

1. Visit your backend health check: `https://your-app-name.up.railway.app/api/health`
2. Visit your frontend: `https://huypham37.github.io/brainmap`
3. Create a mind map and verify it saves!

## 🔧 What Was Changed

### Backend Updates:
✅ **database.py** - Now supports PostgreSQL (Railway) and SQLite (local)
✅ **app.py** - Configurable CORS and port via environment variables
✅ **requirements.txt** - Added `psycopg2-binary` and `gunicorn`
✅ **Procfile** - Tells Railway how to start the app

### Environment Variables:
- `DATABASE_URL` - PostgreSQL connection (set by Railway automatically)
- `CORS_ORIGIN` - Frontend URL for CORS (set to `https://huypham37.github.io`)
- `PORT` - Server port (set by Railway automatically)
- `FLASK_ENV` - Set to `production` for Railway

## 📊 Railway Free Tier Limits

Railway's free tier includes:
- ✅ 500 hours/month execution time
- ✅ 100GB outbound bandwidth
- ✅ Shared CPU and 512MB RAM
- ✅ PostgreSQL database included
- ✅ Custom domain support

This is perfect for personal projects!

## 🐛 Troubleshooting

### "Application failed to respond"
- Check logs in Railway dashboard
- Verify `Procfile` exists and is correct
- Ensure `requirements.txt` has all dependencies

### CORS errors in browser
- Verify `CORS_ORIGIN` is set to `https://huypham37.github.io` (no trailing slash)
- Check Railway logs for CORS-related errors

### Database connection errors
- Ensure PostgreSQL database is added to your project
- Check that `DATABASE_URL` environment variable is set
- View logs for specific error messages

## 🎉 Success Checklist

- [ ] Backend code pushed to GitHub
- [ ] Railway project created and connected to GitHub
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Deployment successful (check logs)
- [ ] Health check endpoint responds
- [ ] Frontend updated with backend URL
- [ ] Frontend redeployed to GitHub Pages
- [ ] Mind map creation works end-to-end!

## 📱 Your URLs

- **Frontend**: https://huypham37.github.io/brainmap
- **Backend**: https://[your-app-name].up.railway.app
- **Health Check**: https://[your-app-name].up.railway.app/api/health
