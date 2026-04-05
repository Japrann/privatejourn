'use client';

import { useEffect, useState } from 'react';
import { moodConfig } from '@/lib/types';

interface AmbientAtmosphereProps {
  mode?: 'none' | 'rain' | 'night' | 'silence' | 'particles' | 'mood' | 'full';
  currentMood?: string;
}

export function AmbientAtmosphere({ mode, currentMood }: AmbientAtmosphereProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add custom animation only on client
  useEffect(() => {
    if (!isClient) return;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(10px) translateX(-10px); }
        75% { transform: translateY(-15px) translateX(5px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient || mode === 'none') return;
    
    // Generate floating particles
    const generateParticles = () => {
      const newParticles = Array.from({ length: mode === 'full' ? 12 : 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 10000);
    return () => clearInterval(interval);
  }, [mode, isClient]);

  // Don't render on server to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (mode === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {mode === 'particles' || mode === 'full' && (
        <>
          {/* Gradient orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" 
               style={{ transform: 'translate(-50%, -50%) translate(100px, 100px)' }} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl animate-pulse" 
               style={{ transform: 'translate(50%, -50%) translate(-100px, 150px)' }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 rounded-full blur-2xl animate-pulse" 
               style={{ transform: 'translate(-50%, 50%) translate(150px, -100px)' }} />
          
          {/* Floating particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `float ${20 + particle.id * 2}s ease-in-out infinite`,
              }}
            />
          ))}
        </>
      )}
      
      {mode === 'mood' && currentMood && (
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
      
      {mode === 'full' && (
        <>
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5" />
          
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53d3cuZ3JhcGhpY3N0LmNvbS9maWJlci8wLjIvc3ZnIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSI+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI2ZmZmZmZmIi8+PC9zdmc+')] animate-pulse" />
          
          {/* Floating light rays */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white/10 via-transparent to-transparent animate-pulse" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-white/5 via-transparent to-transparent animate-pulse" 
               style={{ animationDelay: '1s' }} />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-white/10 via-transparent to-transparent animate-pulse" 
               style={{ animationDelay: '2s' }} />
        </>
      )}
      
      {/* Subtle vignette effect for all modes except none */}
      {(mode === 'particles' || mode === 'mood' || mode === 'full') && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
        </>
      )}
    </div>
  );
}
