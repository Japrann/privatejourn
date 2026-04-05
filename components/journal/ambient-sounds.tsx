'use client';

import { useEffect, useState, useRef } from 'react';

export function AmbientSounds() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isClient, setIsClient] = useState(false);
  const audioContextRef = useRef<any>(null);
  const soundNodesRef = useRef<any[]>([]);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize audio context only once when client is ready
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [isClient]);

  // Handle playing state changes
  useEffect(() => {
    if (!isClient || !audioContextRef.current) return;

    if (isPlaying) {
      // Start ambient sounds
      const frequencies = [220, 277.18, 329.63, 440]; // A minor chord
      soundNodesRef.current = frequencies.map(freq => {
        const osc = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
        gain.gain.setValueAtTime(volume * 0.05, audioContextRef.current.currentTime);
        
        osc.connect(gain);
        gain.connect(audioContextRef.current.destination);
        osc.start();
        
        return { oscillator: osc, gainNode: gain };
      });
    } else {
      // Stop all sounds
      soundNodesRef.current.forEach(({ oscillator, gainNode }) => {
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.5);
        oscillator.stop(audioContextRef.current.currentTime + 0.5);
      });
      soundNodesRef.current = [];
    }
  }, [isClient, isPlaying, volume]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isClient) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'a' && e.ctrlKey) {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [isClient, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && soundNodesRef.current.length > 0) {
        soundNodesRef.current.forEach(({ oscillator, gainNode }) => {
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.5);
          oscillator.stop(audioContextRef.current.currentTime + 0.5);
        });
      }
    };
  }, []);

  // Don't render on server to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90 transition-all"
        title="Toggle ambient sounds (Ctrl+A)"
      >
        <div className={`w-4 h-4 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
      </button>
      
      {isPlaying && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">🎵</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
            title="Adjust volume"
          />
        </div>
      )}
    </div>
  );
}
