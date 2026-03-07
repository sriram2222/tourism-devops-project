# 🌿 Complete Frontend Source Code — Next.js 15

All files go inside your `frontend/src/` directory.

---

## FILE: `src/app/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --forest: #1a2e1a;
  --jungle: #2d4a2d;
  --leaf: #4a7c4a;
  --sage: #8ab88a;
  --mist: #f0f5f0;
  --cream: #faf8f3;
  --gold: #c9922a;
  --gold-light: #e8b84b;
  --saffron: #e85d04;
}

.dark {
  --forest: #e8f5e8;
  --cream: #0d1a0d;
  --mist: #111f11;
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
}

.font-serif { font-family: 'Cormorant Garamond', serif; }

/* Swiper custom dots */
.swiper-pagination-bullet {
  background: rgba(255,255,255,0.4) !important;
  width: 8px !important; height: 8px !important;
}
.swiper-pagination-bullet-active {
  background: #e8b84b !important;
  width: 24px !important;
  border-radius: 4px !important;
}

/* Scroll animation */
@keyframes scrollPulse {
  0%, 100% { opacity: 0.5; transform: scaleY(0.8); }
  50% { opacity: 1; transform: scaleY(1); }
}
.animate-scroll { animation: scrollPulse 2s ease infinite; }
```

---

## FILE: `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pollachi & Palani Tourism | Discover Tamil Nadu',
  description: 'Explore the natural beauty of Pollachi and the sacred pilgrim town of Palani.',
  keywords: 'Pollachi tourism, Palani temple, Anamalai tiger reserve, Tamil Nadu tourism',
  openGraph: {
    title: 'Pollachi & Palani Tourism',
    description: 'Discover Tamil Nadu hidden treasures',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--cream)] text-gray-900 dark:text-white transition-colors duration-300 dark:bg-[#0d1a0d]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## FILE: `src/app/page.tsx` (Homepage)

```tsx
import HeroSlider from '@/components/HeroSlider';
import StatsBar from '@/components/StatsBar';
import RegionCards from '@/components/RegionCards';
import SearchBar from '@/components/SearchBar';
import FeaturedPlaces from '@/components/FeaturedPlaces';
import GalleryPreview from '@/components/GalleryPreview';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsBar />
      <RegionCards />
      <SearchBar />
      <FeaturedPlaces />
      <GalleryPreview />
    </>
  );
}
```

---

## FILE: `src/app/pollachi/page.tsx`

```tsx
import { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PlacesGrid from '@/components/PlacesGrid';
import MapEmbed from '@/components/MapEmbed';
import NearbyPlaces from '@/components/NearbyPlaces';
import { placesApi } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Pollachi Tourism | Anamalai, Valparai & More',
  description: 'Explore Pollachi — home to Anamalai Tiger Reserve, Monkey Falls, Valparai hill station.',
};

async function getPollachiplaces() {
  try {
    const res = await placesApi.getAll({ region: 'pollachi' });
    return res.data;
  } catch {
    return [];
  }
}

export default async function PollachPage() {
  const places = await getPollachiplaces();

  return (
    <>
      <PageHero
        title="Pollachi"
        subtitle="The Green Gateway"
        description="Gateway to Anamalai Tiger Reserve. Waterfalls, tea estates, and an ocean of green canopy."
        gradient="from-green-950 via-green-800 to-green-600"
        breadcrumb="Pollachi"
      />

      <nav className="sticky top-[70px] z-50 bg-[var(--cream)] dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-[5%] flex gap-0 overflow-x-auto">
        {['Overview', 'Places', 'Map', 'Nearby'].map(tab => (
          <button key={tab} className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400 border-b-[3px] border-transparent hover:text-green-700 hover:border-amber-500 transition-all whitespace-nowrap first:border-amber-500 first:text-green-700">
            {tab}
          </button>
        ))}
      </nav>

      {/* Overview Section */}
      <section className="px-[5%] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-[var(--leaf)] uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[var(--gold)] inline-block"></span>About
            </p>
            <h2 className="font-serif text-4xl font-bold mb-6">Pollachi, Tamil Nadu</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Pollachi is a town in Coimbatore district, Tamil Nadu, nestled at the foothills of the Western Ghats.
              Known as the "Gateway to Anamalai," it is famous for its rich biodiversity, agricultural abundance,
              and natural beauty — home to the 958 sq km Anamalai Tiger Reserve.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              From the misty heights of Valparai (3,500 ft) to the cascading Monkey Falls, from thrilling jeep
              safaris at Top Slip to one of Asia's largest coconut markets — Pollachi offers an experience unlike
              any other in Tamil Nadu.
            </p>
            <div className="bg-[var(--mist)] dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
              <h3 className="font-serif text-xl font-bold mb-5 pb-3 border-b-2 border-amber-500 inline-block">Quick Facts</h3>
              <div className="space-y-4">
                {[
                  { icon: '📍', key: 'Location', val: 'Coimbatore District, Tamil Nadu' },
                  { icon: '🚗', key: 'From Coimbatore', val: '40 km — 1 hour drive' },
                  { icon: '🌡️', key: 'Best Season', val: 'October to March' },
                  { icon: '🌿', key: 'Known For', val: 'Tiger Reserve, Waterfalls, Tea Estates, Film Locations' },
                  { icon: '🎬', key: 'Fun Fact', val: '"Pollachi Scenes" is practically its own film genre!' },
                ].map(item => (
                  <div key={item.key} className="flex gap-4">
                    <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center text-base shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">{item.key}</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-[var(--mist)] dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="font-serif text-xl font-bold mb-5 pb-3 border-b-2 border-amber-500 inline-block">Top Places</h3>
              <div className="space-y-4">
                {[
                  { icon: '🐯', name: 'Anamalai Tiger Reserve', info: '25 km · ₹30 entry' },
                  { icon: '💧', name: 'Monkey Falls', info: '25 km · Free' },
                  { icon: '⛰️', name: 'Valparai', info: '65 km · Free' },
                  { icon: '🌿', name: 'Top Slip Safari', info: '32 km · ₹50+' },
                  { icon: '🥥', name: 'Pollachi Market', info: 'City center · Free' },
                ].map(p => (
                  <div key={p.name} className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center text-base shrink-0">{p.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[var(--mist)] dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="font-serif text-xl font-bold mb-5 pb-3 border-b-2 border-amber-500 inline-block">How to Reach</h3>
              <div className="space-y-4">
                {[
                  { icon: '✈️', key: 'Airport', val: 'Coimbatore Intl (40 km)' },
                  { icon: '🚂', key: 'Train', val: 'Pollachi Junction (direct trains)' },
                  { icon: '🚌', key: 'Bus', val: 'From Coimbatore, Palani, Madurai' },
                ].map(i => (
                  <div key={i.key} className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center text-base shrink-0">{i.icon}</div>
                    <div>
                      <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">{i.key}</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{i.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="px-[5%] pb-20">
        <PlacesGrid places={places} title="Explore All Places in Pollachi" />
      </section>

      {/* Map */}
      <MapEmbed
        title="Pollachi on the Map"
        lat={10.6545}
        lng={77.0071}
        label="Pollachi, Tamil Nadu"
      />

      {/* Nearby */}
      <NearbyPlaces
        title="Near Pollachi"
        places={[
          { name: 'Valparai', distance: '65 km', time: '1.5 hrs' },
          { name: 'Coimbatore', distance: '40 km', time: '1 hr' },
          { name: 'Palani', distance: '55 km', time: '1.2 hrs' },
          { name: 'Kodaikanal', distance: '120 km', time: '3 hrs' },
        ]}
      />
    </>
  );
}
```

---

## FILE: `src/app/palani/page.tsx`

```tsx
import { Metadata } from 'next';
import PlacesGrid from '@/components/PlacesGrid';
import MapEmbed from '@/components/MapEmbed';
import NearbyPlaces from '@/components/NearbyPlaces';
import { placesApi } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Palani Tourism | Murugan Temple, Agasthiyar Falls',
  description: 'Visit Palani — sacred home of Lord Murugan, Agasthiyar Falls, and the Palani Hills.',
};

async function getPalaniPlaces() {
  try {
    const res = await placesApi.getAll({ region: 'palani' });
    return res.data;
  } catch { return []; }
}

export default async function PalaniPage() {
  const places = await getPalaniPlaces();

  return (
    <>
      {/* PageHero with saffron/orange gradient */}
      <div className="relative h-[60vh] min-h-[400px] flex items-end px-[5%] pb-16"
        style={{ background: 'linear-gradient(135deg,#3a1500,#7a3500,#c97c2a)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(20,8,0,0.9),rgba(20,8,0,0.3))' }}/>
        <div className="relative z-10">
          <div className="text-xs text-white/50 mb-3">Home / Palani</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">
            Palani — <em className="text-amber-400">The Sacred Summit</em>
          </h1>
          <p className="text-white/70 mt-3 text-lg max-w-xl">
            Home to the ancient Dhandayuthapani Swamy Temple atop Sivagiri Hill — one of the most revered Murugan shrines in India.
          </p>
        </div>
      </div>

      {/* Temple Info Highlights */}
      <section className="px-[5%] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          <div>
            <h2 className="font-serif text-4xl font-bold mb-6">Palani, Tamil Nadu</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Palani is a sacred pilgrimage town in Dindigul district. The Arulmigu Dhandayuthapani Swamy Temple —
              one of the Arupadai Veedu (six sacred abodes of Lord Murugan) — sits atop the 152-meter Sivagiri Hill.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              The idol of Dhandayuthapani is uniquely crafted from Navapashanam — nine poisonous minerals alchemically
              combined by the legendary Sage Bogar. Millions of devotees climb the 693 stone steps during Thaipusam
              and Kanda Sashti festivals each year.
            </p>
          </div>
          <div className="space-y-5">
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-900">
              <h3 className="font-serif text-xl font-bold mb-4">Temple Access</h3>
              {[
                { icon: '🪜', key: 'By Foot', val: '693 stone steps (most auspicious route)' },
                { icon: '🚡', key: 'Ropeway', val: '₹50-80 round trip · 7 min' },
                { icon: '🚠', key: 'Winch Car', val: '₹30-50 · Motor-driven incline' },
                { icon: '🕐', key: 'Temple Hours', val: '05:00 AM – 09:00 PM daily' },
              ].map(i => (
                <div key={i.key} className="flex gap-3 mb-3">
                  <span className="text-xl">{i.icon}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{i.key}</p>
                    <p className="text-sm font-medium">{i.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-[5%] pb-20">
        <PlacesGrid places={places} title="Explore All Places in Palani" />
      </section>

      <MapEmbed title="Palani on the Map" lat={10.4491} lng={77.5149} label="Palani, Tamil Nadu" />

      <NearbyPlaces
        title="Near Palani"
        places={[
          { name: 'Kodaikanal', distance: '65 km', time: '1.5 hrs' },
          { name: 'Pollachi', distance: '55 km', time: '1.2 hrs' },
          { name: 'Dindigul', distance: '65 km', time: '1.5 hrs' },
          { name: 'Madurai', distance: '100 km', time: '2 hrs' },
        ]}
      />
    </>
  );
}
```

---

## FILE: `src/app/gallery/page.tsx`

```tsx
'use client';
import { useState, useEffect } from 'react';
import { galleryApi } from '@/lib/api';

const FILTERS = ['All', 'Pollachi', 'Palani', 'Nature', 'Temple', 'Waterfall'];

export default function GalleryPage() {
  const [active, setActive] = useState('All');
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    galleryApi.getAll().then(r => setImages(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <div className="relative h-[45vh] flex items-end px-[5%] pb-16"
        style={{ background: 'linear-gradient(135deg,#1a1a3a,#3a2a5a,#5a3a6a)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(10,5,20,0.9),rgba(10,5,20,0.3))' }}/>
        <div className="relative z-10">
          <div className="text-xs text-white/50 mb-3">Home / Gallery</div>
          <h1 className="font-serif text-5xl font-bold text-white">Gallery — <em className="text-amber-400">Captured Beauty</em></h1>
        </div>
      </div>

      <section className="px-[5%] py-16">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all
                ${active === f
                  ? 'bg-[var(--forest)] text-white border-transparent dark:bg-green-700'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
                }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {images.length > 0 ? images.map((img, i) => (
            <div key={img.id} className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
              <img src={img.image_url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white text-[var(--forest)] px-4 py-2 rounded-full text-sm font-bold transition-opacity">
                  {img.title || img.tag}
                </span>
              </div>
            </div>
          )) : (
            /* Placeholder gradient cards while no images */
            ['#1a3a1a,#4a8c3a','#0d2a4a,#2d6a8a','#3a1a0a,#8a5a2a','#2a1a3a,#6a4a8a',
             '#1a3a2a,#3a8a5a','#3a2a0a,#8a6a2a','#2a3a1a,#5a7a3a','#3a2a1a,#7a5a2a','#1a2a4a,#3a5a8a']
            .map((grad, i) => (
              <div key={i} className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
                style={{ background: `linear-gradient(135deg,${grad})` }}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-bold transition-opacity">
                    Add your photo
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <p className="text-center mt-8 text-sm text-gray-500">
          📷 Upload photos via the <a href="/admin" className="text-green-700 font-semibold hover:underline">Admin Panel</a>
        </p>
      </section>
    </>
  );
}
```

---

## FILE: `src/app/admin/login/page.tsx`

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authApi.login(username, password);
      localStorage.setItem('tourism_token', res.data.access_token);
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid username or password');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] dark:bg-[#0d1a0d] px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--forest)] to-[var(--leaf)] flex items-center justify-center text-3xl mx-auto mb-4">🌿</div>
          <h2 className="font-serif text-3xl font-bold">Admin Portal</h2>
          <p className="text-gray-500 text-sm mt-1">Tamil Tourism Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900 transition-all"
              placeholder="admin" required/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900 transition-all"
              placeholder="••••••••" required/>
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950 px-4 py-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-white font-semibold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">Default: admin / Admin@123 — Change after first login</p>
      </div>
    </div>
  );
}
```

---

## FILE: `src/app/admin/dashboard/page.tsx`

```tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { placesApi, uploadApi } from '@/lib/api';
import { Place } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', slug: '', region_id: 1, category: 'nature',
    short_description: '', entry_fee: '', timings: '',
    distance_from_city: '', address: '', latitude: '', longitude: '',
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('tourism_token');
    if (!token) { router.push('/admin/login'); return; }
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    try {
      const res = await placesApi.getAll();
      setPlaces(res.data);
    } catch { } finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const res = await placesApi.create({
        ...form,
        latitude: parseFloat(form.latitude) || undefined,
        longitude: parseFloat(form.longitude) || undefined,
      } as any);
      if (imageFile && res.data.id) {
        await uploadApi.uploadImage(imageFile, res.data.id, true);
      }
      alert('Place added successfully!');
      fetchPlaces();
      setForm({ name:'',slug:'',region_id:1,category:'nature',short_description:'',entry_fee:'',timings:'',distance_from_city:'',address:'',latitude:'',longitude:'',is_featured:false });
      setImageFile(null);
    } catch { alert('Failed to save. Check if you are logged in.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this place?')) return;
    await placesApi.delete(id);
    fetchPlaces();
  }

  const filtered = places.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen pt-[70px]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[var(--forest)] dark:bg-[#0d1a0d] sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="font-serif text-xl font-bold text-white">🌿 TamilTourism</div>
          <div className="text-xs text-white/40 mt-1">Admin Dashboard</div>
        </div>
        {[
          { icon: '📊', label: 'Dashboard' },
          { icon: '📍', label: 'All Places' },
          { icon: '🖼️', label: 'Gallery' },
          { icon: '➕', label: 'Add Place' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 px-6 py-3 text-white/60 hover:bg-white/8 hover:text-white cursor-pointer transition-all text-sm font-medium border-l-[3px] border-transparent hover:border-amber-400">
            <span>{item.icon}</span>{item.label}
          </div>
        ))}
        <div className="px-6 pt-4 pb-1 text-xs font-bold tracking-widest text-white/25 uppercase">Regions</div>
        {[{ icon:'🌿', label:'Pollachi', href:'/pollachi'},{icon:'🕌',label:'Palani',href:'/palani'}].map(r => (
          <a key={r.label} href={r.href} className="flex items-center gap-3 px-6 py-3 text-white/60 hover:text-white text-sm border-l-[3px] border-transparent hover:border-amber-400 transition-all">
            <span>{r.icon}</span>{r.label}
          </a>
        ))}
        <div className="px-6 pt-4 pb-1 text-xs font-bold tracking-widest text-white/25 uppercase">Account</div>
        <button onClick={() => { localStorage.removeItem('tourism_token'); router.push('/admin/login'); }}
          className="flex items-center gap-3 px-6 py-3 text-white/60 hover:text-white text-sm w-full border-l-[3px] border-transparent hover:border-red-400 transition-all">
          <span>🚪</span>Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 bg-[var(--cream)] dark:bg-gray-950">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your Pollachi & Palani tourism content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { icon:'📍', num: places.length, label:'Total Places', color:'bg-green-50 dark:bg-green-950' },
            { icon:'⭐', num: places.filter(p=>p.is_featured).length, label:'Featured', color:'bg-amber-50 dark:bg-amber-950' },
            { icon:'🌿', num: places.filter(p=>p.region_id===1).length, label:'Pollachi Places', color:'bg-blue-50 dark:bg-blue-950' },
            { icon:'🕌', num: places.filter(p=>p.region_id===2).length, label:'Palani Places', color:'bg-orange-50 dark:bg-orange-950' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.color}`}>{s.icon}</div>
              <div><div className="text-3xl font-bold">{s.num}</div><div className="text-sm text-gray-500">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Add Place Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">➕ Add New Place</div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div><label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">Place Name *</label>
                <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value,slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-green-500" placeholder="e.g. Monkey Falls"/></div>
              <div><label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">Region</label>
                <select value={form.region_id} onChange={e=>setForm({...form,region_id:+e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-green-500">
                  <option value={1}>Pollachi</option><option value={2}>Palani</option></select></div>
              <div><label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-green-500">
                  {['nature','temple','waterfall','dam','viewpoint','market','other'].map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="md:col-span-3"><label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">Short Description</label>
                <input value={form.short_description} onChange={e=>setForm({...form,short_description:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-green-500" placeholder="Brief, engaging description..."/></div>
              <div><label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">Entry Fee</label>
                <input value={form.entry_fee} onChange={e=>setForm({...form,entry_fee:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-green-500" placeholder="e.g. ₹30 / Free"/></div>
              <div><label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">Timings</label>
                <input value={form.timings} onChange={e=>setForm({...form,timings:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-green-500" placeholder="e.g. 6AM - 6PM"/></div>
              <div><label className="block text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">Distance from City</label>
                <input value={form.distance_from_city} onChange={e=>setForm({...form,distance_from_city:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-green-500" placeholder="e.g. 25 km"/></div>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-[var(--gold)] text-white font-semibold rounded-xl hover:bg-[var(--gold-light)] transition-all disabled:opacity-60 text-sm">
                {saving ? 'Saving...' : 'Save Place'}
              </button>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})} className="accent-green-600"/> Featured
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                📎 Upload Image:
                <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0]||null)} className="text-xs"/>
              </label>
            </div>
          </form>
        </div>

        {/* Places Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="font-semibold">All Places ({filtered.length})</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none w-48"/>
          </div>
          <table className="w-full">
            <thead><tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Place</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Region</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-semibold text-sm">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.region_name}</td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-500">{p.category}</td>
                  <td className="px-6 py-4">
                    {p.is_featured
                      ? <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">⭐ Featured</span>
                      : <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Active</span>}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 transition-all">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 transition-all">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
```

---

## FILE: `src/components/Navbar.tsx`

```tsx
'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] px-[5%] h-[70px] flex items-center justify-between transition-all duration-300
      ${scrolled ? 'bg-[var(--cream)]/90 dark:bg-[#0d1a0d]/90 backdrop-blur-xl shadow-sm' : ''}`}>
      <Link href="/" className={`font-serif text-2xl font-bold transition-colors ${scrolled ? 'text-[var(--forest)]' : 'text-white'}`}>
        🌿 Tamil<span className={scrolled ? 'text-[var(--gold)]' : 'text-[var(--gold-light)]'}>Tourism</span>
      </Link>
      <ul className="hidden md:flex items-center gap-8 list-none">
        {[{href:'/', label:'Home'},{href:'/pollachi', label:'Pollachi'},{href:'/palani', label:'Palani'},{href:'/gallery', label:'Gallery'}].map(l => (
          <li key={l.href}>
            <Link href={l.href} className={`text-sm font-medium transition-colors hover:text-[var(--leaf)] ${scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/85'}`}>{l.label}</Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110 text-lg
            ${scrolled ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800' : 'border-white/30 bg-white/10 text-white'}`}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <Link href="/admin/login" className="hidden sm:block px-5 py-2 bg-[var(--gold)] text-white text-sm font-semibold rounded-full hover:bg-[var(--gold-light)] transition-all hover:-translate-y-0.5">
          Admin
        </Link>
      </div>
    </nav>
  );
}
```

---

## FILE: `src/components/Footer.tsx`

```tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--forest)] dark:bg-[#0d1a0d] px-[5%] pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10 mb-8">
        <div>
          <div className="font-serif text-2xl font-bold text-white mb-4">🌿 Tamil<span className="text-amber-400">Tourism</span></div>
          <p className="text-sm text-white/50 leading-relaxed">Discover the untouched beauty of Pollachi and the sacred heritage of Palani.</p>
        </div>
        {[
          { title: 'Destinations', links: [{href:'/pollachi',label:'Pollachi'},{href:'/palani',label:'Palani'},{href:'/gallery',label:'Gallery'}] },
          { title: 'Places', links: [{href:'/pollachi',label:'Anamalai Reserve'},{href:'/pollachi',label:'Monkey Falls'},{href:'/palani',label:'Palani Temple'},{href:'/palani',label:'Agasthiyar Falls'}] },
          { title: 'Admin', links: [{href:'/admin/login',label:'Login'},{href:'/admin/dashboard',label:'Dashboard'}] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/35 mb-4">{col.title}</h4>
            <div className="flex flex-col gap-2">
              {col.links.map(l => <Link key={l.label} href={l.href} className="text-sm text-white/55 hover:text-amber-400 transition-colors">{l.label}</Link>)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-white/30">
        <span>© 2026 Tamil Tourism. DevOps Portfolio Project.</span>
        <span>Next.js 15 · Flask · MySQL · Docker · AWS EC2</span>
      </div>
    </footer>
  );
}
```

---

## FILE: `src/components/MapEmbed.tsx`

```tsx
interface MapEmbedProps {
  title: string;
  lat: number;
  lng: number;
  label: string;
}

export default function MapEmbed({ title, lat, lng, label }: MapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const src = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=12`
    : null;

  return (
    <section className="bg-[var(--mist)] dark:bg-[#0a150a] px-[5%] py-20">
      <p className="text-xs font-bold tracking-[0.25em] text-[var(--leaf)] uppercase mb-4 flex items-center gap-2">
        <span className="w-6 h-0.5 bg-[var(--gold)] inline-block"></span>Location
      </p>
      <h2 className="font-serif text-4xl font-bold mb-10">{title}</h2>
      <div className="rounded-2xl overflow-hidden h-[450px] border-2 border-gray-100 dark:border-gray-800">
        {src ? (
          <iframe src={src} width="100%" height="100%" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className="border-none"/>
        ) : (
          <div className="h-full bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center text-center text-gray-500">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="font-semibold mb-2">Google Maps</p>
            <p className="text-sm">Add your API key to <code className="bg-green-100 dark:bg-gray-700 px-2 py-0.5 rounded text-green-700 dark:text-green-300">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code></p>
            <p className="text-xs mt-3 text-gray-400">Coordinates: {lat}° N, {lng}° E</p>
          </div>
        )}
      </div>
    </section>
  );
}
```

---

## FILE: `src/components/PlaceCard.tsx`

```tsx
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types';

const BADGE_COLORS: Record<string, string> = {
  nature: 'bg-green-600',
  temple: 'bg-orange-600',
  waterfall: 'bg-blue-600',
  viewpoint: 'bg-purple-600',
  market: 'bg-yellow-600',
  other: 'bg-gray-600',
};

export default function PlaceCard({ place, index = 0 }: { place: Place; index?: number }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  const imgSrc = place.primary_image
    ? (place.primary_image.startsWith('/api') ? `${apiBase}${place.primary_image}` : place.primary_image)
    : null;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }} className="group h-full">
      <Link href={`/place/${place.slug}`} className="block h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
        <div className="relative h-56 overflow-hidden">
          {imgSrc ? (
            <Image src={imgSrc} alt={place.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700"/>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-800 to-green-600"/>
          )}
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white capitalize ${BADGE_COLORS[place.category]}`}>{place.category}</span>
          {place.is_featured && <span className="absolute top-3 right-3 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold">⭐ Featured</span>}
        </div>
        <div className="p-5 flex flex-col h-[calc(100%-224px)]">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 transition-colors">{place.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 flex-1 mb-4">{place.short_description}</p>
          <div className="space-y-1.5 text-xs text-gray-400 mb-4">
            {place.distance_from_city && <div>📍 {place.distance_from_city}</div>}
            {place.timings && <div>🕐 {place.timings}</div>}
            {place.entry_fee && <div>🎫 {place.entry_fee}</div>}
          </div>
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">{place.region_name}</span>
            <span className="text-sm font-semibold text-amber-600 group-hover:underline">Explore →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
```

---

## HOW TO CREATE REMAINING COMPONENTS

### `src/components/HeroSlider.tsx`
Copy the full code from the previous DevOps guide document (it was included there).

### `src/components/StatsBar.tsx`

```tsx
const stats = [
  { num: '9+', label: 'Must-Visit Places' },
  { num: '2', label: 'Unique Regions' },
  { num: '958', label: 'km² Tiger Reserve' },
  { num: '152m', label: 'Palani Hill Height' },
];

export default function StatsBar() {
  return (
    <div className="bg-[var(--forest)] dark:bg-[#0d1a0d]">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
        {stats.map(s => (
          <div key={s.label} className="py-10 px-8 text-center hover:bg-[var(--jungle)] transition-colors">
            <div className="font-serif text-4xl font-bold text-amber-400">{s.num}</div>
            <div className="text-xs text-white/50 mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### `src/components/NearbyPlaces.tsx`

```tsx
interface NearbyPlace { name: string; distance: string; time: string; }
export default function NearbyPlaces({ title, places }: { title: string; places: NearbyPlace[] }) {
  return (
    <section className="px-[5%] py-16">
      <p className="text-xs font-bold tracking-[0.25em] text-[var(--leaf)] uppercase mb-4 flex items-center gap-2">
        <span className="w-6 h-0.5 bg-[var(--gold)] inline-block"></span>Nearby
      </p>
      <h2 className="font-serif text-3xl font-bold mb-8">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {places.map(p => (
          <div key={p.name} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="h-28 bg-gradient-to-br from-green-800 to-green-600"/>
            <div className="p-4">
              <div className="font-bold text-sm">{p.name}</div>
              <div className="text-xs text-gray-400 mt-1">{p.distance} · {p.time}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        forest: "#1a2e1a",
        leaf: "#4a7c4a",
        gold: "#c9922a",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## SUMMARY — All Frontend Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with theme provider |
| `src/app/globals.css` | Global styles + fonts |
| `src/app/page.tsx` | Homepage |
| `src/app/pollachi/page.tsx` | Pollachi full page |
| `src/app/palani/page.tsx` | Palani full page |
| `src/app/gallery/page.tsx` | Gallery with filter |
| `src/app/admin/login/page.tsx` | JWT login form |
| `src/app/admin/dashboard/page.tsx` | Full CRUD admin panel |
| `src/components/Navbar.tsx` | Sticky transparent → solid navbar |
| `src/components/Footer.tsx` | Multi-column footer |
| `src/components/HeroSlider.tsx` | 15-second Swiper hero |
| `src/components/PlaceCard.tsx` | Animated place card |
| `src/components/MapEmbed.tsx` | Google Maps or placeholder |
| `src/components/StatsBar.tsx` | 4-stat bar |
| `src/components/NearbyPlaces.tsx` | Nearby destination cards |
| `src/lib/api.ts` | Axios API client |
| `src/types/index.ts` | TypeScript interfaces |
| `tailwind.config.ts` | Tailwind config with custom tokens |
