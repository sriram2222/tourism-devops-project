'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PlaceCard from "@/components/PlaceCard";
import NearbyPlaces from "@/components/NearbyPlaces";
import { placesApi } from "@/lib/api";
import { Place } from "@/types";

const NEARBY = [
  { name: "Kodaikanal", distance: "65 km", time: "1.5 hrs", image: "/images/nearby/kodaikanal.jpg" },
  { name: "Pollachi", distance: "65 km", time: "1.3 hr", image: "/images/nearby/pollachi.jpg" },
  { name: "Dindigul", distance: "62 km", time: "1.2 hrs", image: "/images/nearby/dindigul.jpg" },
  { name: "Madurai", distance: "120 km", time: "3 hrs", image: "/images/nearby/madurai.jpg" },
];

export default function PalaniPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    placesApi.getAll({ region: "palani" })
      .then(r => setPlaces(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* HERO */}
      <div className="relative h-[65vh] flex items-end px-[5%] pb-16 overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/images/hero/palani-hero.jpg')",
            backgroundPosition: "center 35%" // move image slightly up
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Text */}
        <motion.div
          className="relative z-10 text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold">Palani</h1>
          <p className="mt-3 text-lg">
            Sacred Murugan temple hill town of Tamil Nadu
          </p>
        </motion.div>
      </div>

      {/* PLACES */}
      <section className="px-[5%] py-20">
        <h2 className="font-serif text-4xl font-bold mb-10">Explore Palani</h2>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {places.map((place, idx) => (
              <PlaceCard key={place.id} place={place} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* NEARBY */}
      <NearbyPlaces title="Near Palani" places={NEARBY} />

      {/* MAP */}
      <section className="px-[5%] pb-20">
        <h2 className="font-serif text-3xl font-bold text-center mb-6">
          Palani Location
        </h2>

        <div className="w-full h-[420px] rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps?q=Palani,Tamil%20Nadu&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>

        <div className="text-center mt-6">
          <a
            href="https://www.google.com/maps/place/Palani,+Tamil+Nadu"
            target="_blank"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold"
          >
            Open in Google Maps →
          </a>
        </div>
      </section>
    </>
  );
}