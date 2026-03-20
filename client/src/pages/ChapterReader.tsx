/*
 * DESIGN: Bengal Renaissance Manuscript
 * Chapter Reader — illuminated manuscript page with bilingual paragraphs,
 * chapter artwork, verse styling, reading controls, font picker, and distraction-free mode.
 * Typography: Selectable English fonts + Selectable Bengali fonts
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
  Eye,
  EyeOff,
  BookOpen,
} from "lucide-react";
import bookData from "@/data/bookData.json";
import type { BookData } from "@/lib/types";
import {
  useReadingSettings,
  type LanguageMode,
  ENGLISH_FONTS,
  BENGALI_FONTS,
} from "@/contexts/ReadingSettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useReadingProgress } from "@/hooks/useReadingProgress";

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
  const {
    settings,
    setLanguageMode,
    setFontSize,
    setEnglishFont,
    setBengaliFont,
    toggleDistractionFree,
    getEnglishFontFamily,
    getBengaliFontFamily,
  } = useReadingSettings();
  const { theme, toggleTheme } = useTheme();

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
  const nextChapter = chapterNum < data.chapters.length ? chapterNum + 1 : null;

  // Track reading progress
  useReadingProgress(chapterNum, chapter?.title || "");

  const englishFontFamily = getEnglishFontFamily();
  const bengaliFontFamily = getBengaliFontFamily();

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

  // Keyboard shortcut: Escape to exit distraction-free mode
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && settings.distractionFree) {
        toggleDistractionFree();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [settings.distractionFree, toggleDistractionFree]);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-2xl text-foreground/60 mb-4" style={{ fontFamily: englishFontFamily }}>
            Chapter not found
          </p>
          <Link href="/">
            <span className="text-primary hover:underline" style={{ fontFamily: englishFontFamily }}>
              Return to contents
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const isDistracted = settings.distractionFree;

  return (
    <div className="min-h-screen bg-background" ref={topRef}>
      {/* Sticky Header — hidden in distraction-free mode */}
      <AnimatePresence>
        {!isDistracted && (
          <motion.header
            initial={{ y: 0 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40"
          >
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
                    style={{ fontFamily: englishFontFamily, letterSpacing: "0.15em" }}
                  >
                    Chapter {chapter.number} of {data.chapters.length}
                  </p>
                </div>
              </div>

              <div className="text-center flex-1 px-4">
                <p
                  className="text-sm text-foreground/80 truncate"
                  style={{ fontFamily: bengaliFontFamily }}
                >
                  {bnTitle}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={toggleDistractionFree}
                  className="p-2 rounded-sm hover:bg-secondary transition-colors"
                  aria-label="Toggle distraction-free mode"
                  title="Distraction-free mode"
                >
                  <Eye size={18} className="text-foreground/60" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-sm hover:bg-secondary transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun size={18} className="text-foreground/60" />
                  ) : (
                    <Moon size={18} className="text-foreground/60" />
                  )}
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
          </motion.header>
        )}
      </AnimatePresence>

      {/* Distraction-free floating exit button */}
      <AnimatePresence>
        {isDistracted && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            onClick={toggleDistractionFree}
            className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/10 text-foreground/40 hover:text-foreground/70 hover:bg-foreground/15 transition-all group"
            aria-label="Exit distraction-free mode"
            title="Exit distraction-free mode (Esc)"
          >
            <EyeOff size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && !isDistracted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sticky top-[57px] z-30 bg-card border-b border-border/60 shadow-md"
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h4
                  className="text-sm font-medium text-foreground/70 tracking-wider uppercase"
                  style={{ fontFamily: englishFontFamily, letterSpacing: "0.1em" }}
                >
                  Reading Settings
                </h4>
                <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-secondary rounded-sm">
                  <X size={16} className="text-foreground/50" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Language mode */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Languages size={14} />
                    <span style={{ fontFamily: englishFontFamily }}>Language Display</span>
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
                        style={{
                          fontFamily: mode === "bengali" ? bengaliFontFamily : englishFontFamily,
                        }}
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
                    <span style={{ fontFamily: englishFontFamily }}>Text Size</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFontSize(settings.fontSize - 0.05)}
                      className="px-2.5 py-1 text-sm border border-border rounded-sm hover:bg-secondary"
                      style={{ fontFamily: englishFontFamily }}
                    >
                      A-
                    </button>
                    <span
                      className="text-xs text-muted-foreground w-12 text-center"
                      style={{ fontFamily: englishFontFamily }}
                    >
                      {Math.round(settings.fontSize * 100)}%
                    </span>
                    <button
                      onClick={() => setFontSize(settings.fontSize + 0.05)}
                      className="px-2.5 py-1 text-sm border border-border rounded-sm hover:bg-secondary"
                      style={{ fontFamily: englishFontFamily }}
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* English Font Picker */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <BookOpen size={14} />
                    <span style={{ fontFamily: englishFontFamily }}>English Font</span>
                  </label>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {ENGLISH_FONTS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setEnglishFont(font.id)}
                        className={`w-full text-left px-3 py-2 rounded-sm border transition-all ${
                          settings.englishFontId === font.id
                            ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20"
                            : "bg-transparent border-border/40 hover:border-primary/30 hover:bg-secondary/50"
                        }`}
                      >
                        <span
                          className="text-xs text-muted-foreground block mb-0.5"
                          style={{ fontFamily: "system-ui" }}
                        >
                          {font.label}
                        </span>
                        <span
                          className="text-sm text-foreground/80 block"
                          style={{ fontFamily: font.family }}
                        >
                          {font.sampleText}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bengali Font Picker */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <BookOpen size={14} />
                    <span style={{ fontFamily: englishFontFamily }}>Bengali Font</span>
                  </label>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {BENGALI_FONTS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setBengaliFont(font.id)}
                        className={`w-full text-left px-3 py-2 rounded-sm border transition-all ${
                          settings.bengaliFontId === font.id
                            ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20"
                            : "bg-transparent border-border/40 hover:border-primary/30 hover:bg-secondary/50"
                        }`}
                      >
                        <span
                          className="text-xs text-muted-foreground block mb-0.5"
                          style={{ fontFamily: "system-ui" }}
                        >
                          {font.label}
                        </span>
                        <span
                          className="text-sm text-foreground/80 block"
                          style={{ fontFamily: font.family }}
                        >
                          {font.sampleText}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Artwork — hidden in distraction-free mode */}
      <AnimatePresence>
        {!isDistracted && (
          <motion.section
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
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
                    style={{ fontFamily: englishFontFamily, letterSpacing: "0.15em" }}
                  >
                    <Palette size={12} className="inline mr-1.5 -mt-0.5" />
                    {chapter.artStyle}
                  </p>
                  <p
                    className="text-white/80 text-sm italic"
                    style={{ fontFamily: englishFontFamily }}
                  >
                    "{chapter.artTitle}"
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Chapter Title */}
      <section
        className={`max-w-3xl mx-auto px-6 text-center ${
          isDistracted ? "pt-16 pb-8" : "pt-10 pb-6"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!isDistracted && (
            <p
              className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: englishFontFamily }}
            >
              Chapter {chapter.number}
            </p>
          )}
          <h1
            className="text-3xl sm:text-4xl text-foreground/90 mb-2"
            style={{ fontFamily: bengaliFontFamily, fontWeight: 500 }}
          >
            {bnTitle}
          </h1>
          <h2
            className="text-xl sm:text-2xl text-foreground/60 italic font-light"
            style={{ fontFamily: englishFontFamily }}
          >
            {enTitle}
          </h2>
        </motion.div>
      </section>

      {/* Ornament divider — hidden in distraction-free mode */}
      {!isDistracted && (
        <div className="flex justify-center pb-8">
          <img src={ORNAMENT_URL} alt="" className="h-5 opacity-30 dark:opacity-20" />
        </div>
      )}

      {/* Chapter Content */}
      <article
        className={`max-w-3xl mx-auto px-6 pb-16 ${isDistracted ? "" : "manuscript-page"}`}
      >
        <div style={{ fontSize: `${settings.fontSize}rem` }}>
          {chapter.paragraphs.map((para, i) => (
            <ParagraphBlock
              key={i}
              bn={para.bn}
              en={para.en}
              isVerse={para.isVerse}
              languageMode={settings.languageMode}
              index={i}
              englishFontFamily={englishFontFamily}
              bengaliFontFamily={bengaliFontFamily}
              distractionFree={isDistracted}
            />
          ))}
        </div>
      </article>

      {/* Chapter Navigation — hidden in distraction-free mode */}
      {!isDistracted && (
        <nav className="border-t border-border/40 bg-card/50">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="flex justify-center mb-8">
              <img src={ORNAMENT_URL} alt="" className="h-4 opacity-25 dark:opacity-15" />
            </div>

            <div className="flex items-stretch gap-4">
              {prevChapter ? (
                <Link href={`/chapter/${prevChapter}`}>
                  <span className="flex-1 group flex items-center gap-3 px-5 py-4 border border-border/60 rounded-sm hover:border-primary/30 hover:bg-secondary/50 transition-all cursor-pointer">
                    <ChevronLeft
                      size={18}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                    <div>
                      <p
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: englishFontFamily }}
                      >
                        Previous
                      </p>
                      <p
                        className="text-sm text-foreground/80"
                        style={{ fontFamily: bengaliFontFamily }}
                      >
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
                      <p
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: englishFontFamily }}
                      >
                        Next
                      </p>
                      <p
                        className="text-sm text-foreground/80"
                        style={{ fontFamily: bengaliFontFamily }}
                      >
                        {data.chapters[nextChapter - 1].title.split(" — ")[0]}
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </span>
                </Link>
              ) : (
                <Link href="/">
                  <span className="flex-1 group flex items-center justify-end gap-3 px-5 py-4 border border-border/60 rounded-sm hover:border-primary/30 hover:bg-secondary/50 transition-all cursor-pointer text-right">
                    <div>
                      <p
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: englishFontFamily }}
                      >
                        Return to
                      </p>
                      <p
                        className="text-sm text-foreground/80"
                        style={{ fontFamily: englishFontFamily }}
                      >
                        Table of Contents
                      </p>
                    </div>
                    <Home
                      size={18}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Distraction-free: minimal bottom nav */}
      {isDistracted && (
        <div className="max-w-3xl mx-auto px-6 pb-12">
          <div className="flex items-center justify-between pt-8 border-t border-border/20">
            {prevChapter ? (
              <Link href={`/chapter/${prevChapter}`}>
                <span className="flex items-center gap-2 text-foreground/40 hover:text-foreground/70 transition-colors text-sm">
                  <ChevronLeft size={16} />
                  <span style={{ fontFamily: bengaliFontFamily }}>
                    {data.chapters[prevChapter - 1].title.split(" — ")[0]}
                  </span>
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextChapter ? (
              <Link href={`/chapter/${nextChapter}`}>
                <span className="flex items-center gap-2 text-foreground/40 hover:text-foreground/70 transition-colors text-sm">
                  <span style={{ fontFamily: bengaliFontFamily }}>
                    {data.chapters[nextChapter - 1].title.split(" — ")[0]}
                  </span>
                  <ChevronRight size={16} />
                </span>
              </Link>
            ) : (
              <Link href="/">
                <span className="flex items-center gap-2 text-foreground/40 hover:text-foreground/70 transition-colors text-sm">
                  <span style={{ fontFamily: englishFontFamily }}>Contents</span>
                  <Home size={16} />
                </span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`fixed z-50 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow ${
              isDistracted
                ? "bottom-6 left-6 bg-foreground/10 text-foreground/40 hover:text-foreground/70"
                : "bottom-6 right-6 bg-primary text-primary-foreground"
            }`}
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
  englishFontFamily: string;
  bengaliFontFamily: string;
  distractionFree: boolean;
}

function ParagraphBlock({
  bn,
  en,
  isVerse,
  languageMode,
  index,
  englishFontFamily,
  bengaliFontFamily,
  distractionFree,
}: ParagraphBlockProps) {
  const showBn = languageMode === "both" || languageMode === "bengali";
  const showEn = languageMode === "both" || languageMode === "english";

  if (isVerse) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        data-para-index={index}
        className={`my-8 py-6 px-6 sm:px-10 border-l-2 border-r-2 rounded-sm ${
          distractionFree ? "bg-transparent border-foreground/10" : "bg-secondary/30"
        }`}
        style={{ borderColor: distractionFree ? undefined : "var(--color-sienna)" }}
      >
        {showBn && (
          <div
            className="whitespace-pre-line text-foreground/85 mb-4"
            style={{ fontFamily: bengaliFontFamily, lineHeight: 2.2 }}
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
            className="whitespace-pre-line text-foreground/70 italic"
            style={{ fontFamily: englishFontFamily, lineHeight: 2, fontWeight: 400 }}
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
      data-para-index={index}
    >
      {showBn && (
        <p
          className="text-foreground/85 mb-2"
          style={{ fontFamily: bengaliFontFamily, lineHeight: 2 }}
        >
          {bn}
        </p>
      )}
      {showBn && showEn && <div className="w-8 h-px bg-border/60 my-2.5 ml-0" />}
      {showEn && (
        <p
          className="text-foreground/60"
          style={{ fontFamily: englishFontFamily, lineHeight: 1.9, fontWeight: 400 }}
        >
          {en}
        </p>
      )}
    </motion.div>
  );
}
