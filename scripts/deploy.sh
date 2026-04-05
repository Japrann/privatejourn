#!/bin/bash

echo "🚀 Deploying Whisper Journal to Vercel"
echo "===================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project first
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deploying to Vercel..."
    vercel --prod
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi
