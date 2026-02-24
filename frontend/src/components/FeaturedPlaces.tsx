'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PlaceCard from "./PlaceCard";
import { placesApi } from "@/lib/api";
import { Place } from "@/types";

const FILTERS = ["All","Nature","Temple","Waterfall","Viewpoint"];

export default function FeaturedPlaces() {
  const [places, setPlaces]         = useState<Place[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setFilter]   = useState("All");

  useEffect(() => {
    placesApi.getAll({ featured: "true" })
      .then(r => setPlaces(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All"
    ? places
    : places.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="px-[5%] py-24">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <p className="text-xs font-bold tracking-[0.25em] text-green-700 dark:text-green-400 uppercase mb-3">Featured</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Top Attractions</h2>
        </motion.div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all
                ${activeFilter===f ? "bg-[#1a2e1a] text-white border-transparent dark:bg-green-700" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((place, idx) => <PlaceCard key={place.id} place={place} index={idx} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🌿</div>
          <p className="font-medium">No featured places yet.</p>
          <p className="text-sm mt-2">Add places via <Link href="/admin/dashboard" className="text-green-600 underline">Admin Panel</Link> and mark as Featured.</p>
        </div>
      )}
      {places.length > 0 && (
        <div className="text-center mt-12 flex gap-4 justify-center flex-wrap">
          <Link href="/pollachi" className="px-8 py-3.5 border-2 border-[#1a2e1a] dark:border-green-600 text-[#1a2e1a] dark:text-green-400 font-semibold rounded-full hover:bg-[#1a2e1a] hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-all">All Pollachi Places</Link>
          <Link href="/palani"   className="px-8 py-3.5 border-2 border-amber-600 text-amber-600 font-semibold rounded-full hover:bg-amber-600 hover:text-white transition-all">All Palani Places</Link>
        </div>
      )}
    </section>
  );
}
