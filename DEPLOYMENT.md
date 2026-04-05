# 🚀 Deployment Guide

## Supabase Configuration

Your Supabase credentials are already configured:

- **Project URL**: https://kxruefhcrbdrtyjcvhee.supabase.co
- **Anon Key**: sb_publishable_ZoFhGBTFG-7d1AM7Cwvdmg_pce8Wjab

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the commands from `supabase-schema.sql`

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

## Vercel Deployment

### Quick Deploy (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project" and connect your GitHub repository
4. Vercel will automatically detect Next.js and deploy

### Manual Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables

The `vercel.json` file already contains your Supabase credentials, so no manual environment variable setup is needed on Vercel.

## What's Deployed

- ✅ Full journal application with Supabase backend
- ✅ Public note sharing via `/note/[id]` URLs
- ✅ Private/public note controls
- ✅ Beautiful emotional UI with glass morphism
- ✅ Responsive design for all devices
- ✅ Loading states and error handling

## Post-Deployment

1. Test creating a new note
2. Test making a note public and sharing the link
3. Verify the public URL works: `https://your-app.vercel.app/note/[id]`
4. Test private notes remain inaccessible

## Support

If you encounter any issues:

1. Check the Vercel deployment logs
2. Verify your Supabase database schema is set up correctly
3. Ensure the environment variables are properly configured in Vercel

Your app is now ready to be shared with the world! 🌸
