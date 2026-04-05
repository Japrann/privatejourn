#!/bin/bash

echo "🌸 Whisper Journal - Setup Script"
echo "================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your Supabase credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo ""
    echo "📋 To get your credentials:"
    echo "   1. Go to https://supabase.com"
    echo "   2. Create a new project"
    echo "   3. Go to Project Settings > API"
    echo "   4. Copy the Project URL and anon key"
    echo ""
    echo "🔧 After setting up your credentials:"
    echo "   1. Go to your Supabase project's SQL Editor"
    echo "   2. Run the SQL commands from supabase-schema.sql"
    echo "   3. Restart the development server: npm run dev"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "📖 For more information, see README.md"
