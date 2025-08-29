#!/bin/bash

# FleetLink Deployment Script

echo "🚀 Starting FleetLink deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output: dist/"
    
    echo ""
    echo "🌐 Next steps for Netlify deployment:"
    echo "1. Go to https://netlify.com"
    echo "2. Drag and drop the 'dist' folder"
    echo "3. Set environment variable: VITE_API_BASE_URL=https://your-backend-url.com/api"
    echo ""
    echo "🔧 For backend deployment, see DEPLOYMENT.md"
    
else
    echo "❌ Build failed!"
    exit 1
fi
