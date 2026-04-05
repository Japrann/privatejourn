'use client';

import { useEffect, useState } from 'react';

export function AmbientSounds() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    // Create ambient sounds using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create ambient sound generator
    const createAmbientSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
      gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      return { oscillator, gainNode };
    };

    let soundNodes: any[] = [];
    
    const toggleAmbient = () => {
      if (isPlaying) {
        // Stop all sounds
        soundNodes.forEach(({ oscillator, gainNode }) => {
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
          oscillator.stop(audioContext.currentTime + 0.5);
        });
        soundNodes = [];
      } else {
        // Start ambient sounds
        const frequencies = [220, 277.18, 329.63, 440]; // A minor chord
        soundNodes = frequencies.map(freq => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioContext.currentTime);
          gain.gain.setValueAtTime(volume * 0.05, audioContext.currentTime);
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.start();
          
          return { oscillator: osc, gainNode: gain };
        });
      }
      setIsPlaying(!isPlaying);
    };

    // Add keyboard shortcut for ambient sounds
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'a' && e.ctrlKey) {
        e.preventDefault();
        toggleAmbient();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (soundNodes.length > 0) {
        soundNodes.forEach(({ oscillator, gainNode }) => {
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
          oscillator.stop(audioContext.currentTime + 0.5);
        });
      }
    };
  }, [isPlaying, volume]);

  // Don't render on server
  if (typeof window === 'undefined') {
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
