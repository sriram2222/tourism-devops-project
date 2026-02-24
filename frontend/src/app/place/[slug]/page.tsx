'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { placesApi } from "@/lib/api";
import { Place } from "@/types";
import { getImageUrl, CATEGORY_COLORS, CATEGORY_GRADIENTS } from "@/lib/utils";

export default function PlaceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    placesApi.getBySlug(slug)
      .then(r => setPlace(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-[70px]">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!place) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-[70px]">
      <div className="text-6xl">🌿</div>
      <h2 className="font-serif text-2xl font-bold">Place not found</h2>
      <Link href="/" className="px-6 py-3 bg-green-700 text-white rounded-full font-semibold hover:bg-green-600 transition-colors">
        Go Home
      </Link>
    </div>
  );

  const hasImages = place.images && place.images.length > 0;
  const catGrad = CATEGORY_GRADIENTS[place.category] || "from-gray-900 to-gray-700";
  const catColor = CATEGORY_COLORS[place.category] || "bg-gray-600 text-white";
  const backHref = place.region_id === 1 ? "/pollachi" : "/palani";

  return (
    <>
      {/* Hero */}
      <div className="relative h-[85vh] md:h-[95vh] min-h-[650px]">
        <div className="absolute inset-0 bg-black/55 z-10" />

        {hasImages ? (
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(place.images[0].url)}
              alt={place.images[0].caption || place.name}
              fill
              priority
              quality={100}
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 z-10"
              style={{ background: "linear-gradient(to top, rgba(5,15,5,0.85) 0%, transparent 60%)" }}
            />
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${catGrad}`} />
        )}

        <div className="absolute bottom-0 left-0 right-0 z-20 px-[5%] pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Link href={backHref} className="text-xs text-white/60 hover:text-amber-400 uppercase">
              ← Back to {place.region_name}
            </Link>
            <div className="flex items-center gap-3 mt-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${catColor}`}>
                {place.category}
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">
              {place.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Details */}
      <section className="px-[5%] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 max-w-7xl mx-auto">

          {/* LEFT */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-4">About this Place</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {place.full_description || place.short_description}
            </p>

            {place.address && (
              <div className="mt-8 p-5 bg-green-50 rounded-2xl border border-green-100">
                <h3 className="font-semibold mb-2">📍 Address</h3>
                <p className="text-sm">{place.address}</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            {/* Visit Details */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <h3 className="font-serif text-xl font-bold mb-5">Visit Details</h3>
              <div className="space-y-4">
                {[
                  { icon: "🎫", key: "Entry Fee", val: place.entry_fee },
                  { icon: "🕐", key: "Timings", val: place.timings },
                  { icon: "📍", key: "Distance", val: place.distance_from_city },
                  { icon: "🌡️", key: "Best Time", val: place.best_time_to_visit },
                  { icon: "🗺️", key: "Region", val: place.region_name },
                ].filter(i => i.val).map(item => (
                  <div key={item.key} className="flex gap-3">
                    <span>{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-400">{item.key}</p>
                      <p className="text-sm font-medium">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ UPDATED LOCATION (NO COORDINATES) */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <h3 className="font-semibold mb-3">📌 Location</h3>
              <p className="text-sm text-gray-700">
                {place.name}, Tamil Nadu
              </p>
              <a
                href={`https://www.google.com/maps?q=${place.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm text-green-700 font-semibold hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>

            <Link
              href={backHref}
              className="block w-full text-center py-3 bg-[#1a2e1a] text-white font-semibold rounded-xl"
            >
              ← More in {place.region_name}
            </Link>

          </div>
        </div>
      </section>
    </>
  );
}