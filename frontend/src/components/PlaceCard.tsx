'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Place } from "@/types";
import { getImageUrl, CATEGORY_COLORS, CATEGORY_GRADIENTS } from "@/lib/utils";

export default function PlaceCard({ place, index = 0 }: { place: Place; index?: number }) {
const imgSrc   = place.primary_image ? getImageUrl(place.primary_image) : null;
const isPalaniTemple = place.slug === "thiru-avinankudi-temple";
const catColor = CATEGORY_COLORS[place.category]    || "bg-gray-600 text-white";
const catGrad  = CATEGORY_GRADIENTS[place.category] || "from-gray-900 to-gray-700";

return (
<motion.div
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.4) }}
whileHover={{ y: -10 }}
className="group h-full"
>
<Link
href={`/place/${place.slug}`}
className="place-glow flex flex-col h-full bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden
shadow-md transition-all duration-500
border border-gray-100 dark:border-gray-800 hover:border-amber-300/40"
>

    {/* IMAGE */}
    <div className="relative h-56 overflow-hidden shrink-0">
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={place.name}
          fill
          className={`object-cover ${isPalaniTemple ? "object-top" : "object-center"}
          group-hover:scale-110 transition-transform duration-700`}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${catGrad} flex items-center justify-center`}>
          <span className="text-5xl opacity-30">
            {place.category==="temple"?"🕌":place.category==="waterfall"?"💧":place.category==="nature"?"🌿":"📍"}
          </span>
        </div>
      )}

      {/* dark hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

      {/* category */}
      <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold capitalize shadow-md ${catColor}`}>
        {place.category}
      </span>

      {/* featured */}
      {place.is_featured && (
        <span className="absolute top-3 right-3 px-3 py-1 bg-amber-400 text-black rounded-full text-xs font-bold shadow">
          ⭐ Featured
        </span>
      )}
    </div>

    {/* CONTENT */}
    <div className="flex flex-col flex-1 p-5">
      <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2 
      group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
        {place.name}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 flex-1 leading-relaxed mb-4">
        {place.short_description}
      </p>

      {/* details */}
      <div className="space-y-1.5">
        {place.distance_from_city && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            📍 <span className="truncate">{place.distance_from_city}</span>
          </div>
        )}
        {place.timings && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            🕐 <span className="truncate">{place.timings}</span>
          </div>
        )}
        {place.entry_fee && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            🎫 <span>{place.entry_fee}</span>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
          {place.region_name}
        </span>

        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:gap-2 transition-all">
          Explore →
        </span>
      </div>
    </div>
  </Link>
</motion.div>


);
}
