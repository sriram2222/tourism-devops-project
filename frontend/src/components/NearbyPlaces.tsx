'use client';

import { motion } from "framer-motion";

interface NearbyPlace {
  name: string;
  distance: string;
  time: string;
  image: string;
  backgroundPosition?: string; // optional
}

export default function NearbyPlaces({
  title,
  places,
}: {
  title: string;
  places: NearbyPlace[];
}) {
  return (
    <section className="px-[5%] py-16">
      <p className="text-xs font-bold tracking-[0.25em] text-green-700 uppercase mb-3">
        Nearby
      </p>

      <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
        {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {places?.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-pointer hover:shadow-xl transition-all"
          >
            {/* IMAGE */}
            <div
              className="h-36 bg-cover bg-center"
              style={{
                backgroundImage: `url(${p.image})`,
                backgroundPosition: p.backgroundPosition || "center",
              }}
            />

            {/* TEXT */}
            <div className="p-4">
              <div className="font-bold text-sm text-gray-900">
                {p.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {p.distance} · {p.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
