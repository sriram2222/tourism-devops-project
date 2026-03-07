'use client';

import { motion } from "framer-motion";

interface NearbyPlace {
  name: string;
  distance: string;
  time: string;
  image: string;
  backgroundPosition?: string;
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
      {/* heading */}
      <p className="text-xs font-bold tracking-[0.25em] text-green-700 uppercase mb-3">
        Nearby
      </p>

      {/* FIXED dark mode title */}
      <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-8">
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
            className="
            bg-white dark:bg-[#111827] 
            rounded-2xl overflow-hidden 
            border border-gray-200 dark:border-gray-700 
            cursor-pointer 
            hover:shadow-xl dark:hover:shadow-emerald-500/10
            transition-all duration-300"
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
              {/* FIX: visible in dark mode */}
              <div className="font-bold text-sm text-gray-900 dark:text-white">
                {p.name}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {p.distance} · {p.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}