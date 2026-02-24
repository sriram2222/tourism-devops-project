'use client';
import { useState, useRef, useEffect } from "react";

export default function SearchSection() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function go() {
    window.location.href = region === "palani" ? "/palani" : "/pollachi";
  }

  return (
    <div className="bg-[#1a2e1a] dark:bg-[#0d1a0d] py-16 px-[5%]">

      <h2 className="font-serif text-2xl md:text-3xl font-bold text-white text-center mb-8">
        Find Your Next Destination
      </h2>

      <div className="max-w-3xl mx-auto flex gap-3 flex-nowrap justify-center items-center">

        {/* SEARCH INPUT + DROPDOWN */}
        <div className="relative w-[280px] flex-shrink-0" ref={dropdownRef}>

          {/* SEARCH ICON - fixed on left, cursor starts after it */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-gray-400 text-sm">
            🔍
          </span>

          <input
            className="w-full pl-10 pr-5 py-3.5 rounded-full border border-white/20 bg-white text-black placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all text-sm"
            placeholder="Search places…"
            value={search}
            onChange={async (e) => {
              const value = e.target.value;
              setSearch(value);

              if (value.length > 1) {
                try {
                  const res = await fetch(`http://127.0.0.1:5000/api/places?search=${value}`);
                  const data = await res.json();
                  setResults(data);
                } catch (err) {
                  console.log(err);
                }
              } else {
                setResults([]);
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && go()}
          />

          {/* DROPDOWN */}
          {results.length > 0 && (
            <div className="absolute left-0 top-14 w-full bg-white text-black rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
              {results.map((place) => (
                <div
                  key={place.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    window.location.href = `/place/${place.slug}`;
                    setResults([]);
                  }}
                >
                  {place.name}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* CATEGORY */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="flex-shrink-0 px-4 py-3.5 rounded-full border border-white/20 bg-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
        >
          <option value="">All Categories</option>
          <option value="nature">Nature</option>
          <option value="temple">Temple</option>
          <option value="waterfall">Waterfall</option>
          <option value="viewpoint">Viewpoint</option>
          <option value="market">Market</option>
        </select>

        {/* REGION */}
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="flex-shrink-0 px-4 py-3.5 rounded-full border border-white/20 bg-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
        >
          <option value="">All Regions</option>
          <option value="pollachi">Pollachi</option>
          <option value="palani">Palani</option>
        </select>

        {/* BUTTON */}
        <button
          onClick={go}
          className="flex-shrink-0 px-6 py-3.5 bg-[#c9922a] hover:bg-[#e8b84b] text-white font-semibold rounded-full transition-all text-sm"
        >
          Search
        </button>

      </div>
    </div>
  );
}
