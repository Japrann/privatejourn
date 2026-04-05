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

-- Create index for faster queries
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_is_public ON notes(is_public);
CREATE INDEX idx_notes_mood ON notes(mood);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policy for public notes (anyone can read public notes)
CREATE POLICY "Public notes are viewable by everyone" ON notes
  FOR SELECT USING (is_public = true);

-- Create policy for all notes (anyone can insert/update/delete - adjust as needed for auth)
CREATE POLICY "Anyone can manage notes" ON notes
  FOR ALL USING (true);
