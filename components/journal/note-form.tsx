'use client';

import { useState } from 'react';
import { Mood, moodConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Globe, Lock } from 'lucide-react';

interface NoteFormProps {
  onSave: (note: { title: string; content: string; mood: Mood; date: string; isPublic?: boolean }) => Promise<void>;
  onCancel?: () => void;
  initialNote?: Note;
  isPrivate?: boolean;
  isSpecial?: boolean;
}

export function NoteForm({ onSave, onCancel, initialNote, isPrivate = false, isSpecial = false }: NoteFormProps) {
  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [content, setContent] = useState(initialNote?.content ?? '');
  const [mood, setMood] = useState<Mood>(initialNote?.mood ?? 'calm');
  const [date, setDate] = useState(initialNote?.date ?? new Date().toISOString().split('T')[0]);
  const [isPublic, setIsPublic] = useState(initialNote?.isPublic ?? false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    onSave({ title, content, mood, date, isPublic });
    setTitle('');
    setContent('');
    setMood('calm');
    setDate(new Date().toISOString().split('T')[0]);
    setIsPublic(false);
  };
  
  const moods = Object.entries(moodConfig) as [Mood, typeof moodConfig[Mood]][];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Title input */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-muted-foreground">
          {isSpecial ? 'letter title' : 'title'}
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isSpecial ? "dear..." : "give this moment a name..."}
          className="bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/50"
        />
      </div>
      
      {/* Content textarea */}
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium text-muted-foreground">
          {isSpecial ? 'your letter' : 'what are you feeling right now?'}
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isSpecial 
            ? "write what you wish you could say..."
            : "let it out... this space is yours"
          }
          rows={isSpecial ? 12 : 6}
          className={cn(
            "w-full px-4 py-3 rounded-xl resize-none",
            "bg-input/50 border border-border/50 text-foreground",
            "placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-ring/50",
            "leading-relaxed",
            isSpecial && "font-serif text-lg"
          )}
        />
      </div>
      
      {/* Date picker */}
      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium text-muted-foreground">
          when was this?
        </label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-input/50 border-border/50 text-foreground [color-scheme:dark]"
        />
      </div>
      
      {/* Mood selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">
          how does this make you feel?
        </label>
        <div className="flex flex-wrap gap-2">
          {moods.map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMood(key)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium",
                "transition-all duration-200",
                mood === key
                  ? cn(config.color, "ring-2 ring-offset-2 ring-offset-background ring-primary scale-105")
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:scale-105"
              )}
            >
              <span>{config.emoji}</span>
              {config.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Public toggle */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">
          share this memory?
        </label>
        <button
          type="button"
          onClick={() => setIsPublic(!isPublic)}
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
            isPublic 
              ? "border-green-500/50 bg-green-500/10 text-green-500" 
              : "border-border/50 bg-input/50 text-muted-foreground hover:border-border"
          )}
        >
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe className="size-5" />
            ) : (
              <Lock className="size-5" />
            )}
            <div className="text-left">
              <p className="font-medium">
                {isPublic ? 'Public' : 'Private'}
              </p>
              <p className="text-sm opacity-70">
                {isPublic 
                  ? 'anyone with the link can read this' 
                  : 'only you can see this memory'
                }
              </p>
            </div>
          </div>
        </button>
      </div>
      
      {/* Submit button */}
      <Button
        type="submit"
        disabled={!title.trim() || !content.trim()}
        className={cn(
          "w-full py-6 text-base font-medium",
          "bg-primary text-primary-foreground",
          "glow-effect animate-soft-pulse",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:animate-none"
        )}
      >
        <Sparkles className="size-5 mr-2" />
        {isSpecial ? 'keep this letter' : 'save this moment'}
      </Button>
    </form>
  );
}
