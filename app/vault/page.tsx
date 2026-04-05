'use client';

import { useState, useEffect } from 'react';
import { PrivateVault } from '@/components/journal/private-vault';
import { Note } from '@/lib/types';
import { notesService } from '@/lib/db';

export default function VaultPage() {
  const [privateNotes, setPrivateNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrivateNotes();
  }, []);

  const loadPrivateNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all notes and filter for private ones
      const allNotes = await notesService.fetchNotes();
      const privateOnly = allNotes.filter(note => !note.isPublic);
      setPrivateNotes(privateOnly);
    } catch (err) {
      console.error('Failed to load private notes:', err);
      setError('Failed to load private notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPrivateNote = async (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const newNote = await notesService.createNote(noteData);
      setPrivateNotes([newNote, ...privateNotes]);
    } catch (err) {
      console.error('Failed to add private note:', err);
      setError('Failed to add private note');
    }
  };

  const handleDeletePrivateNote = async (id: string) => {
    try {
      setError(null);
      await notesService.deleteNote(id);
      setPrivateNotes(privateNotes.filter(note => note.id !== id));
    } catch (err) {
      console.error('Failed to delete private note:', err);
      setError('Failed to delete private note');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">loading private vault...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={loadPrivateNotes}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PrivateVault
      notes={privateNotes}
      onAddPrivateNote={handleAddPrivateNote}
      onDeletePrivateNote={handleDeletePrivateNote}
    />
  );
}
