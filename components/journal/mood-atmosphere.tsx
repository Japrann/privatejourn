'use client';

import { useEffect, useState } from 'react';
import { moodConfig } from '@/lib/types';

interface MoodAtmosphereProps {
  currentMood?: string;
  mode?: 'none' | 'rain' | 'night' | 'silence' | 'particles' | 'mood' | 'full';
}

export function MoodAtmosphere({ currentMood, mode }: MoodAtmosphereProps) {
  const [moodColors, setMoodColors] = useState({
    happy: 'from-yellow-400/20 via-orange-300/10 to-pink-400/20',
    tired: 'from-blue-400/20 via-indigo-300/10 to-purple-400/20',
    overthinking: 'from-gray-400/20 via-slate-300/10 to-zinc-400/20',
    missing: 'from-pink-400/20 via-rose-300/10 to-red-400/20',
    calm: 'from-green-400/20 via-teal-300/10 to-cyan-400/20',
  });

  const getMoodGradient = (mood: string) => {
    const moodKey = mood as keyof typeof moodColors;
    return moodColors[moodKey] || moodColors.calm;
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Mood-based gradient overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-3000 ease-in-out ${
          currentMood ? getMoodGradient(currentMood) : moodColors.calm
        }`}
        style={{ opacity: 0.3 }}
      />
      
      {/* Animated mood particles */}
      {currentMood && (
        <div className="absolute inset-0">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + (i % 3) * 30}%`,
                backgroundColor: currentMood && moodConfig[currentMood as keyof typeof moodConfig]?.color 
                  ? moodConfig[currentMood as keyof typeof moodConfig].color.replace('text-', 'rgb').replace('-500', '')
                  : 'rgb(34, 197, 94)',
                opacity: 0.1 + (i * 0.05),
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
      
      {/* Floating light rays */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white/10 via-transparent to-transparent animate-pulse" />
      <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-white/5 via-transparent to-transparent animate-pulse" 
           style={{ animationDelay: '1s' }} />
      <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-white/10 via-transparent to-transparent animate-pulse" 
           style={{ animationDelay: '2s' }} />
    </div>
  );
}
