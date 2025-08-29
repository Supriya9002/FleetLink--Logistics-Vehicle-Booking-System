# 🚀 Backend Deployment Guide

## 📋 Prerequisites
- MongoDB Atlas account (free tier available)
- GitHub repository with your code
- Node.js 18+ (handled by platforms)

## 🎯 **Option 1: Render (Recommended - FREE)**

### Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Get connection string

### Step 2: Deploy to Render
1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `fleetlink-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fleetlink?retryWrites=true&w=majority
PORT=10000
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for build to complete
- Your API will be available at: `https://your-app-name.onrender.com`

---

## 🚂 **Option 2: Railway (FREE tier)**

### Step 1: Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js

### Step 2: Environment Variables
Add in Railway dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fleetlink?retryWrites=true&w=majority
PORT=10000
```

### Step 3: Deploy
- Railway will auto-deploy
- Get your URL from dashboard

---

## ⚡ **Option 3: Heroku (PAID)**

### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

### Step 2: Login and Deploy
```bash
heroku login
heroku create fleetlink-backend
git push heroku main
```

### Step 3: Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fleetlink?retryWrites=true&w=majority
```

---

## 🗄️ **MongoDB Atlas Setup (Required for all)**

### Step 1: Create Database
1. Go to MongoDB Atlas
2. Create new cluster (free tier)
3. Click "Connect"
4. Choose "Connect your application"
5. Copy connection string

### Step 2: Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)

### Step 3: Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username/password
4. Replace in connection string

---

## 🔧 **Environment Variables**

All platforms need these variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fleetlink?retryWrites=true&w=majority
PORT=10000
```

---

## ✅ **Testing Your Deployment**

After deployment, test these endpoints:

```bash
# Health check
curl https://your-app-url.com/api/vehicles

# Add vehicle
curl -X POST https://your-app-url.com/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Truck","capacityKg":1000,"tyres":6}'

# Search vehicles
curl "https://your-app-url.com/api/vehicles/available?capacityRequired=500&fromPincode=100001&toPincode=200001&startTime=2024-01-15T10:00:00Z"
```

---

## 🔗 **Update Frontend**

After backend deployment, update your frontend's API URL:

1. Go to Netlify dashboard
2. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```
3. Redeploy frontend

---

## 🚨 **Common Issues**

### Issue 1: Build fails
- Check Node.js version (use 18+)
- Ensure all dependencies are in `package.json`

### Issue 2: MongoDB connection fails
- Check connection string format
- Verify network access settings
- Ensure database user has correct permissions

### Issue 3: CORS errors
- Backend already configured for multiple origins
- Check if frontend URL is in allowed origins

### Issue 4: Port issues
- Render/Railway auto-assign ports
- Use `process.env.PORT` in server code (already done)

---

## 📊 **Monitoring**

### Render
- Built-in logs and metrics
- Automatic restarts on failure

### Railway
- Real-time logs
- Performance metrics

### Heroku
- Application logs: `heroku logs --tail`
- Performance monitoring

---

## 💰 **Cost Comparison**

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| **Render** | ✅ Yes | $7/month |
| **Railway** | ✅ Yes | $5/month |
| **Heroku** | ❌ No | $7/month |

**Recommendation**: Start with **Render** - it's free and reliable!
