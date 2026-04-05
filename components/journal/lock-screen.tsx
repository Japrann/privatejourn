'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Lock, Delete } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
  pin: string;
}

export function LockScreen({ onUnlock, pin }: LockScreenProps) {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState(false);
  
  const handleDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        if (newPin === pin) {
          setTimeout(onUnlock, 300);
        } else {
          setError(true);
          setTimeout(() => {
            setEnteredPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };
  
  const handleDelete = () => {
    setEnteredPin(enteredPin.slice(0, -1));
    setError(false);
  };
  
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  
  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative text-center mb-12">
        <div className={cn(
          "size-24 rounded-full glass-card flex items-center justify-center mx-auto mb-8",
          "transition-all duration-300",
          error && "bg-destructive/20 animate-shake"
        )}>
          <Lock className={cn(
            "size-12 text-primary transition-colors",
            error && "text-destructive"
          )} />
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-3">welcome back</h1>
        <p className="text-muted-foreground text-sm">enter your pin to continue</p>
      </div>
      
      {/* PIN dots */}
      <div className="flex gap-5 mb-14">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "size-4 rounded-full transition-all duration-200",
              enteredPin.length > i
                ? error
                  ? "bg-destructive scale-125"
                  : "bg-primary scale-125 shadow-[0_0_15px_var(--glow)]"
                : "bg-secondary/50"
            )}
          />
        ))}
      </div>
      
      {/* Number pad */}
      <div className="grid grid-cols-3 gap-4 max-w-[300px]">
        {digits.map((digit, i) => {
          if (digit === '') {
            return <div key={i} />;
          }
          
          if (digit === 'del') {
            return (
              <button
                key={i}
                onClick={handleDelete}
                className="size-18 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
              >
                <Delete className="size-6" />
              </button>
            );
          }
          
          return (
            <button
              key={i}
              onClick={() => handleDigit(digit)}
              className={cn(
                "size-18 rounded-full flex items-center justify-center",
                "text-2xl font-medium text-foreground",
                "glass-card hover:bg-primary/20",
                "transition-all duration-200",
                "active:scale-90 active:bg-primary/30"
              )}
            >
              {digit}
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground/50 mt-14 italic">
        default pin: 1234
      </p>
    </div>
  );
}
