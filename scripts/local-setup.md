# 🏠 Local Development Setup

## Step 1: Create Environment File

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kxruefhcrbdrtyjcvhee.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ZoFhGBTFG-7d1AM7Cwvdmg_pce8Wjab
```

## Step 2: Set Up Database

1. Go to your Supabase project: https://kxruefhcrbdrtyjcvhee.supabase.co
2. Navigate to **SQL Editor**
3. Run the commands from `supabase-schema.sql`

## Step 3: Start the App

```bash
npm run dev
```

The app will be available at: http://localhost:3000

## Step 4: Test the Features

### Creating Your First Note
1. Click the floating "+" button
2. Fill in:
   - Title: "My first memory"
   - Content: "Testing my beautiful journal app"
   - Mood: Choose how you feel
   - Date: Today's date
   - Privacy: Toggle between Public/Private
3. Click "save this moment"

### Testing Public Sharing
1. Make a note public using the 🌐 button
2. Click the share button to copy the link
3. Test the link in a new tab: http://localhost:3000/note/[id]

### Testing Private Notes
1. Create a private note (🔒 icon)
2. Try accessing it directly - should show "this memory remains private"

## Troubleshooting

If you see errors about missing environment variables:
1. Make sure `.env.local` exists in the root directory
2. Check that the Supabase URL and key are correct
3. Restart the dev server: `npm run dev`

## What Works Locally

- ✅ Creating and saving notes to Supabase
- ✅ Public/private note controls
- ✅ Share links for public notes
- ✅ Beautiful UI with all animations
- ✅ Search and filter functionality
- ✅ Timeline view
- ✅ All mood tracking features

Your local app should work exactly like the deployed version! 🌸
