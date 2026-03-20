/*
 * DESIGN: Bengal Renaissance Manuscript
 * Reading settings context — controls language display, font size, and reading preferences
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type LanguageMode = "both" | "bengali" | "english";

interface ReadingSettings {
  languageMode: LanguageMode;
  fontSize: number; // 0.85 to 1.4 scale
  showArtInfo: boolean;
}

interface ReadingSettingsContextType {
  settings: ReadingSettings;
  setLanguageMode: (mode: LanguageMode) => void;
  setFontSize: (size: number) => void;
  toggleArtInfo: () => void;
}

const ReadingSettingsContext = createContext<ReadingSettingsContextType | null>(null);

const STORAGE_KEY = "shesher-kobita-settings";

function loadSettings(): ReadingSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    languageMode: "both",
    fontSize: 1,
    showArtInfo: true,
  };
}

function saveSettings(settings: ReadingSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export function ReadingSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReadingSettings>(loadSettings);

  const setLanguageMode = useCallback((mode: LanguageMode) => {
    setSettings((prev) => {
      const next = { ...prev, languageMode: mode };
      saveSettings(next);
      return next;
    });
  }, []);

  const setFontSize = useCallback((size: number) => {
    setSettings((prev) => {
      const next = { ...prev, fontSize: Math.max(0.85, Math.min(1.4, size)) };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleArtInfo = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, showArtInfo: !prev.showArtInfo };
      saveSettings(next);
      return next;
    });
  }, []);

  return (
    <ReadingSettingsContext.Provider value={{ settings, setLanguageMode, setFontSize, toggleArtInfo }}>
      {children}
    </ReadingSettingsContext.Provider>
  );
}

export function useReadingSettings() {
  const ctx = useContext(ReadingSettingsContext);
  if (!ctx) throw new Error("useReadingSettings must be used within ReadingSettingsProvider");
  return ctx;
}
