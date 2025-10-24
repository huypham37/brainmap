# 🚀 Brainmap Railway Deployment - Quick Start

## ✅ Backend is Ready!

Your backend code is prepared and pushed to GitHub: https://github.com/huypham37/brainmap

## 📋 Next Steps (5 minutes)

### 1. Deploy to Railway

Visit: **https://railway.app**

1. **Sign up/Login** with your GitHub account
2. **New Project** → "Deploy from GitHub repo"
3. **Select**: `huypham37/brainmap` repository
4. **Configure**:
   - Go to Settings
   - Set **Root Directory**: `backend`
   - Save
5. **Add PostgreSQL**:
   - Click "+ New" in your project
   - Select "Database" → "Add PostgreSQL"
6. **Add Environment Variables**:
   - Go to your web service → "Variables"
   - Add: `CORS_ORIGIN` = `https://huypham37.github.io`
   - Add: `FLASK_ENV` = `production`
7. **Generate Domain**:
   - Settings → Networking → "Generate Domain"
   - Copy your URL (e.g., `brainmap-production.up.railway.app`)

### 2. Update Frontend

Once you have your Railway URL, run these commands:

```bash
cd "/Users/mac/Documents/Documents - MacBook Pro/01-CodeLab/01-personal-project/brainmap/frontend"

# Update environment file with YOUR Railway URL
echo "VITE_API_BASE_URL=https://YOUR-APP-NAME.up.railway.app/api" > .env.production

# Rebuild
npm run build

# Deploy to GitHub Pages
rm -rf ../../huypham37.github.io/static/brainmap/*
cp -r dist/* ../../huypham37.github.io/static/brainmap/

cd ../../huypham37.github.io
git add static/brainmap/
git commit -m "Connect frontend to Railway backend"
git push
```

### 3. Test

1. **Backend health check**: https://YOUR-APP-NAME.up.railway.app/api/health
2. **Frontend**: https://huypham37.github.io/brainmap
3. **Create a mind map** - It should save and persist!

## 🎯 What's Working Now

✅ Frontend deployed to GitHub Pages
✅ Backend code ready for Railway
✅ PostgreSQL support configured
✅ CORS configured for your domain
✅ Production-ready with gunicorn

## 📱 Your Project URLs

- **GitHub (Backend)**: https://github.com/huypham37/brainmap
- **GitHub Pages (Frontend)**: https://huypham37.github.io/brainmap
- **Railway (Backend)**: Setup in progress...

## 💡 Tips

- Railway free tier: 500 hours/month (plenty for personal use)
- Check Railway logs if something doesn't work
- Backend will auto-deploy on future git pushes
- Frontend needs manual rebuild when changing API URL

## 📖 Full Guide

See `RAILWAY_DEPLOYMENT.md` for detailed troubleshooting and configuration options.

---

**Ready?** Let's deploy to Railway now! → https://railway.app
