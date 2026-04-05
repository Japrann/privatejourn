# Whisper - Emotional Journal App

A beautiful, emotional journal application built with Next.js, React, and Tailwind CSS. Now with Supabase backend for persistent storage and public sharing capabilities.

## Features

- **Emotional Journaling**: Capture your thoughts and feelings with mood tracking
- **Multiple Note Types**: Regular notes, special notes, and letters
- **Persistent Storage**: All notes are saved to Supabase database
- **Public Sharing**: Share individual notes via unique public URLs
- **Privacy Controls**: Choose which notes are public or private
- **Beautiful UI**: Emotional, aesthetic design with glass morphism effects
- **Search & Filter**: Find notes by mood or search terms
- **Timeline View**: See your emotional journey over time
- **Responsive Design**: Works beautifully on all devices

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd b_hN4uPXNwBYO
npm install
```

### 2. Set Up Supabase

The app is already configured with Supabase credentials:

- **URL**: https://kxruefhcrbdrtyjcvhee.supabase.co
- **Anon Key**: sb_publishable_ZoFhGBTFG-7d1AM7Cwvdmg_pce8Wjab

### 3. Set Up Database Schema

Run the SQL commands in `supabase-schema.sql` in your Supabase project's SQL Editor:

```sql
-- Create notes table
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('happy', 'tired', 'overthinking', 'missing', 'calm')),
  date TEXT NOT NULL,
  is_special BOOLEAN DEFAULT FALSE,
  is_letter BOOLEAN DEFAULT FALSE,
  recipient TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_is_public ON notes(is_public);
CREATE INDEX idx_notes_mood ON notes(mood);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public notes are viewable by everyone" ON notes
  FOR SELECT USING (is_public = true);

CREATE POLICY "Anyone can manage notes" ON notes
  FOR ALL USING (true);
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deploy to Vercel

The app is ready for Vercel deployment with the included `vercel.json` configuration:

#### Option A: Automatic Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the Next.js app and deploy it

#### Option B: Manual Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

The environment variables are already configured in `vercel.json`, so no additional setup is needed.

## Usage

### Creating Notes

1. Click the floating "+" button to create a new note
2. Fill in the title, content, mood, and date
3. Choose whether to make the note public or private
4. Click "save this moment"

### Sharing Notes

1. Make a note public using the globe/lock toggle on the note card
2. Click the share button to copy the public link
3. Anyone with the link can view the note at `/note/[id]`

### Privacy

- **Private notes**: Only visible to you in your journal
- **Public notes**: Accessible via unique URLs, visible to anyone with the link
- Public notes are marked with a 🌐 icon
- Private notes are marked with a 🔒 icon

## Moods

The app tracks 5 different emotional states:
- ✨ Happy
- 🌙 Tired  
- 💭 Overthinking
- 🤷‍♂️ A quiet longing (Missing)
- 🍃 Calm

## Technical Details

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS with custom glass morphism effects
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives

### Project Structure

```
├── app/                    # Next.js app router
│   ├── note/[id]/         # Public note view page
│   └── page.tsx           # Main journal app
├── components/
│   └── journal/           # Journal-specific components
├── lib/
│   ├── db.ts             # Database service layer
│   ├── supabase.ts       # Supabase client
│   └── types.ts          # TypeScript definitions
└── supabase-schema.sql   # Database schema
```

### Database Schema

The `notes` table stores all journal entries with the following fields:
- `id`: Unique identifier
- `title`, `content`: Note content
- `mood`: Emotional state (happy, tired, overthinking, missing, calm)
- `date`: Custom date for the memory
- `is_special`, `is_letter`: Note type flags
- `recipient`: For letter-type notes
- `is_public`: Privacy setting
- `created_at`: Timestamp

## Development

### Adding New Features

1. Update the database schema if needed
2. Modify the `notesService` in `lib/db.ts`
3. Update TypeScript types in `lib/types.ts`
4. Add/modify components as needed

### Styling

The app uses a custom design system with:
- Glass morphism effects
- Smooth animations
- Emotional color palette
- Responsive typography

## License

This project is a personal journal application. Feel free to use it as inspiration for your own projects.

## Support

If you encounter any issues during setup:

1. Check your Supabase configuration
2. Verify the database schema is correctly applied
3. Ensure environment variables are properly set
4. Check the browser console for any errors
