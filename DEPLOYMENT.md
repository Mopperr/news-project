# 🚀 VFI News Website - Deployment Guide

This project uses a **hybrid deployment model**:
- **Frontend**: GitHub Pages (free, automatic)
- **Backend API**: Render (free tier)

---

## 📋 Prerequisites

1. GitHub account (for GitHub Pages)
2. Render account (sign up at [render.com](https://render.com) - free)
3. Your code pushed to GitHub repository

---

## 🌐 Part 1: Deploy Backend to Render (5 minutes)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easiest option)
3. Authorize Render to access your repositories

### Step 2: Deploy Backend API
1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Mopperr/news-project`
3. Configure the service:
   ```
   Name: vfi-news-api (or any name you prefer)
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   Instance Type: Free
   ```
4. Click **"Create Web Service"**
5. Wait 2-3 minutes for deployment to complete
6. **Copy your API URL** (example: `https://vfi-news-api.onrender.com`)

### Step 3: Update Frontend Configuration
1. Open `index.js` in your repository
2. Find line 4:
   ```javascript
   const RENDER_API_URL = 'YOUR_RENDER_URL_HERE/api';
   ```
3. Replace with your actual Render URL:
   ```javascript
   const RENDER_API_URL = 'https://vfi-news-api.onrender.com/api';
   ```
4. Save and commit the change:
   ```bash
   git add index.js
   git commit -m "Update Render API URL"
   git push
   ```

---

## 📄 Part 2: Deploy Frontend to GitHub Pages (3 minutes)

### Step 1: Enable GitHub Pages
1. Go to your repository: `https://github.com/Mopperr/news-project`
2. Click **"Settings"** tab
3. In left sidebar, click **"Pages"**
4. Under "Source", select:
   - **Source**: GitHub Actions
5. The workflow is already set up (`.github/workflows/deploy.yml`)

### Step 2: Trigger Deployment
The deployment happens automatically on every push to `main` branch.

Since you just updated `index.js` in Step 3 of Part 1, the deployment should start automatically.

### Step 3: Access Your Live Website
1. Wait 1-2 minutes for deployment to complete
2. Go to: `https://mopperr.github.io/news-project/`
3. Your website is now live! 🎉

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] **Homepage loads** - All sections visible
- [ ] **Breaking news banner** - Bible verses rotating
- [ ] **News articles loading** - Check "All News", "Business", "Technology", etc.
- [ ] **Videos playing** - Click a video, should autoplay
- [ ] **Weather widget** - Shows Jerusalem temperature
- [ ] **Blog articles** - Rotating every 8 seconds
- [ ] **Search function** - Try searching for "Israel"
- [ ] **Responsive design** - Test on mobile (hamburger menu appears)
- [ ] **About page** - Click "About" in navigation
- [ ] **Modal close button** - X centered properly

---

## 🔧 Troubleshooting

### Problem: News articles not loading
**Solution**: 
1. Check if Render backend is running: Visit `https://YOUR-RENDER-URL.onrender.com/api/health`
2. Should return: `{"status":"ok","message":"VFI News API is running"}`
3. If not, check Render logs for errors

### Problem: "YOUR_RENDER_URL_HERE" error in browser console
**Solution**: You forgot to update `index.js` with your actual Render URL (see Part 1, Step 3)

### Problem: GitHub Pages shows 404
**Solution**:
1. Wait 2-3 minutes after pushing code
2. Check Actions tab in GitHub to see deployment status
3. Ensure Pages is set to "GitHub Actions" source

### Problem: Render free tier sleeps after inactivity
**Note**: Render free tier services sleep after 15 minutes of inactivity.
- First request after sleep takes ~30 seconds to wake up
- Subsequent requests are instant
- **Upgrade to paid tier** ($7/month) for 24/7 uptime

---

## 🔄 Updating Your Website

### Update Frontend (HTML/CSS/JS)
```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push
```
GitHub Pages automatically rebuilds and deploys (1-2 minutes)

### Update Backend (Python API)
```bash
# Make changes to app.py or other Python files
git add .
git commit -m "Description of changes"
git push
```
Render automatically rebuilds and deploys (2-3 minutes)

---

## 💡 Pro Tips

1. **Custom Domain**: You can add a custom domain to both GitHub Pages and Render
2. **SSL/HTTPS**: Both services provide free SSL certificates automatically
3. **Monitoring**: Use Render's built-in logs to monitor API performance
4. **Scaling**: Upgrade Render plan if you need faster performance or 24/7 uptime

---

## 🆘 Need Help?

- **Render Support**: [render.com/docs](https://render.com/docs)
- **GitHub Pages**: [docs.github.com/pages](https://docs.github.com/pages)
- **Repository Issues**: Create an issue on GitHub

---

## 📊 What's Deployed

### Frontend (GitHub Pages)
- All HTML files (index, about, projects, contact, testimonials)
- CSS styles
- JavaScript logic
- Images and media files
- Bible verses system

### Backend (Render)
- Flask API server
- News scraper (6 pro-Israel sources)
- Weather API (Jerusalem)
- Blog articles endpoint
- Category filtering
- Search functionality

---

## 🎯 Architecture Overview

```
┌─────────────────────┐
│  User's Browser     │
└──────────┬──────────┘
           │
           ├─── HTML/CSS/JS ──────► GitHub Pages
           │                        (Static Files)
           │
           └─── API Calls ──────────► Render
                                     (Python Flask)
                                     ├─ News Scraper
                                     ├─ Weather API
                                     └─ Blog Articles
```

---

## 🔐 Security Notes

- API keys are already included (safe for public RSS feeds)
- GitHub repository is **private** - your code is secure
- CORS is enabled on backend for cross-origin requests
- All communications use HTTPS

---

## 📈 Next Steps

After successful deployment:
1. ✅ Test all features thoroughly
2. ✅ Share your website URL
3. ✅ Monitor Render logs for any issues
4. ✅ Consider upgrading Render for 24/7 uptime
5. ✅ Add Google Analytics (optional)

---

**Your Live Website**: `https://mopperr.github.io/news-project/`

**Your API Endpoint**: `https://YOUR-RENDER-URL.onrender.com/api`

🎉 **Congratulations! Your website is live!** 🎉
