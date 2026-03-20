/*
 * DESIGN: Bengal Renaissance Manuscript
 * Reading settings context — controls language display, font size, font family,
 * distraction-free mode, and reading preferences
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type LanguageMode = "both" | "bengali" | "english";

export interface FontOption {
  id: string;
  label: string;
  family: string;
  sampleText: string;
}

export const ENGLISH_FONTS: FontOption[] = [
  {
    id: "cormorant",
    label: "Cormorant Garamond",
    family: "'Cormorant Garamond', Georgia, serif",
    sampleText: "The heart remembers what the mind forgets.",
  },
  {
    id: "crimson",
    label: "Crimson Pro",
    family: "'Crimson Pro', Georgia, serif",
    sampleText: "The heart remembers what the mind forgets.",
  },
  {
    id: "playfair",
    label: "Playfair Display",
    family: "'Playfair Display', Georgia, serif",
    sampleText: "The heart remembers what the mind forgets.",
  },
  {
    id: "eb-garamond",
    label: "EB Garamond",
    family: "'EB Garamond', Georgia, serif",
    sampleText: "The heart remembers what the mind forgets.",
  },
  {
    id: "lora",
    label: "Lora",
    family: "'Lora', Georgia, serif",
    sampleText: "The heart remembers what the mind forgets.",
  },
];

export const BENGALI_FONTS: FontOption[] = [
  {
    id: "noto-serif-bn",
    label: "Noto Serif Bengali",
    family: "'Noto Serif Bengali', serif",
    sampleText: "হৃদয় মনে রাখে যা মন ভুলে যায়।",
  },
  {
    id: "hind-siliguri",
    label: "Hind Siliguri",
    family: "'Hind Siliguri', sans-serif",
    sampleText: "হৃদয় মনে রাখে যা মন ভুলে যায়।",
  },
  {
    id: "tiro-bangla",
    label: "Tiro Bangla",
    family: "'Tiro Bangla', serif",
    sampleText: "হৃদয় মনে রাখে যা মন ভুলে যায়।",
  },
];

interface ReadingSettings {
  languageMode: LanguageMode;
  fontSize: number; // 0.85 to 1.4 scale
  showArtInfo: boolean;
  englishFontId: string;
  bengaliFontId: string;
  distractionFree: boolean;
}

interface ReadingSettingsContextType {
  settings: ReadingSettings;
  setLanguageMode: (mode: LanguageMode) => void;
  setFontSize: (size: number) => void;
  toggleArtInfo: () => void;
  setEnglishFont: (fontId: string) => void;
  setBengaliFont: (fontId: string) => void;
  toggleDistractionFree: () => void;
  getEnglishFontFamily: () => string;
  getBengaliFontFamily: () => string;
}

const ReadingSettingsContext = createContext<ReadingSettingsContextType | null>(null);

const STORAGE_KEY = "shesher-kobita-settings";

function loadSettings(): ReadingSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        languageMode: parsed.languageMode || "both",
        fontSize: parsed.fontSize || 1,
        showArtInfo: parsed.showArtInfo ?? true,
        englishFontId: parsed.englishFontId || "cormorant",
        bengaliFontId: parsed.bengaliFontId || "noto-serif-bn",
        distractionFree: parsed.distractionFree ?? false,
      };
    }
  } catch {}
  return {
    languageMode: "both",
    fontSize: 1,
    showArtInfo: true,
    englishFontId: "cormorant",
    bengaliFontId: "noto-serif-bn",
    distractionFree: false,
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

  const setEnglishFont = useCallback((fontId: string) => {
    setSettings((prev) => {
      const next = { ...prev, englishFontId: fontId };
      saveSettings(next);
      return next;
    });
  }, []);

  const setBengaliFont = useCallback((fontId: string) => {
    setSettings((prev) => {
      const next = { ...prev, bengaliFontId: fontId };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleDistractionFree = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, distractionFree: !prev.distractionFree };
      saveSettings(next);
      return next;
    });
  }, []);

  const getEnglishFontFamily = useCallback(() => {
    const font = ENGLISH_FONTS.find((f) => f.id === settings.englishFontId);
    return font?.family || ENGLISH_FONTS[0].family;
  }, [settings.englishFontId]);

  const getBengaliFontFamily = useCallback(() => {
    const font = BENGALI_FONTS.find((f) => f.id === settings.bengaliFontId);
    return font?.family || BENGALI_FONTS[0].family;
  }, [settings.bengaliFontId]);

  return (
    <ReadingSettingsContext.Provider
      value={{
        settings,
        setLanguageMode,
        setFontSize,
        toggleArtInfo,
        setEnglishFont,
        setBengaliFont,
        toggleDistractionFree,
        getEnglishFontFamily,
        getBengaliFontFamily,
      }}
    >
      {children}
    </ReadingSettingsContext.Provider>
  );
}

export function useReadingSettings() {
  const ctx = useContext(ReadingSettingsContext);
  if (!ctx) throw new Error("useReadingSettings must be used within ReadingSettingsProvider");
  return ctx;
}
