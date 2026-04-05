'use client';

import { Note, moodConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RandomMemoryProps {
  note: Note;
  onClose: () => void;
}

export function RandomMemory({ note, onClose }: RandomMemoryProps) {
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative w-full max-w-lg glass-card rounded-2xl p-8",
          "animate-slide-up"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </Button>

        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="size-5 text-primary" />
          <span className="text-sm text-muted-foreground uppercase tracking-wider">
            a random memory
          </span>
        </div>

        <h2 className="font-serif text-2xl text-foreground mb-2 text-balance">
          {note.title}
        </h2>

        <p className="text-sm text-muted-foreground mb-6">
          {formatDate(note.date)}
        </p>

        <p className="font-serif text-lg text-foreground/90 leading-relaxed mb-8 whitespace-pre-wrap">
          {note.content}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
            mood.color
          )}>
            <span>{mood.emoji}</span>
            {mood.label}
          </span>

          <p className="text-xs text-muted-foreground italic">
            from your past self
          </p>
        </div>
      </div>
    </div>
  );
}
