'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Note } from '@/lib/types';
import { notesService } from '@/lib/db';
import { moodConfig } from '@/lib/types';

export default function PublicNotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (typeof params.id !== 'string') {
          throw new Error('Invalid note ID');
        }

        const fetchedNote = await notesService.fetchPublicNote(params.id);
        
        if (!fetchedNote) {
          setError('Note not found or is not public');
          return;
        }

        setNote(fetchedNote);
      } catch (err) {
        console.error('Failed to fetch note:', err);
        setError('Failed to load note. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="font-serif text-xl text-muted-foreground italic">
            loading this memory...
          </p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl text-foreground mb-4">
              {error || 'this memory remains private'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || 'some memories are meant to be kept close to the heart'}
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-primary hover:underline"
          >
            return to journal
          </button>
        </div>
      </div>
    );
  }

  const moodInfo = moodConfig[note.mood];

  return (
    <div className="min-h-screen bg-background">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        {/* Header */}
        <header className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            ← back to all memories
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${moodInfo.color}`}>
              {moodInfo.emoji} {moodInfo.label}
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(note.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            {note.title}
          </h1>
        </header>

        {/* Content */}
        <main className="glass-card rounded-2xl p-6 md:p-8">
          <div className="prose prose-invert max-w-none">
            <p className="font-serif text-lg leading-relaxed text-foreground whitespace-pre-wrap">
              {note.content}
            </p>
          </div>

          {note.isLetter && note.recipient && (
            <div className="mt-8 pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground italic">
                addressed to: {note.recipient}
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              shared from a private journal • {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            a moment captured in time
          </p>
        </footer>
      </div>
    </div>
  );
}
