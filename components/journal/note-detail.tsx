'use client';

import { Note, moodConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Heart, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteDetailProps {
  note: Note;
  onBack: () => void;
  onDelete: (id: string) => void;
  onToggleSpecial: (id: string) => void;
}

export function NoteDetail({ note, onBack, onDelete, onToggleSpecial }: NoteDetailProps) {
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
    <div className="max-w-2xl mx-auto animate-blur-in">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 mr-2" />
          back
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleSpecial(note.id)}
            className={cn(
              note.isSpecial 
                ? "text-primary hover:text-primary/80" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart className={cn("size-5", note.isSpecial && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(note.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      </div>
      
      <article className="glass-card rounded-2xl p-8 md:p-12">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
              mood.color
            )}>
              <span>{mood.emoji}</span>
              {mood.label}
            </span>
            {note.isLetter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-secondary/50 text-secondary-foreground">
                <Mail className="size-3" />
                letter
              </span>
            )}
            {note.isSpecial && (
              <Heart className="size-4 text-primary fill-primary" />
            )}
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-balance leading-tight">
            {note.title}
          </h1>
          
          <p className="text-sm text-muted-foreground tracking-wide">
            {formatDate(note.date)}
          </p>
        </header>
        
        <div className={cn(
          "max-w-none",
          note.isLetter && "text-center"
        )}>
          <p className={cn(
            "text-foreground/90 whitespace-pre-wrap",
            note.isLetter 
              ? "letter-style font-serif text-xl md:text-2xl" 
              : "leading-relaxed text-base md:text-lg"
          )}>
            {note.content}
          </p>
        </div>

        {note.isLetter && note.recipient && (
          <p className="text-center text-sm text-muted-foreground mt-10 italic">
            written for {note.recipient}
          </p>
        )}
      </article>
    </div>
  );
}
