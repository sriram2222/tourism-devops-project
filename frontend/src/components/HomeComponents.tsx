'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PlaceCard from './PlaceCard';
import { placesApi } from '@/lib/api';
import { Place } from '@/types';

/* ═══════════════════════════════════════
   REGION CARDS
═══════════════════════════════════════ */
export function RegionCards() {
  return (
    <section className="px-[5%] py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label text-xs font-bold tracking-[0.25em] text-green-700 dark:text-green-400 uppercase mb-4">
          Destinations
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Two Worlds, One Journey
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mb-14 leading-relaxed">
          Lush western ghats wilderness meets ancient pilgrimage heritage — just hours apart.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pollachi */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="group"
        >
          <Link href="/pollachi" className="relative block h-[480px] rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/pollachi/pollachi-banner.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3 block">🌿 Nature & Wildlife</span>
              <h3 className="font-serif text-4xl font-bold text-white mb-3 leading-tight">Pollachi</h3>
              <p className="text-white/65 text-sm leading-relaxed mb-5 max-w-xs">
                Gateway to Anamalai Tiger Reserve. Waterfalls, misty hill stations, and an ocean of green canopy.
              </p>
              <span className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm group-hover:gap-4 transition-all">
                Explore Pollachi <span>→</span>
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Palani */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="group"
        >
          <Link href="/palani" className="relative block h-[480px] rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/palani/palani-banner.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3 block">🕌 Pilgrimage & Culture</span>
              <h3 className="font-serif text-4xl font-bold text-white mb-3 leading-tight">Palani</h3>
              <p className="text-white/65 text-sm leading-relaxed mb-5 max-w-xs">
                Home to the legendary Dhandayuthapani Swamy Temple atop Sivagiri Hill — a sacred summit for millions.
              </p>
              <span className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm group-hover:gap-4 transition-all">
                Explore Palani <span>→</span>
              </span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   WHY VISIT
═══════════════════════════════════════ */
export function WhyVisit() {
  const features = [
    { icon: '🐯', title: 'Wildlife Safaris', desc: 'Jeep safaris inside Anamalai Tiger Reserve — spot tigers, elephants, and leopards.' },
    { icon: '💧', title: 'Waterfalls', desc: 'Monkey Falls, Palar Dam, and dozens of hidden cascades in the Western Ghats.' },
    { icon: '🕌', title: 'Sacred Heritage', desc: 'The Palani Murugan Temple draws millions — a deeply spiritual and architectural marvel.' },
    { icon: '⛰️', title: 'Hill Stations', desc: 'Valparai at 3,500 ft — mist, tea estates, winding hairpin roads, rare wildlife.' },
  ];

  return (
    <section className="bg-mist dark:bg-[#0a150a] px-[5%] py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="section-label text-xs font-bold tracking-[0.25em] text-green-700 dark:text-green-400 uppercase mb-4 justify-center flex items-center">
          Why Visit
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Experiences You'll Never Forget
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{f.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   SEARCH SECTION
═══════════════════════════════════════ */
export function SearchSection() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');

  function handleSearch() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (region) params.set('region', region);
    window.location.href = region === 'palani' ? '/palani' : '/pollachi';
  }

  return (
    <div className="bg-forest dark:bg-[#0d1a0d] py-16 px-[5%]">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-white text-center mb-8">
        Find Your Next Destination
      </h2>
      <div className="max-w-3xl mx-auto flex gap-3 flex-wrap">
        <input
          className="flex-1 min-w-[220px] px-5 py-3.5 rounded-full border border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all backdrop-blur-sm text-sm"
          placeholder="🔍  Search places — waterfalls, temples, wildlife..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <select
          className="px-5 py-3.5 rounded-full border border-white/20 bg-white/10 text-white focus:outline-none focus:border-amber-400 transition-all backdrop-blur-sm text-sm"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="nature">Nature</option>
          <option value="temple">Temple</option>
          <option value="waterfall">Waterfall</option>
          <option value="viewpoint">Viewpoint</option>
          <option value="market">Market</option>
        </select>
        <select
          className="px-5 py-3.5 rounded-full border border-white/20 bg-white/10 text-white focus:outline-none focus:border-amber-400 transition-all backdrop-blur-sm text-sm"
          value={region}
          onChange={e => setRegion(e.target.value)}
        >
          <option value="">All Regions</option>
          <option value="pollachi">Pollachi</option>
          <option value="palani">Palani</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-7 py-3.5 bg-[#c9922a] hover:bg-[#e8b84b] text-white font-semibold rounded-full transition-all text-sm"
        >
          Search
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   FEATURED PLACES
═══════════════════════════════════════ */
const FILTERS = ['All', 'Nature', 'Temple', 'Waterfall', 'Viewpoint'];

export function FeaturedPlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    placesApi.getAll({ featured: 'true' })
      .then(r => setPlaces(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? places
    : places.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="px-[5%] py-24">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label text-xs font-bold tracking-[0.25em] text-green-700 dark:text-green-400 uppercase mb-3">
            Featured
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Top Attractions
          </h2>
        </motion.div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all
                ${activeFilter === f
                  ? 'bg-forest dark:bg-green-700 text-white border-transparent'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((place, idx) => (
            <PlaceCard key={place.id} place={place} index={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🌿</div>
          <p className="text-gray-400 font-medium">No featured places yet.</p>
          <p className="text-gray-400 text-sm mt-2">
            Add places from the <Link href="/admin/dashboard" className="text-green-600 underline">Admin Panel</Link> and mark them as featured.
          </p>
        </div>
      )}

      {places.length > 0 && (
        <div className="text-center mt-12">
          <Link href="/pollachi" className="inline-block px-8 py-3.5 border-2 border-forest dark:border-green-600 text-forest dark:text-green-400 font-semibold rounded-full hover:bg-forest hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-all">
            View All Pollachi Places
          </Link>
          <Link href="/palani" className="inline-block ml-4 px-8 py-3.5 border-2 border-amber-600 text-amber-600 font-semibold rounded-full hover:bg-amber-600 hover:text-white transition-all">
            View All Palani Places
          </Link>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════
   GALLERY PREVIEW
═══════════════════════════════════════ */
const GRADIENTS = [
  'from-green-900 to-green-700',
  'from-blue-900 to-blue-700',
  'from-orange-900 to-orange-700',
  'from-purple-900 to-purple-700',
  'from-teal-900 to-teal-700',
  'from-amber-900 to-amber-700',
];
const LABELS = ['Anamalai Forest', 'Monkey Falls', 'Palani Temple', 'Valparai', 'Tea Estates', 'Agasthiyar Falls'];

export function GalleryPreview() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/lib/api').then(({ galleryApi }) => {
      galleryApi.getAll()
        .then(r => setImages(r.data.slice(0, 6)))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <section className="bg-mist dark:bg-[#0a150a] px-[5%] py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="section-label text-xs font-bold tracking-[0.25em] text-green-700 dark:text-green-400 uppercase mb-4">
          Gallery
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Captured Moments
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl leading-relaxed">
          A visual journey through landscapes, temples, wildlife, and waterfalls of Tamil Nadu.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 grid-rows-2 gap-4 h-[500px]">
        {/* Large cell */}
        <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group cursor-pointer">
          {images[0] ? (
            <Image src={images[0].image_url} alt={images[0].title || 'Gallery'} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[0]} flex items-end p-5`}>
              <span className="text-white font-semibold">{LABELS[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all"/>
        </div>

        {/* Remaining cells */}
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="rounded-2xl overflow-hidden relative group cursor-pointer">
            {images[i] ? (
              <Image src={images[i].image_url} alt={images[i].title || 'Gallery'} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[i]} flex items-end p-3`}>
                <span className="text-white text-xs font-medium">{LABELS[i]}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all"/>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/gallery" className="inline-block px-8 py-3.5 bg-forest dark:bg-green-700 text-white font-semibold rounded-full hover:opacity-90 transition-all">
          View Full Gallery
        </Link>
      </div>
    </section>
  );
}
