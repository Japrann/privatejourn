'use client';

import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onMenuClick: () => void;
}

export function SearchBar({ value, onChange, onMenuClick }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden text-muted-foreground hover:text-foreground"
      >
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </Button>
      
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="search your memories..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "pl-11 py-5 rounded-xl",
            "glass-card border-border/30",
            "text-foreground placeholder:text-muted-foreground/50",
            "focus:ring-primary/30"
          )}
        />
      </div>
    </div>
  );
}
