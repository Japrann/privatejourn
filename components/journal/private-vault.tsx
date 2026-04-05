'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, EyeOff, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Note } from '@/lib/types';

interface PrivateVaultProps {
  notes: Note[];
  onAddPrivateNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  onDeletePrivateNote: (id: string) => Promise<void>;
}

export function PrivateVault({ notes, onAddPrivateNote, onDeletePrivateNote }: PrivateVaultProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', mood: 'calm' as const, date: new Date().toISOString().split('T')[0] });

  // Default PIN - in production, this should be stored securely
  const DEFAULT_PIN = '1234';

  useEffect(() => {
    // Check if vault was previously unlocked in this session
    const wasUnlocked = sessionStorage.getItem('vault-unlocked') === 'true';
    if (wasUnlocked) {
      setIsLocked(false);
    }
  }, []);

  const handleUnlock = () => {
    if (pin === DEFAULT_PIN) {
      setIsLocked(false);
      sessionStorage.setItem('vault-unlocked', 'true');
      setPin('');
    } else {
      // Shake animation for wrong PIN
      const input = document.getElementById('pin-input');
      if (input) {
        input.classList.add('animate-pulse');
        setTimeout(() => input.classList.remove('animate-pulse'), 500);
      }
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    sessionStorage.removeItem('vault-unlocked');
    setSelectedNote(null);
    setIsAddingNote(false);
  };

  const handleAddNote = async () => {
    if (!newNote.title || !newNote.content) return;
    
    await onAddPrivateNote({
      ...newNote,
      isPublic: false,
      isSpecial: false,
      isLetter: false,
      recipient: null
    });
    
    setNewNote({ title: '', content: '', mood: 'calm', date: new Date().toISOString().split('T')[0] });
    setIsAddingNote(false);
  };

  const handleDeleteNote = async (id: string) => {
    await onDeletePrivateNote(id);
    setSelectedNote(null);
  };

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 animate-fade-in text-center">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mb-4 glow-effect animate-soft-pulse">
                <Lock className="w-10 h-10 text-destructive" />
              </div>
              <h1 className="font-serif text-3xl text-foreground mb-2">private vault</h1>
              <p className="text-muted-foreground">enter your pin to access secret thoughts</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  id="pin-input"
                  type={showPin ? "text" : "password"}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="text-center text-2xl tracking-widest bg-input border-border focus:ring-destructive/50"
                  maxLength={4}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUnlock();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                onClick={handleUnlock}
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground glow-effect"
                disabled={pin.length !== 4}
              >
                <Unlock className="w-4 h-4 mr-2" />
                unlock vault
              </Button>
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Shield className="w-4 h-4" />
                <span>your private thoughts are encrypted and secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <Unlock className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h1 className="font-serif text-2xl text-foreground">private vault</h1>
              <p className="text-muted-foreground text-sm">{notes.length} secret thoughts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsAddingNote(true)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              add secret
            </Button>
            <Button
              onClick={handleLock}
              variant="outline"
              className="border-border hover:bg-secondary"
            >
              <Lock className="w-4 h-4 mr-2" />
              lock vault
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {isAddingNote && (
          <div className="mb-6 glass-card rounded-2xl p-6 border border-destructive/20">
            <h2 className="font-serif text-xl text-foreground mb-4">new secret thought</h2>
            <div className="space-y-4">
              <Input
                placeholder="title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="bg-input border-border"
              />
              <textarea
                placeholder="your secret thoughts..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full h-32 p-3 bg-input border border-border rounded-lg resize-none focus:ring-destructive/50 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newNote.mood}
                  onChange={(e) => setNewNote({ ...newNote, mood: e.target.value as any })}
                  className="px-3 py-2 bg-input border border-border rounded-lg focus:ring-destructive/50 focus:outline-none"
                >
                  <option value="calm">calm</option>
                  <option value="happy">happy</option>
                  <option value="tired">tired</option>
                  <option value="overthinking">overthinking</option>
                  <option value="missing">missing</option>
                </select>
                <Input
                  type="date"
                  value={newNote.date}
                  onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddNote}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  disabled={!newNote.title || !newNote.content}
                >
                  save secret
                </Button>
                <Button
                  onClick={() => setIsAddingNote(false)}
                  variant="outline"
                  className="border-border hover:bg-secondary"
                >
                  cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {selectedNote ? (
          <div className="glass-card rounded-2xl p-6 border border-destructive/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-2">{selectedNote.title}</h2>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <Key className="w-4 h-4" />
                    {selectedNote.date}
                  </span>
                  <span className="px-2 py-1 bg-destructive/20 text-destructive rounded-full text-xs">
                    secret
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDeleteNote(selectedNote.id)}
                  variant="outline"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  delete
                </Button>
                <Button
                  onClick={() => setSelectedNote(null)}
                  variant="outline"
                  className="border-border hover:bg-secondary"
                >
                  back
                </Button>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{selectedNote.content}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note, index) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="glass-card rounded-xl p-4 cursor-pointer hover:scale-105 transition-all duration-200 border border-destructive/20 hover:border-destructive/40"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-lg text-foreground line-clamp-1">{note.title}</h3>
                  <Key className="w-4 h-4 text-destructive flex-shrink-0" />
                </div>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-2">{note.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{note.date}</span>
                  <span className="px-2 py-1 bg-destructive/20 text-destructive rounded-full text-xs">
                    secret
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {notes.length === 0 && !isAddingNote && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl text-muted-foreground mb-2">no secret thoughts yet</h3>
            <p className="text-muted-foreground text-sm mb-4">your private vault is empty and secure</p>
            <Button
              onClick={() => setIsAddingNote(true)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              add your first secret
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
