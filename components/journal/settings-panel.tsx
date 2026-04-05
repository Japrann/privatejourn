'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Settings, Palette, CloudRain, Moon, VolumeX } from 'lucide-react';
import { JournalSettings, AccentColor, AmbientMode } from '@/lib/types';

interface SettingsPanelProps {
  settings: JournalSettings;
  onSave: (settings: JournalSettings) => void;
  onClose: () => void;
}

const accentColors: { id: AccentColor; label: string; color: string }[] = [
  { id: 'purple', label: 'Violet', color: 'bg-[oklch(0.65_0.18_285)]' },
  { id: 'blue', label: 'Ocean', color: 'bg-[oklch(0.65_0.18_250)]' },
  { id: 'pink', label: 'Rose', color: 'bg-[oklch(0.65_0.18_350)]' },
];

const ambientModes: { id: AmbientMode; label: string; icon: React.ReactNode }[] = [
  { id: 'none', label: 'None', icon: <VolumeX className="size-4" /> },
  { id: 'rain', label: 'Rain', icon: <CloudRain className="size-4" /> },
  { id: 'night', label: 'Night', icon: <Moon className="size-4" /> },
];

export function SettingsPanel({ settings, onSave, onClose }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative w-full max-w-md glass-card rounded-2xl p-6",
          "animate-slide-up"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <Settings className="size-5 text-primary" />
          <h2 className="font-serif text-xl text-foreground">personalize</h2>
        </div>

        {/* Journal Name */}
        <div className="space-y-3 mb-8">
          <label className="text-sm text-muted-foreground">
            name your space
          </label>
          <Input
            value={localSettings.journalName}
            onChange={(e) => setLocalSettings({ ...localSettings, journalName: e.target.value })}
            placeholder="my quiet corner..."
            className="bg-input border-border font-serif"
          />
        </div>

        {/* Accent Color */}
        <div className="space-y-3 mb-8">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <Palette className="size-4" />
            accent color
          </label>
          <div className="flex gap-3">
            {accentColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setLocalSettings({ ...localSettings, accentColor: color.id })}
                className={cn(
                  "size-12 rounded-full transition-all duration-200",
                  color.color,
                  localSettings.accentColor === color.id
                    ? "ring-2 ring-offset-2 ring-offset-background ring-white scale-110"
                    : "opacity-60 hover:opacity-100"
                )}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Ambient Mode */}
        <div className="space-y-3 mb-8">
          <label className="text-sm text-muted-foreground">
            ambient atmosphere
          </label>
          <div className="flex gap-2">
            {ambientModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setLocalSettings({ ...localSettings, ambientMode: mode.id })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
                  "text-sm font-medium transition-all duration-200",
                  localSettings.ambientMode === mode.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                )}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full py-5 bg-primary text-primary-foreground glow-effect"
        >
          save changes
        </Button>
      </div>
    </div>
  );
}
