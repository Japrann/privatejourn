'use client';

import { Note, moodConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface TimelineViewProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
}

export function TimelineView({ notes, onSelectNote }: TimelineViewProps) {
  // Sort notes by date, newest first
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group by month/year
  const groupedNotes = sortedNotes.reduce((groups, note) => {
    const date = new Date(note.date);
    const key = `${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
    return groups;
  }, {} as Record<string, Note[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {Object.entries(groupedNotes).map(([monthYear, monthNotes]) => (
        <div key={monthYear}>
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            {monthYear}
          </h3>
          
          <div className="space-y-4 ml-4">
            {monthNotes.map((note, index) => {
              const mood = moodConfig[note.mood];
              return (
                <button
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className={cn(
                    "timeline-item relative w-full text-left pl-8 py-4",
                    "glass-card rounded-xl",
                    "transition-all duration-300",
                    "hover:scale-[1.02] hover:shadow-[0_0_30px_var(--glow)]",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                    "animate-slide-up"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    "absolute left-4 top-6 size-3 rounded-full",
                    "bg-primary shadow-[0_0_10px_var(--glow)]"
                  )} />

                  <div className="flex items-start justify-between gap-4 pr-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.date)}
                        </span>
                        {note.isSpecial && (
                          <Heart className="size-3 text-primary fill-primary" />
                        )}
                        {note.isLetter && (
                          <span className="text-xs text-primary">letter</span>
                        )}
                      </div>
                      <h4 className="font-serif text-foreground truncate mb-1">
                        {note.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {note.content}
                      </p>
                    </div>

                    <span className={cn(
                      "shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                      mood.color
                    )}>
                      <span>{mood.emoji}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
