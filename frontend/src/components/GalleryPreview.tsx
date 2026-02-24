'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { galleryApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

const GRADS = [
  "from-green-900 to-green-700","from-blue-900 to-blue-700",
  "from-orange-900 to-orange-700","from-purple-900 to-purple-700",
  "from-teal-900 to-teal-700","from-amber-900 to-amber-700",
];
const LABELS = ["Anamalai Forest","Monkey Falls","Palani Temple","Valparai"];

export default function GalleryPreview() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    galleryApi.getAll().then(r => setImages(r.data.slice(0,6))).catch(() => {});
  }, []);

  return (
    <section className="bg-[#f0f5f0] dark:bg-[#0a150a] px-[5%] py-24">
      <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="mb-12">
        <p className="text-xs font-bold tracking-[0.25em] text-green-700 dark:text-green-400 uppercase mb-4">Gallery</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Captured Moments</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">A visual journey through landscapes, temples, wildlife, and waterfalls.</p>
      </motion.div>

      <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[460px]">
        {/* Large first cell */}
        <div className="col-span-1 row-span-2 rounded-2xl overflow-hidden relative group">
          {images[0] ? (
            <Image src={getImageUrl(images[0].image_url)} alt={images[0].title||"Gallery"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${GRADS[0]} flex items-end p-5`}>
              <span className="text-white font-semibold">{LABELS[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />
        </div>
        
        {/* Remaining 5 */}
        {[1,2,3,4,5].map(i => (
          <div key={i} className="rounded-2xl overflow-hidden relative group">
            {images[i] && (
  <Image
    src={getImageUrl(images[i].image_url)}
    alt={images[i].title || "Gallery"}
    fill
    className="object-cover group-hover:scale-105 transition-transform duration-500"
  />
)}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/gallery" className="inline-block px-8 py-3.5 bg-[#1a2e1a] dark:bg-green-700 text-white font-semibold rounded-full hover:opacity-90 transition-all">
          View Full Gallery
        </Link>
      </div>
    </section>
  );
  
}
