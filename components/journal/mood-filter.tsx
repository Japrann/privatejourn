'use client';

import { Mood, moodConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MoodFilterProps {
  selectedMood: Mood | null;
  onMoodChange: (mood: Mood | null) => void;
}

export function MoodFilter({ selectedMood, onMoodChange }: MoodFilterProps) {
  const moods = Object.entries(moodConfig) as [Mood, typeof moodConfig[Mood]][];
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-foreground mb-3">filter by mood</h2>
        <p className="text-muted-foreground text-sm">
          find entries based on how you were feeling
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* All moods option */}
        <button
          onClick={() => onMoodChange(null)}
          className={cn(
            "p-5 rounded-xl text-left transition-all duration-300",
            "glass-card",
            selectedMood === null
              ? "ring-2 ring-primary shadow-[0_0_25px_var(--glow)] scale-[1.02]"
              : "hover:scale-[1.02] hover:shadow-[0_0_20px_var(--glow)]"
          )}
        >
          <span className="text-3xl mb-3 block">🌈</span>
          <span className="font-serif text-lg text-foreground">all moods</span>
          <p className="text-xs text-muted-foreground mt-1">show everything</p>
        </button>
        
        {/* Individual mood filters */}
        {moods.map(([key, config], index) => (
          <button
            key={key}
            onClick={() => onMoodChange(key)}
            className={cn(
              "p-5 rounded-xl text-left transition-all duration-300",
              "glass-card animate-slide-up",
              selectedMood === key
                ? "ring-2 ring-primary shadow-[0_0_25px_var(--glow)] scale-[1.02]"
                : "hover:scale-[1.02] hover:shadow-[0_0_20px_var(--glow)]"
            )}
            style={{ animationDelay: `${(index + 1) * 50}ms` }}
          >
            <span className="text-3xl mb-3 block">{config.emoji}</span>
            <span className="font-serif text-lg text-foreground">{config.label}</span>
            <p className="text-xs text-muted-foreground mt-1">
              {key === 'happy' && 'moments of joy'}
              {key === 'tired' && 'when you need rest'}
              {key === 'overthinking' && 'racing thoughts'}
              {key === 'missing' && 'longing and love'}
              {key === 'calm' && 'peace and clarity'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
