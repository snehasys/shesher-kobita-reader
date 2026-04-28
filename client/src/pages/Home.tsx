/*
 * DESIGN: Bengal Renaissance Manuscript
 * Home page — Hero with Bengali poem overlay, chapter grid as illuminated table of contents
 * Warm parchment tones, Cormorant Garamond + Noto Serif Bengali
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Feather, Moon, Sun, BookMarked, X } from "lucide-react";
import { useState, useEffect } from "react";
import bookData from "@/data/bookData.json";
import editionData from "@/data/edition.json";
import type { BookData } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeContext";
import { getStoredProgress, formatTimeAgo, clearProgress, type ReadingProgress } from "@/hooks/useReadingProgress";

const data = bookData as BookData;

const HERO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663420633053/X4wwoxG22xEKUUULkLPCMc/hero-banner-v2-7pCAB9kzCtGx3xVaDU3And.webp";

const ORNAMENT_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663420633053/X4wwoxG22xEKUUULkLPCMc/ornament-divider-7z9LeV7WuEv8jmtpjyjwF2.png";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = getStoredProgress();
    if (stored && stored.scrollPercent > 0) {
      setProgress(stored);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    clearProgress();
  };

  const showResume = progress && !dismissed;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "60vh" }}>
        <img
          src={HERO_URL}
          alt="Shillong hills watercolor"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col justify-center px-6 sm:px-12 lg:px-20 h-full" style={{ minHeight: "60vh" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Rabindranath Tagore
            </p>
            <h1
              className="text-white text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-3"
              style={{ fontFamily: "var(--font-bengali)" }}
            >
              শেষের কবিতা
            </h1>

            {/* Bengali poem overlay */}
            <div className="border-l-2 border-white/30 pl-6 mt-6 mb-8">
              <p
                className="text-white/70 text-base sm:text-lg leading-relaxed mb-2"
                style={{ fontFamily: "var(--font-bengali)", lineHeight: 2 }}
              >
                পথ বেঁধে দিলো বন্ধনহীন গ্রন্থি,
              </p>
              <p
                className="text-white/70 text-base sm:text-lg leading-relaxed mb-2"
                style={{ fontFamily: "var(--font-bengali)", lineHeight: 2 }}
              >
                ছিন্ন করো যদি, আরো বাঁধে সন্ধি।
              </p>

            </div>

            <Link href="/chapter/1">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 backdrop-blur-sm border border-white/25 text-white rounded-sm hover:bg-white/20 transition-all text-base"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <BookOpen size={18} />
                Begin Reading
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Edition Colophon / Watermark */}
      <section className="max-w-3xl mx-auto px-6 pt-10 pb-2">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="relative border border-border/40 rounded-sm bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          {/* Decorative corner flourishes */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-sienna/30 rounded-tl-sm" style={{ borderColor: 'var(--color-sienna)' }} />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-sienna/30 rounded-tr-sm" style={{ borderColor: 'var(--color-sienna)' }} />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-sienna/30 rounded-bl-sm" style={{ borderColor: 'var(--color-sienna)' }} />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-sienna/30 rounded-br-sm" style={{ borderColor: 'var(--color-sienna)' }} />

          <div className="px-8 py-8 sm:px-12 sm:py-10 text-center">
            {/* Edition title */}
            <p
              className="text-xs tracking-[0.35em] uppercase text-muted-foreground/60 mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Colophon
            </p>

            <h2
              className="text-xl sm:text-2xl text-foreground/80 font-light mb-1"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {editionData.edition}
            </h2>

            <p
              className="text-sm text-muted-foreground/70 mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {editionData.date} &middot; v{editionData.version}
            </p>

            {/* Ornamental rule */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-border/60" />
              <Feather size={14} className="text-muted-foreground/40" />
              <div className="h-px w-16 bg-border/60" />
            </div>

            {/* Colophon text */}
            <p
              className="text-sm text-foreground/60 leading-relaxed max-w-xl mx-auto mb-6 italic"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {editionData.colophon}
            </p>

            {/* Edition details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 max-w-lg mx-auto text-left">
              <div>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground/50" style={{ fontFamily: 'var(--font-serif)' }}>Source</p>
                <p className="text-xs text-foreground/60 mt-0.5" style={{ fontFamily: 'var(--font-serif)' }}>Visva-Bharati, 1929</p>
              </div>
              <div>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground/50" style={{ fontFamily: 'var(--font-serif)' }}>Chapters</p>
                <p className="text-xs text-foreground/60 mt-0.5" style={{ fontFamily: 'var(--font-serif)' }}>{editionData.chapters} chapters, {editionData.paragraphs} passages</p>
              </div>
              <div>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground/50" style={{ fontFamily: 'var(--font-serif)' }}>Translation</p>
                <p className="text-xs text-foreground/60 mt-0.5" style={{ fontFamily: 'var(--font-serif)' }}>Oscar Wilde literary style</p>
              </div>
              <div>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground/50" style={{ fontFamily: 'var(--font-serif)' }}>Languages</p>
                <p className="text-xs text-foreground/60 mt-0.5" style={{ fontFamily: 'var(--font-serif)' }}>Bengali &amp; English</p>
              </div>
              <div>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground/50" style={{ fontFamily: 'var(--font-serif)' }}>Verification</p>
                <p className="text-xs text-foreground/60 mt-0.5" style={{ fontFamily: 'var(--font-serif)' }}>PDF page-by-page</p>
              </div>
              <div>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground/50" style={{ fontFamily: 'var(--font-serif)' }}>Build</p>
                <p className="text-xs text-foreground/60 mt-0.5 font-mono" style={{ fontSize: '0.7rem' }}>{editionData.buildId}</p>
              </div>
            </div>

            {/* License note */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <p
                className="text-[0.65rem] text-muted-foreground/40 leading-relaxed max-w-md mx-auto"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {editionData.license}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Resume Reading Banner */}
      {showResume && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="max-w-3xl mx-auto px-6 pt-6"
        >
          <div className="relative flex items-center gap-4 px-5 py-4 bg-card border border-border/60 rounded-sm shadow-sm">
            <BookMarked size={22} className="text-primary/70 shrink-0" />
            <div className="flex-1 min-w-0">
              <p
                className="text-sm text-foreground/80"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Continue reading{" "}
                <span style={{ fontFamily: "var(--font-bengali)", fontWeight: 500 }}>
                  {progress.chapterTitle.split(" — ")[0]}
                </span>
              </p>
              <p
                className="text-xs text-muted-foreground mt-0.5"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Chapter {progress.chapterNumber} &middot; {progress.scrollPercent}% read &middot; {formatTimeAgo(progress.timestamp)}
              </p>
            </div>
            <Link href={`/chapter/${progress.chapterNumber}`}>
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-sm hover:opacity-90 transition-opacity"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Resume
              </motion.span>
            </Link>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-sm hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Ornament divider */}
      <div className="flex justify-center py-6">
        <img src={ORNAMENT_URL} alt="" className="h-6 opacity-40 dark:opacity-25" />
      </div>

      {/* About section */}
      <section className="max-w-3xl mx-auto px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Feather className="mx-auto mb-4 text-sienna opacity-50" size={24} style={{ color: "var(--color-sienna)" }} />
          <p
            className="text-foreground/70 text-lg leading-relaxed italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Written in 1929, <em>Shesher Kobita</em> is Rabindranath Tagore's only mature novel of romantic love
            — a luminous, bittersweet meditation on passion, intellect, and the art of letting go.
            Set amidst the pine-clad hills of Shillong, it traces the tempestuous affair between
            the brilliant, mercurial Amit and the quietly formidable Labanya.
          </p>
        </motion.div>
      </section>

      {/* Ornament divider */}
      <div className="flex justify-center pb-6">
        <img src={ORNAMENT_URL} alt="" className="h-5 opacity-30 dark:opacity-20" />
      </div>

      {/* Chapter Table of Contents */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h3
          className="text-center text-2xl text-foreground/80 mb-2 font-light"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Table of Contents
        </h3>
        <p
          className="text-center text-sm text-muted-foreground mb-10 tracking-wider uppercase"
          style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.2em" }}
        >
          সূচিপত্র
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.chapters.map((ch, i) => {
            const [bnTitle, enTitle] = ch.title.split(" — ");
            return (
              <motion.div
                key={ch.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              >
                <Link href={`/chapter/${ch.number}`}>
                  <div className="group relative overflow-hidden rounded-sm border border-border/60 bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer">
                    {/* Chapter image thumbnail */}
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={ch.imageUrl}
                        alt={ch.artTitle}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span
                        className="absolute bottom-3 left-4 text-white/60 text-xs tracking-wider"
                        style={{ fontFamily: "var(--font-serif)", fontSize: "0.7rem" }}
                      >
                        {ch.artStyle}
                      </span>
                    </div>

                    {/* Chapter info */}
                    <div className="p-4">
                      <div className="flex items-baseline gap-3 mb-1.5">
                        <span
                          className="text-xs text-muted-foreground tracking-widest uppercase"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {ch.number < 10 ? `0${ch.number}` : ch.number}
                        </span>
                        <span
                          className="text-base text-foreground/90 font-medium"
                          style={{ fontFamily: "var(--font-bengali)" }}
                        >
                          {bnTitle}
                        </span>
                      </div>
                      <p
                        className="text-sm text-foreground/60 italic"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {enTitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-muted-foreground text-sm"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            A bilingual reading of <em>Shesher Kobita</em> by Rabindranath Tagore
          </p>
          <p
            className="text-muted-foreground/60 text-xs mt-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            English translation crafted in the spirit of the Romantic tradition
          </p>
        </div>
      </footer>
    </div>
  );
}
