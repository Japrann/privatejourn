'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FeedbackToastProps {
  message: string;
  onDone: () => void;
}

export function FeedbackToast({ message, onDone }: FeedbackToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
        "px-6 py-3 rounded-full glass-card",
        "font-serif text-sm text-foreground/80 italic",
        "transition-all duration-300",
        visible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
      )}
    >
      {message}
    </div>
  );
}
