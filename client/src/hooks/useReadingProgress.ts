/*
 * DESIGN: Bengal Renaissance Manuscript
 * Reading progress hook — saves chapter + scroll position to localStorage,
 * provides resume functionality like the Shipwreck project.
 */

import { useEffect, useCallback, useRef } from "react";

const PROGRESS_KEY = "shesher-kobita-progress";
const SAVE_INTERVAL = 2000; // Save every 2 seconds while scrolling

export interface ReadingProgress {
  chapterNumber: number;
  chapterTitle: string;
  scrollPercent: number;
  paragraphIndex: number;
  timestamp: number;
}

function getProgress(): ReadingProgress | null {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate structure
      if (parsed.chapterNumber && parsed.timestamp) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

function saveProgress(progress: ReadingProgress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {}
}

export function clearProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {}
}

export function getStoredProgress(): ReadingProgress | null {
  return getProgress();
}

/**
 * Hook to track reading progress in a chapter.
 * Saves scroll position periodically and on unmount.
 */
export function useReadingProgress(chapterNumber: number, chapterTitle: string) {
  const lastSaveRef = useRef(0);
  const chapterRef = useRef(chapterNumber);
  chapterRef.current = chapterNumber;

  const calculateProgress = useCallback((): ReadingProgress => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    // Find the most visible paragraph by checking which paragraph elements are in view
    let paragraphIndex = 0;
    const paragraphs = document.querySelectorAll("[data-para-index]");
    const viewportMiddle = window.innerHeight / 2;

    for (let i = 0; i < paragraphs.length; i++) {
      const rect = paragraphs[i].getBoundingClientRect();
      if (rect.top <= viewportMiddle && rect.bottom >= 0) {
        paragraphIndex = parseInt(
          (paragraphs[i] as HTMLElement).dataset.paraIndex || "0",
          10
        );
      }
    }

    return {
      chapterNumber: chapterRef.current,
      chapterTitle,
      scrollPercent,
      paragraphIndex,
      timestamp: Date.now(),
    };
  }, [chapterTitle]);

  // Save on scroll (throttled)
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastSaveRef.current > SAVE_INTERVAL) {
        lastSaveRef.current = now;
        saveProgress(calculateProgress());
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [calculateProgress]);

  // Save on unmount / chapter change
  useEffect(() => {
    return () => {
      saveProgress(calculateProgress());
    };
  }, [calculateProgress, chapterNumber]);

  // Save on page visibility change (user switches tab)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        saveProgress(calculateProgress());
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [calculateProgress]);
}

/**
 * Format a timestamp into a human-readable relative time string.
 */
export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(timestamp).toLocaleDateString();
}
