'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Sparkles, Globe, Lock } from 'lucide-react';
import { Mood, moodConfig } from '@/lib/types';

interface LetterFormProps {
  onSave: (data: { 
    title: string; 
    content: string; 
    mood: Mood; 
    date: string; 
    recipient: string;
    isPublic?: boolean;
  }) => void;
}

export function LetterForm({ onSave }: LetterFormProps) {
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('missing');
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !content.trim()) return;
    
    onSave({
      title: `To: ${recipient}`,
      content,
      mood,
      date,
      recipient,
      isPublic,
    });
    
    setRecipient('');
    setContent('');
    setIsPublic(false);
  };

  const moods = Object.entries(moodConfig) as [Mood, typeof moodConfig[Mood]][];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      {/* Recipient */}
      <div className="text-center">
        <label className="text-sm text-muted-foreground mb-3 block">
          who is this letter for?
        </label>
        <div className="relative max-w-xs mx-auto">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-lg text-primary">
            To:
          </span>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="someone special..."
            className={cn(
              "pl-12 py-6 text-center font-serif text-lg",
              "bg-transparent border-b border-border rounded-none",
              "focus:border-primary focus:ring-0",
              "placeholder:text-muted-foreground/50"
            )}
          />
        </div>
      </div>

      {/* Letter content */}
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="write what you wish you could say..."
          rows={10}
          className={cn(
            "w-full px-6 py-4 rounded-xl resize-none",
            "glass-card",
            "font-serif text-lg text-foreground leading-loose",
            "placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-ring/50"
          )}
        />
      </div>

      {/* Mood selector */}
      <div className="space-y-3">
        <label className="text-sm text-muted-foreground text-center block">
          how do you feel writing this?
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {moods.map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMood(key)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium",
                "transition-all duration-200",
                mood === key
                  ? cn(config.color, "ring-2 ring-offset-2 ring-offset-background ring-primary")
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
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
        <label className="text-sm text-muted-foreground text-center block">
          share this letter?
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
                  : 'this stays private, just between you and your thoughts'
                }
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!recipient.trim() || !content.trim()}
        className={cn(
          "w-full py-6 text-base font-medium",
          "bg-primary text-primary-foreground",
          "glow-effect",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        )}
      >
        <Mail className="size-5 mr-2" />
        keep this letter
      </Button>
    </form>
  );
}
