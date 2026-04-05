'use client';

import { 
  Home, 
  Search, 
  Plus, 
  Heart, 
  Moon, 
  Brain, 
  MessageCircle, 
  Sparkles, 
  Settings, 
  Lock, 
  Shield,
  BookOpen,
  Clock,
  PenTool,
  Mail,
  Ghost,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'all' | 'new' | 'filter' | 'special' | 'lock' | 'vanish' | 'letter' | 'timeline' | 'settings';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
  journalName: string;
  onRandomMemory: () => void;
}

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Notes', icon: <BookOpen className="size-5" /> },
  { id: 'timeline', label: 'Timeline', icon: <Clock className="size-5" /> },
  { id: 'new', label: 'New Entry', icon: <PenTool className="size-5" /> },
  { id: 'letter', label: 'Write a Letter', icon: <Mail className="size-5" /> },
  { id: 'special', label: 'Special Note', icon: <Sparkles className="size-5" /> },
  { id: 'vanish', label: 'Vanishing Text', icon: <Ghost className="size-5" /> },
  { id: 'filter', label: 'Filter by Mood', icon: <Filter className="size-5" /> },
];

export function Sidebar({ currentView, onViewChange, isOpen, onClose, journalName, onRandomMemory }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 glass-card border-r border-border/50",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border/30">
          <h1 className="font-serif text-2xl text-foreground tracking-wide">
            {journalName}
          </h1>
          <p className="text-xs text-muted-foreground mt-2 italic leading-relaxed">
            &ldquo;this is where i say things i can&apos;t say out loud&rdquo;
          </p>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                    "text-sm font-medium transition-all duration-200",
                    currentView === item.id
                      ? "bg-primary/20 text-primary shadow-[0_0_15px_var(--glow)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Random Memory Button */}
          <div className="mt-6 pt-4 border-t border-border/30">
            <button
              onClick={() => {
                onRandomMemory();
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                "text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:text-foreground",
                "glass-card hover:shadow-[0_0_20px_var(--glow)]"
              )}
            >
              <Sparkles className="size-5" />
              Random Memory
            </button>
          </div>
        </nav>
        
        {/* Bottom actions */}
        <div className="p-4 border-t border-border/30 space-y-2">
          <button
            onClick={() => {
              window.location.href = '/vault';
              onClose();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
              "text-sm font-medium transition-all duration-200",
              "text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20"
            )}
          >
            <Shield className="size-5" />
            Private Vault
          </button>
          <button
            onClick={() => {
              onViewChange('settings');
              onClose();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
              "text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            )}
          >
            <Settings className="size-5" />
            Personalize
          </button>
          <button
            onClick={() => {
              onViewChange('lock');
              onClose();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
              "text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            )}
          >
            <Lock className="size-5" />
            Lock Journal
          </button>
        </div>
      </aside>
    </>
  );
}
