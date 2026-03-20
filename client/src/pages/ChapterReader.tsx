/*
 * DESIGN: Bengal Renaissance Manuscript
 * Chapter Reader — illuminated manuscript page with bilingual paragraphs,
 * chapter artwork, verse styling, and reading controls.
 * Typography: Cormorant Garamond (English) + Noto Serif Bengali
 */

import { useParams, Link, useLocation } from "wouter";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings2,
  Moon,
  Sun,
  X,
  Languages,
  Type,
  Palette,
  ArrowUp,
} from "lucide-react";
import bookData from "@/data/bookData.json";
import type { BookData, Chapter } from "@/lib/types";
import { useReadingSettings, type LanguageMode } from "@/contexts/ReadingSettingsContext";
import { useTheme } from "@/contexts/ThemeContext";

const data = bookData as BookData;

const ORNAMENT_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663420633053/X4wwoxG22xEKUUULkLPCMc/ornament-divider-7z9LeV7WuEv8jmtpjyjwF2.png";

export default function ChapterReader() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const chapterNum = parseInt(params.id || "1", 10);
  const chapter = data.chapters.find((c) => c.number === chapterNum);
  const [showSettings, setShowSettings] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const { settings, setLanguageMode, setFontSize } = useReadingSettings();
  const { theme, toggleTheme } = useTheme();

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
  const nextChapter = chapterNum < data.chapters.length ? chapterNum + 1 : null;

  // Split title
  const [bnTitle, enTitle] = useMemo(() => {
    if (!chapter) return ["", ""];
    const parts = chapter.title.split(" — ");
    return [parts[0] || "", parts[1] || ""];
  }, [chapter]);

  // Scroll to top on chapter change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "instant" });
    window.scrollTo(0, 0);
  }, [chapterNum]);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-2xl text-foreground/60 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Chapter not found
          </p>
          <Link href="/">
            <span className="text-primary hover:underline" style={{ fontFamily: "var(--font-serif)" }}>
              Return to contents
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" ref={topRef}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="p-2 rounded-sm hover:bg-secondary transition-colors inline-flex">
                <Home size={18} className="text-foreground/60" />
              </span>
            </Link>
            <div className="hidden sm:block">
              <p
                className="text-xs text-muted-foreground tracking-wider uppercase"
                style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.15em" }}
              >
                Chapter {chapter.number} of {data.chapters.length}
              </p>
            </div>
          </div>

          <div className="text-center flex-1 px-4">
            <p
              className="text-sm text-foreground/80 truncate"
              style={{ fontFamily: "var(--font-bengali)" }}
            >
              {bnTitle}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-sm hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} className="text-foreground/60" /> : <Moon size={18} className="text-foreground/60" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-sm hover:bg-secondary transition-colors"
              aria-label="Reading settings"
            >
              <Settings2 size={18} className="text-foreground/60" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sticky top-[57px] z-30 bg-card border-b border-border/60 shadow-md"
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <h4
                  className="text-sm font-medium text-foreground/70 tracking-wider uppercase"
                  style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.1em" }}
                >
                  Reading Settings
                </h4>
                <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-secondary rounded-sm">
                  <X size={16} className="text-foreground/50" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Language mode */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Languages size={14} />
                    <span style={{ fontFamily: "var(--font-serif)" }}>Language Display</span>
                  </label>
                  <div className="flex gap-1">
                    {(["both", "bengali", "english"] as LanguageMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setLanguageMode(mode)}
                        className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                          settings.languageMode === mode
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-transparent text-foreground/60 border-border hover:border-primary/40"
                        }`}
                        style={{ fontFamily: mode === "bengali" ? "var(--font-bengali)" : "var(--font-serif)" }}
                      >
                        {mode === "both" ? "Both" : mode === "bengali" ? "বাংলা" : "English"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font size */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Type size={14} />
                    <span style={{ fontFamily: "var(--font-serif)" }}>Text Size</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFontSize(settings.fontSize - 0.05)}
                      className="px-2.5 py-1 text-sm border border-border rounded-sm hover:bg-secondary"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      A-
                    </button>
                    <span className="text-xs text-muted-foreground w-12 text-center" style={{ fontFamily: "var(--font-serif)" }}>
                      {Math.round(settings.fontSize * 100)}%
                    </span>
                    <button
                      onClick={() => setFontSize(settings.fontSize + 0.05)}
                      className="px-2.5 py-1 text-sm border border-border rounded-sm hover:bg-secondary"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Artwork */}
      <section className="relative">
        <div className="chapter-image-frame mx-4 sm:mx-8 lg:mx-auto lg:max-w-4xl mt-6">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={chapter.imageUrl}
              alt={chapter.artTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <p
                className="text-white/50 text-xs tracking-wider mb-1"
                style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.15em" }}
              >
                <Palette size={12} className="inline mr-1.5 -mt-0.5" />
                {chapter.artStyle}
              </p>
              <p
                className="text-white/80 text-sm italic"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                "{chapter.artTitle}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter Title */}
      <section className="max-w-3xl mx-auto px-6 pt-10 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p
            className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Chapter {chapter.number}
          </p>
          <h1
            className="text-3xl sm:text-4xl text-foreground/90 mb-2"
            style={{ fontFamily: "var(--font-bengali)", fontWeight: 500 }}
          >
            {bnTitle}
          </h1>
          <h2
            className="text-xl sm:text-2xl text-foreground/60 italic font-light"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {enTitle}
          </h2>
        </motion.div>
      </section>

      {/* Ornament */}
      <div className="flex justify-center pb-8">
        <img src={ORNAMENT_URL} alt="" className="h-5 opacity-30 dark:opacity-20" />
      </div>

      {/* Chapter Content */}
      <article className="max-w-3xl mx-auto px-6 pb-16 manuscript-page">
        <div style={{ fontSize: `${settings.fontSize}rem` }}>
          {chapter.paragraphs.map((para, i) => (
            <ParagraphBlock
              key={i}
              bn={para.bn}
              en={para.en}
              isVerse={para.isVerse}
              languageMode={settings.languageMode}
              index={i}
            />
          ))}
        </div>
      </article>

      {/* Chapter Navigation */}
      <nav className="border-t border-border/40 bg-card/50">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Ornament */}
          <div className="flex justify-center mb-8">
            <img src={ORNAMENT_URL} alt="" className="h-4 opacity-25 dark:opacity-15" />
          </div>

          <div className="flex items-stretch gap-4">
            {prevChapter ? (
              <Link href={`/chapter/${prevChapter}`}>
                <span className="flex-1 group flex items-center gap-3 px-5 py-4 border border-border/60 rounded-sm hover:border-primary/30 hover:bg-secondary/50 transition-all cursor-pointer">
                  <ChevronLeft size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <div>
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-serif)" }}>
                      Previous
                    </p>
                    <p className="text-sm text-foreground/80" style={{ fontFamily: "var(--font-bengali)" }}>
                      {data.chapters[prevChapter - 1].title.split(" — ")[0]}
                    </p>
                  </div>
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextChapter ? (
              <Link href={`/chapter/${nextChapter}`}>
                <span className="flex-1 group flex items-center justify-end gap-3 px-5 py-4 border border-border/60 rounded-sm hover:border-primary/30 hover:bg-secondary/50 transition-all cursor-pointer text-right">
                  <div>
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-serif)" }}>
                      Next
                    </p>
                    <p className="text-sm text-foreground/80" style={{ fontFamily: "var(--font-bengali)" }}>
                      {data.chapters[nextChapter - 1].title.split(" — ")[0]}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </span>
              </Link>
            ) : (
              <Link href="/">
                <span className="flex-1 group flex items-center justify-end gap-3 px-5 py-4 border border-border/60 rounded-sm hover:border-primary/30 hover:bg-secondary/50 transition-all cursor-pointer text-right">
                  <div>
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-serif)" }}>
                      Return to
                    </p>
                    <p className="text-sm text-foreground/80" style={{ fontFamily: "var(--font-serif)" }}>
                      Table of Contents
                    </p>
                  </div>
                  <Home size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Paragraph Block ─── */

interface ParagraphBlockProps {
  bn: string;
  en: string;
  isVerse: boolean;
  languageMode: LanguageMode;
  index: number;
}

function ParagraphBlock({ bn, en, isVerse, languageMode, index }: ParagraphBlockProps) {
  const showBn = languageMode === "both" || languageMode === "bengali";
  const showEn = languageMode === "both" || languageMode === "english";

  if (isVerse) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="my-8 py-6 px-6 sm:px-10 border-l-2 border-r-2 bg-secondary/30 rounded-sm"
        style={{ borderColor: "var(--color-sienna)" }}
      >
        {showBn && (
          <div
            className="bengali-text whitespace-pre-line text-foreground/85 mb-4"
            style={{ fontFamily: "var(--font-bengali)", lineHeight: 2.2 }}
          >
            {bn}
          </div>
        )}
        {showBn && showEn && (
          <div className="flex justify-center my-3">
            <div className="w-12 h-px bg-border" />
          </div>
        )}
        {showEn && (
          <div
            className="english-text whitespace-pre-line text-foreground/70 italic"
            style={{ fontFamily: "var(--font-serif)", lineHeight: 2, fontWeight: 400 }}
          >
            {en}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4 }}
      className="mb-7"
    >
      {showBn && (
        <p
          className="bengali-text text-foreground/85 mb-2"
          style={{ fontFamily: "var(--font-bengali)", lineHeight: 2 }}
        >
          {bn}
        </p>
      )}
      {showBn && showEn && (
        <div className="w-8 h-px bg-border/60 my-2.5 ml-0" />
      )}
      {showEn && (
        <p
          className="english-text text-foreground/60"
          style={{ fontFamily: "var(--font-serif)", lineHeight: 1.9, fontWeight: 400 }}
        >
          {en}
        </p>
      )}
    </motion.div>
  );
}
