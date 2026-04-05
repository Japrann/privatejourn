'use client';

import { Note, moodConfig } from '@/lib/types';
import { NoteForm } from './note-form';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SpecialNoteProps {
  note: Note | null;
  onSave: (note: { title: string; content: string; mood: string; date: string; isPublic?: boolean }) => void;
  onBack: () => void;
}

export function SpecialNote({ note, onSave, onBack }: SpecialNoteProps) {
  if (note) {
    const mood = moodConfig[note.mood];
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
    };
    
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 animate-blur-in">
        <div className="max-w-2xl w-full">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4 mr-2" />
            back to notes
          </Button>
          
          <div className="glass-card rounded-2xl p-10 md:p-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Heart className="size-6 text-primary fill-primary animate-soft-pulse" />
              <span className="text-xs text-muted-foreground uppercase tracking-[0.3em]">
                special note
              </span>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 text-balance leading-tight">
              {note.title}
            </h1>
            
            <p className="text-sm text-muted-foreground mb-12 tracking-wide">
              {formatDate(note.date)}
            </p>
            
            <div className="max-w-lg mx-auto">
              <p className="letter-style font-serif text-xl md:text-2xl text-foreground/90 whitespace-pre-wrap text-center">
                {note.content}
              </p>
            </div>
            
            <div className="mt-16 pt-8 border-t border-border/30">
              <span className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm",
                mood.color
              )}>
                <span>{mood.emoji}</span>
                {mood.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <Heart className="size-14 text-primary mx-auto mb-6 animate-soft-pulse" />
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            special note
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            write something meaningful. a letter you wish you could send, 
            words you need to say, or a confession close to your heart.
          </p>
        </div>
        
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <NoteForm onSave={onSave} isSpecial />
        </div>
      </div>
    </div>
  );
}
