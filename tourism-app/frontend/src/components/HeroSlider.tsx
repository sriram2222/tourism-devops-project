'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const SLIDES = [
{
image: "/images/hero/palani-hero2.jpg",
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
const DURATION = 10000;

const particlesInit = useCallback(async (engine: any) => {
await loadFull(engine);
}, []);

useEffect(() => {
const interval = setInterval(() => {
setCurrent((prev) => (prev + 1) % SLIDES.length);
setProgress(0);
}, DURATION);
return () => clearInterval(interval);
}, [current]);

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

return ( <section className="relative h-screen w-full overflow-hidden bg-black">


  {/* ⭐ PARTICLE BACKGROUND */}
  <Particles
    className="absolute inset-0 z-0"
    init={particlesInit}
    options={{
      background: { color: "transparent" },
      fpsLimit: 60,
      particles: {
        number: { value: 60 },
        color: { value: "#f59e0b" },
        links: {
          enable: true,
          color: "#f59e0b",
          distance: 150,
          opacity: 0.3,
        },
        move: { enable: true, speed: 1 },
        opacity: { value: 0.5 },
        size: { value: 2 },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          repulse: { distance: 120 },
        },
      },
    }}
  />

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

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/60 z-10" />

  {/* TEXT */}
  <div className="relative z-20 h-full flex items-end pb-28 md:pb-36 px-[5%]">
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <div className="inline-block px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-widest mb-5 backdrop-blur">
          {SLIDES[current].tag}
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
          {SLIDES[current].title}{" "}
          <span className="text-amber-400">{SLIDES[current].titleEm}</span>{" "}
          {SLIDES[current].titleEnd}
        </h1>

        <p className="text-white/70 text-lg mb-8 max-w-xl">
          {SLIDES[current].sub}
        </p>

        <div className="flex gap-4 flex-wrap">
          <Link
            href={SLIDES[current].cta1.href}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black font-semibold rounded-full shadow-xl transition-all hover:scale-105"
          >
            {SLIDES[current].cta1.label}
          </Link>

          <Link
            href={SLIDES[current].cta2.href}
            className="px-8 py-3 border border-white/40 hover:border-white text-white rounded-full backdrop-blur hover:bg-white/10 transition"
          >
            {SLIDES[current].cta2.label}
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>

  {/* DOTS */}
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
    {SLIDES.map((_, i) => (
      <button
        key={i}
        onClick={() => goTo(i)}
        className={`transition-all rounded-full ${
          i === current ? "w-8 h-2 bg-amber-400" : "w-2 h-2 bg-white/40"
        }`}
      />
    ))}
  </div>

  {/* PROGRESS */}
  <div className="absolute bottom-0 left-0 right-0 h-[3px] z-20 bg-white/10">
    <div className="h-full bg-amber-400" style={{ width: `${progress}%` }} />
  </div>
</section>


);
}
