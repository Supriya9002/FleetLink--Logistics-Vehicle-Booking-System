# 🚀 Deployment Guide

This guide will help you deploy FleetLink to various platforms.

## 📋 Prerequisites

- Git repository with your FleetLink code
- Netlify account (free)
- Backend hosting account (Render, Railway, or Heroku)

## 🌐 Frontend Deployment (Netlify)

### Step 1: Prepare for Deployment

1. **Create environment variables file** (`.env.production`):
   ```env
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

2. **Update API base URL** in `src/services/api.ts`:
   ```typescript
   const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
   ```

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify UI

1. **Build your project locally**:
   ```bash
   npm run build
   ```

2. **Go to [Netlify](https://netlify.com)** and sign up/login

3. **Drag and drop** the `dist` folder to Netlify

4. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Set environment variables**:
   - Go to Site settings → Environment variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.com/api`

#### Option B: Deploy via Git

1. **Push your code to GitHub/GitLab**

2. **Connect Netlify to your repository**:
   - Click "New site from Git"
   - Choose your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Set environment variables** in Netlify dashboard

### Step 3: Configure Netlify

1. **Enable React Router** (already configured in `netlify.toml`):
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Set custom domain** (optional):
   - Go to Site settings → Domain management
   - Add your custom domain

## 🔧 Backend Deployment

### Option 1: Render (Recommended - Free)

1. **Go to [Render](https://render.com)** and sign up

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm run server:dev`
   - Set environment variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fleetlink
     ```

3. **Add MongoDB**:
   - Create a new MongoDB service in Render
   - Copy the connection string to your environment variables

### Option 2: Railway

1. **Go to [Railway](https://railway.app)** and sign up

2. **Deploy from GitHub**:
   - Connect your repository
   - Set environment variables
   - Railway will auto-detect and deploy

### Option 3: Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

3. **Add MongoDB**:
   ```bash
   heroku addons:create mongolab
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

## 🔗 Connect Frontend to Backend

1. **Get your backend URL** from your hosting platform

2. **Update Netlify environment variables**:
   - Go to Site settings → Environment variables
   - Set `VITE_API_BASE_URL` to your backend URL

3. **Redeploy** if needed

## 🧪 Testing Deployment

1. **Test API endpoints**:
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Test frontend**:
   - Visit your Netlify URL
   - Try adding a vehicle
   - Try searching and booking

## 🔒 Security Considerations

1. **CORS Configuration**:
   Update your backend CORS settings to allow your Netlify domain:
   ```javascript
   app.use(cors({
     origin: ['https://your-netlify-app.netlify.app', 'http://localhost:5173'],
     credentials: true
   }));
   ```

2. **Environment Variables**:
   - Never commit sensitive data to Git
   - Use environment variables for all configuration

3. **HTTPS**:
   - Netlify provides HTTPS by default
   - Ensure your backend also uses HTTPS

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Check CORS configuration in backend
   - Ensure frontend URL is allowed

2. **API Not Found**:
   - Verify `VITE_API_BASE_URL` is set correctly
   - Check backend is running and accessible

3. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are installed

4. **Database Connection**:
   - Verify MongoDB connection string
   - Check network access to database

### Debug Commands:

```bash
# Check build locally
npm run build

# Test API locally
curl http://localhost:5000/api/health

# Check environment variables
echo $VITE_API_BASE_URL
```

## 📊 Monitoring

1. **Netlify Analytics**:
   - View site analytics in Netlify dashboard
   - Monitor build status and performance

2. **Backend Monitoring**:
   - Use your hosting platform's monitoring tools
   - Set up error tracking (Sentry, etc.)

## 🔄 Continuous Deployment

1. **Enable auto-deploy** in Netlify
2. **Set up webhooks** for backend deployment
3. **Use GitHub Actions** for automated testing

---

**Your FleetLink application is now ready for production! 🚀**
