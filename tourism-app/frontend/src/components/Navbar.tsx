'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/pollachi", label: "Pollachi" },
  { href: "/palani", label: "Palani" },
  { href: "/stay-dine", label: "Stay & Dine" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setDropdownOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  const firstName = user?.name?.split(" ")[0] || user?.name || "User";
  const transparentPages = ["/", "/login", "/signup", "/pollachi", "/palani", "/admin/login", "/forgot-password", "/reset-password"];
  const isPlacePage = pathname.startsWith("/place/");
  const isTransparentPage = transparentPages.includes(pathname) || isPlacePage;
  const isTransparent = isTransparentPage && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] h-[72px] flex items-center justify-between px-[5%] transition-all duration-500
      ${!isTransparent
        ? "bg-white/70 dark:bg-[#0b0f0c]/80 backdrop-blur-xl shadow-xl dark:shadow-black/40 border-b border-white/20 dark:border-white/10"
        : "bg-transparent"}`}>

      {/* LOGO */}
      <Link href="/" className="flex flex-col leading-tight">
        <div className={`font-serif font-extrabold text-3xl md:text-4xl tracking-wide flex items-center gap-1 transition-colors
          ${isTransparent ? "text-white" : "text-[#1a2e1a] dark:text-white"}`}>
          🌿
          <span className="text-green-700">PP</span>
          <span className={isTransparent ? "text-amber-300 ml-1" : "text-[#c9922a] ml-1"}>
            Explorer
          </span>
        </div>
        <span className="text-[11px] tracking-widest text-gray-400 ml-8">
          பொள்ளாச்சி பழனி
        </span>
      </Link>

      {/* Desktop menu */}
      <ul className="hidden md:flex items-center gap-7 list-none">
        {LINKS.map(l => (
          <li key={l.href}>
            <Link href={l.href} className={`text-sm font-semibold transition-colors relative
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

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110 text-base
              ${isTransparent ? "border-white/30 bg-white/10 text-white hover:bg-white/20" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>
            {resolvedTheme === "dark" ? "☀️" : "🌙"}
          </button>
        )}

        {/* USER — Desktop */}
        {mounted && user ? (
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg
                ${isTransparent
                  ? "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                  : "bg-gradient-to-r from-green-700 to-green-500 text-white hover:from-green-800 hover:to-green-600"}`}>
              👤 {firstName}
              <span className={`text-xs transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-400">Logged in as</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{firstName}</p>
                </div>
                <Link href="/my-booking" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                  📋 My Bookings
                </Link>
                <Link href="/profile" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                  ⚙️ Profile
                </Link>
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          mounted && (
            <Link href="/login"
              className="hidden sm:block px-5 py-2 bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 text-white text-sm font-semibold rounded-full shadow-lg transition-all">
              Login
            </Link>
          )
        )}

        {/* Admin — Desktop */}
        <Link href="/admin/login"
          className="hidden sm:block px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white text-sm font-semibold rounded-full shadow-lg transition-all">
          Admin
        </Link>

        {/* Hamburger */}
        <button
          className={`md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 ${isTransparent ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
          onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* ✅ Mobile menu — FIXED with Login/User/Admin */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg md:hidden border-t border-gray-100 dark:border-gray-800">

          {/* Nav links */}
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className={`block px-6 py-4 text-sm font-medium border-b border-gray-50 dark:border-gray-800
                ${pathname === l.href ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
              {l.label}
            </Link>
          ))}

          {/* ✅ User section in mobile */}
          {mounted && user ? (
            <>
              <div className="px-6 py-3 bg-green-50 dark:bg-green-900/20 border-b border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400">Logged in as</p>
                <p className="text-sm font-bold text-green-700 dark:text-green-400">👤 {user.name}</p>
              </div>
              <Link href="/my-booking" onClick={() => setMenuOpen(false)}
                className="block px-6 py-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50">
                📋 My Bookings
              </Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)}
                className="block px-6 py-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50">
                ⚙️ Profile
              </Link>
              <button onClick={handleLogout}
                className="w-full text-left px-6 py-4 text-sm text-red-600 hover:bg-red-50 border-b border-gray-50">
                🚪 Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-sm font-semibold text-green-700 hover:bg-green-50 border-b border-gray-50">
              🔐 Login
            </Link>
          )}

          {/* Admin */}
          <Link href="/admin/login" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-sm font-semibold text-amber-600 hover:bg-amber-50">
            🔧 Admin Panel
          </Link>
        </div>
      )}
    </nav>
  );
}