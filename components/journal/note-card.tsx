'use client';

import { Note, moodConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart, Mail, Share, Lock, Globe } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onShare?: (note: Note) => void;
  onTogglePublic?: (note: Note) => void;
}

export function NoteCard({ note, onClick, onShare, onTogglePublic }: NoteCardProps) {
  const mood = moodConfig[note.mood];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) onShare(note);
  };

  const handleTogglePublic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePublic) onTogglePublic(note);
  };
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "note-card w-full text-left p-5 rounded-xl",
        "glass-card",
        "focus:outline-none focus:ring-2 focus:ring-ring/50",
        "animate-fade-in"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-lg text-card-foreground line-clamp-1 text-balance">
          {note.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {note.isLetter && (
            <Mail className="size-4 text-primary/70" />
          )}
          {note.isSpecial && (
            <Heart className="size-4 text-primary fill-primary" />
          )}
          {note.isPublic ? (
            <Globe className="size-4 text-green-500" />
          ) : (
            <Lock className="size-4 text-muted-foreground/50" />
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
        {note.content}
      </p>
      
      <div className="flex items-center justify-between">
        <span 
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            mood.color
          )}
        >
          <span>{mood.emoji}</span>
          {mood.label}
        </span>
        
        <div className="flex items-center gap-2">
          {onShare && (
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md hover:bg-accent/50 transition-colors"
              title={note.isPublic ? "Copy link" : "Share publicly"}
            >
              <Share className="size-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          {onTogglePublic && (
            <button
              onClick={handleTogglePublic}
              className="p-1.5 rounded-md hover:bg-accent/50 transition-colors"
              title={note.isPublic ? "Make private" : "Make public"}
            >
              {note.isPublic ? (
                <Globe className="size-3.5 text-green-500 hover:text-green-600" />
              ) : (
                <Lock className="size-3.5 text-muted-foreground hover:text-foreground" />
              )}
            </button>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDate(note.date)}
          </span>
        </div>
      </div>
    </button>
  );
}
