'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '@/components/journal/sidebar';
import { NoteCard } from '@/components/journal/note-card';
import { NoteForm } from '@/components/journal/note-form';
import { NoteDetail } from '@/components/journal/note-detail';
import { MoodFilter } from '@/components/journal/mood-filter';
import { SpecialNote } from '@/components/journal/special-note';
import { LockScreen } from '@/components/journal/lock-screen';
import { SearchBar } from '@/components/journal/search-bar';
import { FloatingButton } from '@/components/journal/floating-button';
import { VanishingText } from '@/components/journal/vanishing-text';
import { LetterForm } from '@/components/journal/letter-form';
import { RandomMemory } from '@/components/journal/random-memory';
import { TimelineView } from '@/components/journal/timeline-view';
import { FeedbackToast } from '@/components/journal/feedback-toast';
import { SettingsPanel } from '@/components/journal/settings-panel';
import { MoodAtmosphere } from '@/components/journal/mood-atmosphere';
import { AmbientSounds } from '@/components/journal/ambient-sounds';
import { Note, Mood, JournalSettings, getRandomFeedback, feedbackMessages } from '@/lib/types';
import { notesService } from '@/lib/db';
import { cn } from '@/lib/utils';

type View = 'all' | 'new' | 'filter' | 'special' | 'lock' | 'vanish' | 'letter' | 'timeline' | 'settings';

// Sample notes for demonstration
const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'A quiet evening alone',
    content: 'Sometimes silence speaks louder than words. Tonight I sat by the window, watching the rain trace paths down the glass. There\'s something beautiful about being alone with your thoughts, letting them flow like water.',
    mood: 'calm',
    date: '2024-03-15',
    createdAt: '2024-03-15T20:00:00Z',
  },
  {
    id: '2',
    title: 'Thoughts at 3am',
    content: 'My mind won\'t stop racing. Every decision I\'ve ever made seems to demand reevaluation at this hour. The darkness amplifies everything. I know by morning this will feel smaller, but right now it feels infinite.',
    mood: 'overthinking',
    date: '2024-03-14',
    createdAt: '2024-03-14T03:00:00Z',
  },
  {
    id: '3',
    title: 'Today was unexpectedly wonderful',
    content: 'A stranger smiled at me on the train. My coffee was perfect. The sun broke through the clouds at just the right moment. Small things, but they added up to something magical.',
    mood: 'happy',
    date: '2024-03-13',
    createdAt: '2024-03-13T18:00:00Z',
  },
  {
    id: '4',
    title: 'To: Someone I miss',
    content: 'It\'s been months, but sometimes I still reach for my phone to text you. Old habits. Old love. I wonder if you ever think of me the way I think of you—in quiet moments when the world fades away.',
    mood: 'missing',
    date: '2024-03-12',
    isSpecial: true,
    isLetter: true,
    recipient: 'Someone I miss',
    createdAt: '2024-03-12T22:00:00Z',
  },
  {
    id: '5',
    title: 'Exhausted but grateful',
    content: 'This week has drained everything from me. But as I collapse into bed, I realize I\'m tired from doing things that matter. That\'s a different kind of tired. A tired that means something.',
    mood: 'tired',
    date: '2024-03-11',
    createdAt: '2024-03-11T23:00:00Z',
  },
];

const defaultSettings: JournalSettings = {
  journalName: "Whisper",
  accentColor: 'purple',
  ambientMode: 'none',
};

export default function JournalApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentView, setCurrentView] = useState<View>('all');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState<Mood | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<JournalSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const PIN = '1234';

  // Load notes from database on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!notesService.isAvailable()) {
          setError('Please configure Supabase to save and load notes. See README.md for setup instructions.');
          setIsLoading(false);
          return;
        }
        
        const fetchedNotes = await notesService.fetchNotes();
        setNotes(fetchedNotes);
      } catch (err) {
        console.error('Failed to load notes:', err);
        setError('Failed to load notes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Apply accent color to document
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', settings.accentColor);
  }, [settings.accentColor]);

  // Filter notes based on search and mood - EXCLUDE private notes from main view
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Exclude private notes from main journal view
      if (!note.isPublic) return false;
      
      const matchesSearch = searchQuery === '' || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMood = moodFilter === null || note.mood === moodFilter;
      
      return matchesSearch && matchesMood;
    });
  }, [notes, searchQuery, moodFilter]);

  // Get special note
  const specialNote = notes.find(n => n.isSpecial);

  const handleSaveNote = async (noteData: { title: string; content: string; mood: Mood; date: string; isPublic?: boolean }) => {
    try {
      setError(null);
      const newNote = await notesService.createNote(noteData);
      setNotes([newNote, ...notes]);
      setCurrentView('all');
      setFeedbackMessage(getRandomFeedback('save'));
    } catch (err) {
      console.error('Failed to save note:', err);
      setError('Failed to save note. Please try again.');
    }
  };

  const handleSaveLetter = async (noteData: { title: string; content: string; mood: Mood; date: string; recipient: string; isPublic?: boolean }) => {
    try {
      setError(null);
      const newNote = await notesService.createNote({
        ...noteData,
        isLetter: true,
      });
      setNotes([newNote, ...notes]);
      setCurrentView('all');
      setFeedbackMessage(getRandomFeedback('save'));
    } catch (err) {
      console.error('Failed to save letter:', err);
      setError('Failed to save letter. Please try again.');
    }
  };

  const handleSaveSpecialNote = async (noteData: { title: string; content: string; mood: string; date: string; isPublic?: boolean }) => {
    try {
      setError(null);
      // Remove special flag from any existing special note
      const updatedNotes = notes.map(n => ({ ...n, isSpecial: false }));
      
      // Update existing special note in database if exists
      const existingSpecial = notes.find(n => n.isSpecial);
      if (existingSpecial) {
        await notesService.updateNote(existingSpecial.id, { isSpecial: false });
      }
      
      const newNote = await notesService.createNote({
        ...noteData,
        mood: noteData.mood as Mood,
        isSpecial: true,
      });
      
      setNotes([newNote, ...updatedNotes]);
      setFeedbackMessage(getRandomFeedback('save'));
    } catch (err) {
      console.error('Failed to save special note:', err);
      setError('Failed to save special note. Please try again.');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      setError(null);
      await notesService.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      setSelectedNote(null);
      setFeedbackMessage(getRandomFeedback('delete'));
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note. Please try again.');
    }
  };

  const handleToggleSpecial = async (id: string) => {
    try {
      setError(null);
      const note = notes.find(n => n.id === id);
      if (!note) return;

      const newIsSpecial = !note.isSpecial;
      
      // If making this note special, remove special flag from other notes
      if (newIsSpecial) {
        const existingSpecial = notes.find(n => n.isSpecial && n.id !== id);
        if (existingSpecial) {
          await notesService.updateNote(existingSpecial.id, { isSpecial: false });
        }
      }

      const updatedNote = await notesService.updateNote(id, { isSpecial: newIsSpecial });
      
      setNotes(notes.map(n => {
        if (n.id === id) {
          return updatedNote;
        }
        // Remove special flag from other notes if this one is now special
        if (newIsSpecial && n.isSpecial) {
          return { ...n, isSpecial: false };
        }
        return n;
      }));
    } catch (err) {
      console.error('Failed to toggle special:', err);
      setError('Failed to update note. Please try again.');
    }
  };

  const handleShareNote = async (note: Note) => {
    try {
      const shareUrl = `${window.location.origin}/note/${note.id}`;
      
      if (navigator.share && note.isPublic) {
        await navigator.share({
          title: note.title,
          text: note.content.substring(0, 100) + '...',
          url: shareUrl,
        });
      } else {
        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setFeedbackMessage('link copied to clipboard');
      }
    } catch (err) {
      console.error('Failed to share note:', err);
      setError('Failed to share note');
    }
  };

  const handleTogglePublic = async (note: Note) => {
    try {
      setError(null);
      const updatedNote = await notesService.updateNote(note.id, { 
        isPublic: !note.isPublic 
      });
      
      setNotes(notes.map(n => n.id === note.id ? updatedNote : n));
      
      if (updatedNote.isPublic) {
        setFeedbackMessage('note is now public');
      } else {
        setFeedbackMessage('note is now private');
      }
    } catch (err) {
      console.error('Failed to toggle public:', err);
      setError('Failed to update note privacy');
    }
  };

  const handleRandomMemory = () => {
    if (notes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * notes.length);
    setRandomNote(notes[randomIndex]);
  };

  const handleViewChange = (view: View) => {
    if (view === 'lock') {
      setIsLocked(true);
    } else if (view === 'settings') {
      setShowSettings(true);
    } else {
      setCurrentView(view);
      setSelectedNote(null);
    }
  };

  if (isLocked) {
    return <LockScreen pin={PIN} onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div 
      className="min-h-screen bg-background flex"
      data-accent={settings.accentColor}
    >
      {/* Mood-based atmosphere */}
      <MoodAtmosphere currentMood={moodFilter || undefined} />
      
      {/* Ambient rain overlay */}
      {settings.ambientMode === 'rain' && <div className="rain-overlay" />}
      
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        journalName={settings.journalName}
        onRandomMemory={handleRandomMemory}
      />
      
      <main className="flex-1 min-h-screen relative">
        {/* Header */}
        <header className="sticky top-0 z-20 glass-card border-b border-border/30 p-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            onMenuClick={() => setSidebarOpen(true)}
          />
        </header>
        
        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {selectedNote ? (
            <NoteDetail 
              note={selectedNote}
              onBack={() => setSelectedNote(null)}
              onDelete={handleDeleteNote}
              onToggleSpecial={handleToggleSpecial}
            />
          ) : currentView === 'vanish' ? (
            <VanishingText onClose={() => setCurrentView('all')} />
          ) : currentView === 'letter' ? (
            <div className="max-w-xl mx-auto animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl text-foreground mb-3">write a letter</h2>
                <p className="text-muted-foreground">
                  to someone you can&apos;t reach, or don&apos;t dare to
                </p>
              </div>
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <LetterForm onSave={handleSaveLetter} />
              </div>
            </div>
          ) : currentView === 'timeline' ? (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="font-serif text-3xl text-foreground mb-2">timeline</h2>
                <p className="text-muted-foreground text-sm">
                  your journey through feelings
                </p>
              </div>
              <TimelineView 
                notes={filteredNotes}
                onSelectNote={setSelectedNote}
              />
            </div>
          ) : currentView === 'new' ? (
            <div className="max-w-xl mx-auto animate-fade-in">
              <div className="mb-8 text-center">
                <h2 className="font-serif text-3xl text-foreground mb-2">new entry</h2>
                <p className="text-muted-foreground">
                  what would you like to remember?
                </p>
              </div>
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <NoteForm onSave={handleSaveNote} />
              </div>
            </div>
          ) : currentView === 'filter' ? (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <MoodFilter 
                selectedMood={moodFilter}
                onMoodChange={(mood) => {
                  setMoodFilter(mood);
                  setCurrentView('all');
                }}
              />
            </div>
          ) : currentView === 'special' ? (
            <SpecialNote 
              note={specialNote || null}
              onSave={handleSaveSpecialNote}
              onBack={() => setCurrentView('all')}
            />
          ) : (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="font-serif text-3xl text-foreground mb-2">
                  {moodFilter ? `feeling ${moodFilter}` : 'your notes'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'memory' : 'memories'}
                  {moodFilter && (
                    <button 
                      onClick={() => setMoodFilter(null)}
                      className="ml-2 text-primary hover:underline"
                    >
                      clear filter
                    </button>
                  )}
                </p>
              </div>
              
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="font-serif text-xl text-muted-foreground italic">
                    loading your memories...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="font-serif text-xl text-red-500 mb-2 italic">
                    {error}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-sm text-primary hover:underline"
                  >
                    try again
                  </button>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-serif text-xl text-muted-foreground mb-2 italic">
                    {feedbackMessages.empty}
                  </p>
                  <p className="text-sm text-muted-foreground/50">
                    {searchQuery 
                      ? 'no notes match your search'
                      : 'your first entry awaits'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredNotes.map((note, index) => (
                    <div 
                      key={note.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-slide-up"
                    >
                      <NoteCard 
                        note={note}
                        onClick={() => setSelectedNote(note)}
                        onShare={handleShareNote}
                        onTogglePublic={handleTogglePublic}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Floating action button */}
        {currentView === 'all' && !selectedNote && (
          <FloatingButton onClick={() => setCurrentView('new')} />
        )}
      </main>

      {/* Random Memory Modal */}
      {randomNote && (
        <RandomMemory 
          note={randomNote}
          onClose={() => setRandomNote(null)}
        />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Feedback Toast */}
      {feedbackMessage && (
        <FeedbackToast 
          message={feedbackMessage}
          onDone={() => setFeedbackMessage(null)}
        />
      )}
      
      {/* Ambient Sounds */}
      <AmbientSounds />
    </div>
  );
}
