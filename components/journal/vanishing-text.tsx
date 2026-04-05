'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Ghost, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VanishingTextProps {
  onClose: () => void;
}

interface FadingLine {
  id: number;
  text: string;
  createdAt: number;
}

export function VanishingText({ onClose }: VanishingTextProps) {
  const [currentText, setCurrentText] = useState('');
  const [lines, setLines] = useState<FadingLine[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const idCounter = useRef(0);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Remove faded lines after animation completes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLines(prev => prev.filter(line => now - line.createdAt < 4000));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentText.trim()) {
      e.preventDefault();
      setLines(prev => [...prev, {
        id: idCounter.current++,
        text: currentText,
        createdAt: Date.now()
      }]);
      setCurrentText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col animate-fade-in">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Ghost className="size-5 text-primary" />
          <div>
            <h2 className="font-serif text-lg text-foreground">write without saving</h2>
            <p className="text-xs text-muted-foreground">your words will fade away...</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden relative p-8">
        {/* Fading lines */}
        <div className="absolute inset-0 p-8 overflow-hidden pointer-events-none">
          {lines.map(line => (
            <p
              key={line.id}
              className="font-serif text-xl text-foreground/80 mb-4 animate-fade-out"
            >
              {line.text}
            </p>
          ))}
        </div>

        {/* Input area */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <textarea
            ref={textareaRef}
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type and press enter... it will slowly disappear"
            className={cn(
              "w-full max-w-2xl bg-transparent border-none resize-none",
              "font-serif text-2xl text-center text-foreground",
              "placeholder:text-muted-foreground/50",
              "focus:outline-none leading-relaxed"
            )}
            rows={3}
          />
          <p className="text-xs text-muted-foreground/50 mt-8">
            nothing here is saved. let it go.
          </p>
        </div>
      </div>
    </div>
  );
}
