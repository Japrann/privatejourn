export type Mood = 'happy' | 'tired' | 'overthinking' | 'missing' | 'calm';

export type AccentColor = 'purple' | 'blue' | 'pink';

export type AmbientMode = 'none' | 'rain' | 'night' | 'silence';

export interface Note {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  date: string;
  isSpecial?: boolean;
  isLetter?: boolean;
  recipient?: string;
  isPublic?: boolean;
  createdAt: string;
}

export interface JournalSettings {
  journalName: string;
  accentColor: AccentColor;
  ambientMode: AmbientMode;
}

export const moodConfig: Record<Mood, { label: string; emoji: string; color: string }> = {
  happy: { label: 'Happy', emoji: '✨', color: 'bg-mood-happy text-background' },
  tired: { label: 'Tired', emoji: '🌙', color: 'bg-mood-tired text-foreground' },
  overthinking: { label: 'Overthinking', emoji: '💭', color: 'bg-mood-overthinking text-foreground' },
  missing: { label: 'A quiet longing', emoji: '🤷‍♂️', color: 'bg-mood-missing text-foreground' },
  calm: { label: 'Calm', emoji: '🍃', color: 'bg-mood-calm text-background' },
};

export const feedbackMessages = {
  save: [
    "noted... take your time",
    "saved. your words matter",
    "kept safe, always",
    "this moment is yours now"
  ],
  delete: [
    "let go... it's okay",
    "released into the void"
  ],
  empty: "it feels quiet here... maybe write something"
};

export const getRandomFeedback = (type: keyof typeof feedbackMessages): string => {
  const messages = feedbackMessages[type];
  if (Array.isArray(messages)) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return messages;
};
