/*
 * DESIGN: Bengal Renaissance Manuscript
 * Home page — Hero with Bengali poem overlay, chapter grid as illuminated table of contents
 * Warm parchment tones, Cormorant Garamond + Noto Serif Bengali
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Feather, Moon, Sun } from "lucide-react";
import bookData from "@/data/bookData.json";
import type { BookData } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeContext";

const data = bookData as BookData;

const HERO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663420633053/X4wwoxG22xEKUUULkLPCMc/hero-banner-v2-7pCAB9kzCtGx3xVaDU3And.webp";

const ORNAMENT_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663420633053/X4wwoxG22xEKUUULkLPCMc/ornament-divider-7z9LeV7WuEv8jmtpjyjwF2.png";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

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
            <h2
              className="text-white/80 text-2xl sm:text-3xl lg:text-4xl font-light italic mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              The Last Poem
            </h2>

            {/* Bengali poem overlay */}
            <div className="border-l-2 border-white/30 pl-6 mb-8">
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
              <p
                className="text-white/50 text-sm italic mt-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                "The path was bound by a bondless knot, / Sever it, and it binds yet more."
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
