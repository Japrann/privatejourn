'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-30",
        "size-14 rounded-full",
        "bg-primary text-primary-foreground",
        "flex items-center justify-center",
        "glow-effect animate-soft-pulse",
        "transition-transform duration-200",
        "hover:scale-110 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      )}
      aria-label="Create new entry"
    >
      <Plus className="size-6" />
    </button>
  );
}
