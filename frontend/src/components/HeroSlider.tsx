'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SLIDES = [
  {
    image: "/images/hero/palani-hero1.jpg",
    tag: "🕌 Palani Temple",
    title: "Sacred",
    titleEm: "Palani",
    titleEnd: "Temple",
    sub: "Famous Murugan temple in Tamil Nadu.",
    cta1: { label: "Explore Palani", href: "/palani" },
    cta2: { label: "View Gallery", href: "/gallery" },
  },
  
  {
    image: "/images/hero/pollachi-hero1.jpg",
    tag: "🌄 Pollachi",
    title: "Discover",
    titleEm: "Pollachi",
    titleEnd: "Beauty",
    sub: "Nature's paradise in the heart of Tamil Nadu.",
    cta1: { label: "Explore Pollachi", href: "/pollachi" },
    cta2: { label: "View Gallery", href: "/gallery" },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const DURATION = 4000; // 4 seconds per slide

  // Auto advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
      setProgress(0);
    }, DURATION);
    return () => clearInterval(interval);
  }, [current]);

  // Progress bar animation
  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const frame = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
      if (elapsed < DURATION) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [current]);

  function goTo(index: number) {
    setCurrent(index);
    setProgress(0);
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

      {/* BACKGROUND IMAGES */}
      <AnimatePresence>
        <motion.img
          key={current}
          src={SLIDES[current].image}
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/75 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />

      {/* TEXT CONTENT */}
      <div className="relative z-20 h-full flex items-end pb-28 md:pb-36 px-[5%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* TAG */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-sm text-amber-300 text-xs font-bold tracking-[0.2em] uppercase mb-5"
            >
              {SLIDES[current].tag}
            </motion.div>

            {/* TITLE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-4"
            >
              {SLIDES[current].title}{" "}
              <em className="text-amber-400 not-italic">{SLIDES[current].titleEm}</em>{" "}
              {SLIDES[current].titleEnd}
            </motion.h1>

            {/* SUBTITLE */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white/70 text-lg md:text-xl font-light leading-relaxed mb-8 max-w-xl"
            >
              {SLIDES[current].sub}
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex gap-4 flex-wrap"
            >
              <Link
                href={SLIDES[current].cta1.href}
                className="px-8 py-3.5 bg-[#c9922a] hover:bg-[#e8b84b] text-white font-semibold rounded-full transition-all hover:scale-105 text-sm"
              >
                {SLIDES[current].cta1.label}
              </Link>
              <Link
                href={SLIDES[current].cta2.href}
                className="px-8 py-3.5 border-2 border-white/40 hover:border-white/70 text-white font-semibold rounded-full transition-all text-sm hover:bg-white/10"
              >
                {SLIDES[current].cta2.label}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-2.5 bg-amber-400"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-8 right-[5%] z-20 flex flex-col items-center gap-2">
        <div className="w-5 h-9 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-2 bg-white/70 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </div>
        <span className="text-white/40 text-[10px] tracking-widest uppercase">Scroll</span>
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] z-20 bg-white/10">
        <div
          className="h-full bg-amber-400 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

    </section>
  );
}
