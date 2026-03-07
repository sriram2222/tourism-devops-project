'use client';
import { useState, useRef, useEffect } from "react";

export default function SearchSection() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResults([]);
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function go() {
    if (search.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(search)}`;
    } else {
      window.location.href = "/pollachi";
    }
  }

  return (
    <div className="relative bg-[#0f1f0f] py-20 px-[5%]">

      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

      <div className="relative max-w-2xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-amber-400/80 mb-3 bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full">
            Explore PP Explorer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">
            Find Your Next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Destination
            </span>
          </h2>
          <p className="text-white/40 text-sm mt-3">
            Discover nature, temples, waterfalls & more across Pollachi & Palani
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-3 shadow-2xl" ref={dropdownRef}>
          <div className="flex gap-2">

            {/* Input */}
            <div className="relative flex-1 min-w-0">
              <div className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 transition-all duration-200 ${focused ? "ring-2 ring-amber-400 shadow-lg shadow-amber-400/10" : "ring-1 ring-transparent"}`}>
                {loading
                  ? <span className="text-gray-400 text-sm shrink-0 animate-pulse">⟳</span>
                  : <span className="text-gray-400 text-sm shrink-0">🔍</span>
                }
                <input
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-medium min-w-0"
                  placeholder="Search places, temples, waterfalls..."
                  value={search}
                  onFocus={() => setFocused(true)}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setSearch(value);
                    if (value.length > 1) {
                      setLoading(true);
                      try {
                        const res = await fetch(`http://127.0.0.1:5000/api/places?search=${value}`);
                        const data = await res.json();
                        setResults(data);
                      } catch { setResults([]); }
                      finally { setLoading(false); }
                    } else {
                      setResults([]);
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && go()}
                />
                {search && (
                  <button onClick={() => { setSearch(""); setResults([]); }}
                    className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none shrink-0">×</button>
                )}
              </div>

              {/* Dropdown */}
              {results.length > 0 && (
                <div className="absolute left-0 top-[calc(100%+8px)] w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[999]">
                  <div className="px-4 py-2 border-b border-gray-50 bg-gray-50/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {results.length} result{results.length > 1 ? "s" : ""} found
                    </span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {results.map((place) => (
                      <div key={place.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors group"
                        onClick={() => { window.location.href = `/place/${place.slug}`; setResults([]); setSearch(""); }}>
                        <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-base shrink-0">
                          {place.category === "temple" ? "🕌"
                            : place.category === "waterfall" ? "💧"
                            : place.category === "viewpoint" ? "🏔️"
                            : place.category === "dam" ? "🌊"
                            : "🌿"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">{place.name}</p>
                          {place.region_name && (
                            <p className="text-xs text-gray-400 capitalize mt-0.5">{place.region_name}</p>
                          )}
                        </div>
                        <span className="text-gray-300 group-hover:text-green-500 transition-colors text-sm shrink-0">→</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search button */}
            <button onClick={go}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#c9922a] to-[#e8b84b] hover:from-[#b8821f] hover:to-[#d4a43a] text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 hover:scale-[1.02] active:scale-[0.98] text-sm whitespace-nowrap">
              Search →
            </button>

          </div>
        </div>

        {/* Simple region links */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="text-white/25 text-xs">Browse by region:</span>
          <button onClick={() => window.location.href = "/pollachi"}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 px-4 py-2 rounded-full transition-all font-medium">
            🌿 Pollachi
          </button>
          <button onClick={() => window.location.href = "/palani"}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 px-4 py-2 rounded-full transition-all font-medium">
            🕌 Palani
          </button>
        </div>

      </div>
    </div>
  );
}
