# Safe Tourism Hackathon - Deployment Guide

This guide will help you deploy your Safe Tourism website on Render (backend) and Vercel (frontend).

## 🚀 Deployment Strategy

- **Backend (Node.js/Express API)**: Render
- **Frontend (React/Vite App)**: Vercel

---

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
4. **API Keys**: Foursquare API key (already in `.env`)

---

## 🔧 Step 1: Deploy Backend on Render

### 1.1 Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

```yaml
Name: safe-tourism-api
Environment: Node
Root Directory: server
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

### 1.2 Set Environment Variables on Render

In your Render service settings, add these environment variables:

```
NODE_ENV=production
PORT=10000
FOURSQUARE_API_KEY=OOQXUVIBPAKXSGRQQPCMNCDNIPCBIXQOAVKRTVNOAUCHPVB1
SESSION_SECRET=your_secure_session_secret_here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 1.3 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Note your Render URL: `https://your-app-name.onrender.com`

---

## 🎨 Step 2: Deploy Frontend on Vercel

### 2.1 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

```json
{
  "Framework Preset": Vite,
  "Root Directory": ./client,
  "Build Command": npm run build,
  "Output Directory": dist,
  "Install Command": cd client && npm install
}
```

### 2.2 Set Environment Variables on Vercel

In your Vercel project settings, add:

```
VITE_API_URL=https://your-render-app.onrender.com
```

### 2.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Note your Vercel URL: `https://your-app-name.vercel.app`

---

## 🔗 Step 3: Connect Frontend and Backend

### 3.1 Update CORS Settings

Go back to your Render service and update the `FRONTEND_URL` environment variable:

```
FRONTEND_URL=https://your-actual-vercel-app.vercel.app
```

### 3.2 Redeploy Backend

1. Go to your Render service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ Step 4: Test Your Deployment

1. **Backend Health Check**: Visit `https://your-app.onrender.com/health`
2. **Frontend**: Visit `https://your-app.vercel.app`
3. **API Connection**: Test login/search features

---

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Make sure `FRONTEND_URL` is correctly set on Render
   - Check that the URL includes `https://`

2. **Build Failures**:
   - Verify all `package.json` files are correct
   - Check that dependencies are properly installed

3. **API Connection Issues**:
   - Ensure `VITE_API_URL` is set correctly on Vercel
   - Check that backend is deployed and running

4. **Session Issues**:
   - Make sure cookies are configured for production
   - Check that `sameSite` is set to 'none' for production

### Debug Commands:

```bash
# Check backend logs on Render
# Go to Render Dashboard → Your Service → Logs

# Check frontend deployment on Vercel
# Go to Vercel Dashboard → Your Project → Logs
```

---

## 📁 File Structure After Setup

```
your-project/
├── render.yaml              # Render configuration
├── vercel.json             # Vercel configuration
├── .env                    # Local environment
├── .env.production         # Production template
├── server/
│   ├── package.json        # Server dependencies
│   └── server.js           # Backend entry point
└── client/
    ├── package.json        # Client dependencies
    ├── .env.production     # Frontend production env
    └── src/
        └── config/
            └── api.js      # API configuration
```

---

## 🎉 Success!

Your Safe Tourism website is now live! 🌍

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`

Users can now access your travel safety platform from anywhere in the world!

---

## 🔄 Updates and Maintenance

### To update your app:

1. Push changes to GitHub
2. Render will auto-deploy backend
3. Vercel will auto-deploy frontend
4. Test both deployments

### To monitor performance:

- **Render**: Check service logs and metrics
- **Vercel**: Check analytics and performance
- **GitHub**: Monitor deployment status

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review Render and Vercel documentation
3. Check deployment logs
4. Test locally before deploying

Happy travels! 🛫✈️