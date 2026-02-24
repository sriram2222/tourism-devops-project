'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/pollachi", label: "Pollachi" },
  { href: "/palani", label: "Palani" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] h-[70px] flex items-center justify-between px-[5%] transition-all duration-300
      ${!isTransparent ? "bg-[var(--cream)]/95 dark:bg-[#0d1a0d]/95 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800" : ""}`}>

      {/* 🔥 LOGO */}
      <Link href="/" className="flex flex-col leading-tight">
        
        {/* MAIN LOGO */}
        <div className={`font-serif font-extrabold text-2xl md:text-3xl flex items-center gap-1 transition-colors
          ${isTransparent ? "text-white" : "text-[#1a2e1a] dark:text-white"}`}>
          🌿 
          <span className="text-green-700">PP</span>
          <span className={isTransparent ? "text-amber-300 ml-1" : "text-[#c9922a] ml-1"}>
            Tourism
          </span>
        </div>

        {/* TAMIL ONLY BELOW */}
        <span className="text-[11px] tracking-widest text-gray-400 ml-7">
          பொள்ளாச்சி பழனி
        </span>

      </Link>

      {/* Desktop menu */}
      <ul className="hidden md:flex items-center gap-6 list-none">
        {LINKS.map(l => (
          <li key={l.href}>
            <Link href={l.href} className={`text-sm font-medium transition-colors relative
              ${pathname === l.href
                ? isTransparent ? "text-amber-300" : "text-green-700 dark:text-green-400"
                : isTransparent ? "text-white/80 hover:text-white" : "text-gray-600 dark:text-gray-300 hover:text-green-700"}`}>
              {l.label}
              {pathname === l.href && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110 text-base
              ${isTransparent ? "border-white/30 bg-white/10 text-white hover:bg-white/20" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>
            {resolvedTheme === "dark" ? "☀️" : "🌙"}
          </button>
        )}

        <Link href="/admin/login"
          className="hidden sm:block px-5 py-2 bg-[#c9922a] hover:bg-[#e8b84b] text-white text-sm font-semibold rounded-full transition-all">
          Admin
        </Link>

        {/* Mobile hamburger */}
        <button className={`md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 ${isTransparent ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
          onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg md:hidden">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800">
              {l.label}
            </Link>
          ))}
          <Link href="/admin/login" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-sm font-semibold text-amber-600">Admin Panel</Link>
        </div>
      )}
    </nav>
  );
}
