# Brainmap Frontend Deployment Guide

## Current Setup
The frontend is deployed to GitHub Pages at: https://huypham37.github.io/brainmap

## Build & Deploy Process

### 1. Update API Backend URL (when backend is deployed)
Edit `.env.production` and set the backend API URL:
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### 2. Build the Frontend
```bash
npm run build
```

### 3. Copy to Hugo Site
```bash
rm -rf ../../huypham37.github.io/static/brainmap/*
cp -r dist/* ../../huypham37.github.io/static/brainmap/
```

### 4. Commit and Push
```bash
cd ../../huypham37.github.io
git add static/brainmap/
git commit -m "Update brainmap deployment"
git push
```

GitHub Actions will automatically build and deploy the site.

## Backend Deployment Options

### Option 1: Railway (Recommended - Free Tier)
1. Sign up at https://railway.app
2. Create new project from GitHub repo
3. Select the `backend` folder
4. Add environment variables for database
5. Deploy

### Option 2: Render (Free Tier)
1. Sign up at https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Root directory: `backend`
5. Build command: `pip install -r requirements.txt`
6. Start command: `python app.py`

### Option 3: Heroku
1. Install Heroku CLI
2. Create new app
3. Deploy backend folder

## Environment Variables Needed for Backend
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Set to `https://huypham37.github.io`
- `PORT` - Usually set automatically by hosting provider

## CORS Configuration
Remember to update backend CORS settings to allow requests from:
```
https://huypham37.github.io
```
