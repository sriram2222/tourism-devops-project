'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PlaceCard from "@/components/PlaceCard";
import NearbyPlaces from "@/components/NearbyPlaces";
import { placesApi } from "@/lib/api";
import { Place } from "@/types";

const NEARBY = [
{ name: "Valparai", distance: "65 km", time: "1.5 hrs", image: "/images/nearby/valparai.jpg" },
{ name: "Coimbatore", distance: "40 km", time: "1 hr", image: "/images/nearby/coimbatore.jpg" },
{ name: "Palani", distance: "62 km", time: "1.2 hrs", image: "/images/nearby/palani.jpg", backgroundPosition: "center 30%" },
{ name: "Udumalaipettai", distance: "30 km", time: "1 hr", image: "/images/nearby/udumalaipettai.jpg", backgroundPosition: "center 70%"  },
];

export default function PollachPage() {
const [places, setPlaces] = useState<Place[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
placesApi.getAll({ region: "pollachi" })
.then(r => setPlaces(r.data))
.catch(() => {})
.finally(() => setLoading(false));
}, []);

return (
<>
{/* HERO */} <div className="relative h-[65vh] min-h-[420px] flex items-end px-[5%] pb-16 overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center"
style={{ backgroundImage: "url('/images/hero/pollachi-hero.jpg')" }} /> <div className="absolute inset-0 bg-black/50" />

```
    <motion.div className="relative z-10 text-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-serif text-6xl font-bold">Pollachi</h1>
      <p className="mt-3 text-lg">Gateway to Anamalai Tiger Reserve and green landscapes.</p>
    </motion.div>
  </div>

  {/* PLACES */}
  <section className="px-[5%] py-20">
    <h2 className="font-serif text-4xl font-bold mb-10">Explore Pollachi</h2>

    {loading ? (
      <div className="grid md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />)}
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
  <NearbyPlaces title="Near Pollachi" places={NEARBY} />

  {/* MAP */}
  <section className="px-[5%] pb-20">
    <h2 className="font-serif text-3xl font-bold text-center mb-6">Pollachi Location</h2>

    <div className="w-full h-[420px] rounded-2xl overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps?q=Pollachi,Tamil%20Nadu&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      />
    </div>

    <div className="text-center mt-6">
      <a
        href="https://www.google.com/maps/place/Pollachi,+Tamil+Nadu"
        target="_blank"
        className="inline-block bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-semibold"
      >
        Open in Google Maps →
      </a>
    </div>
  </section>
</>


);
}
