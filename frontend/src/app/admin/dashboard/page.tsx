'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { placesApi, galleryApi, uploadApi } from "@/lib/api";
import { Place } from "@/types";
import { getImageUrl, slugify } from "@/lib/utils";

type Tab = "dashboard" | "places" | "gallery" | "add";
const CATEGORIES = ["nature","temple","waterfall","dam","viewpoint","market","other"];
const EMPTY_FORM = {
  name:"", slug:"", region_id:1, category:"nature",
  short_description:"", full_description:"", address:"",
  latitude:"", longitude:"", entry_fee:"", timings:"",
  best_time_to_visit:"", distance_from_city:"", is_featured: false,
};

export default function AdminDashboard() {
  const router                        = useRouter();
  const [tab, setTab]                 = useState<Tab>("dashboard");
  const [places, setPlaces]           = useState<Place[]>([]);
  const [galleryImages, setGallery]   = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [form, setForm]               = useState(EMPTY_FORM);
  const [imgFile, setImgFile]         = useState<File|null>(null);
  const [imgPreview, setImgPreview]   = useState<string|null>(null);
  const [saving, setSaving]           = useState(false);
  const [saveMsg, setSaveMsg]         = useState("");
  const [editId, setEditId]           = useState<number|null>(null);
  const [gFile, setGFile]             = useState<File|null>(null);
  const [gTitle, setGTitle]           = useState("");
  const [gTag, setGTag]               = useState("");
  const [gRegion, setGRegion]         = useState("1");
  const fileRef                        = useRef<HTMLInputElement>(null);
  const gFileRef                       = useRef<HTMLInputElement>(null);

  // ✅ Gallery edit state
  const [gEditItem, setGEditItem]     = useState<any|null>(null);
  const [gEditTitle, setGEditTitle]   = useState("");
  const [gEditTag, setGEditTag]       = useState("");
  const [gEditSaving, setGEditSaving] = useState(false);

  // ✅ Toast
  const [toast, setToast]             = useState<{msg:string; type:"success"|"error"}|null>(null);

  function showToast(msg: string, type: "success"|"error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    const token = localStorage.getItem("tourism_token");
    if (!token) { router.push("/admin/login"); return; }
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [p, g] = await Promise.all([placesApi.getAll(), galleryApi.getAll()]);
      setPlaces(p.data); setGallery(g.data);
    } catch {} finally { setLoading(false); }
  }

  function handleImgChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setImgFile(file);
    const r = new FileReader(); r.onload = ev => setImgPreview(ev.target?.result as string); r.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setSaveMsg("");
    try {
      const payload: any = {
        ...form, region_id: Number(form.region_id),
        latitude:  form.latitude  ? parseFloat(form.latitude)  : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      };
      let placeId = editId;
      if (editId) { await placesApi.update(editId, payload); }
      else        { const res = await placesApi.create(payload); placeId = res.data.id; }
      if (imgFile && placeId) await uploadApi.uploadImage(imgFile, placeId, true);
      setSaveMsg(editId ? "✅ Place updated!" : "✅ Place added!");
      setForm(EMPTY_FORM); setImgFile(null); setImgPreview(null); setEditId(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchAll(); setTimeout(() => setSaveMsg(""), 4000);
    } catch (err: any) {
      setSaveMsg("❌ " + (err?.response?.data?.error || "Failed to save"));
    } finally { setSaving(false); }
  }

  function startEdit(p: Place) {
    setForm({
      name: p.name, slug: p.slug, region_id: p.region_id, category: p.category,
      short_description: p.short_description || "", full_description: p.full_description || "",
      address: p.address || "", latitude: p.latitude?.toString() || "",
      longitude: p.longitude?.toString() || "", entry_fee: p.entry_fee || "",
      timings: p.timings || "", best_time_to_visit: p.best_time_to_visit || "",
      distance_from_city: p.distance_from_city || "", is_featured: p.is_featured,
    });
    setEditId(p.id); setTab("add"); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await placesApi.delete(id); fetchAll();
  }

  async function handleGalleryUpload() {
    if (!gFile) { alert("Select an image first"); return; }
    const fd = new FormData();
    fd.append("file", gFile); fd.append("region_id", gRegion);
    if (gTitle) fd.append("title", gTitle);
    if (gTag)   fd.append("tag", gTag);
    await galleryApi.create(fd);
    setGFile(null); setGTitle(""); setGTag("");
    if (gFileRef.current) gFileRef.current.value = "";
    fetchAll();
    showToast("Image uploaded successfully!");
  }

  async function handleGalleryDelete(id: number) {
    if (!confirm("Delete this image?")) return;
    await galleryApi.delete(id);
    fetchAll();
    showToast("Image deleted!");
  }

  // ✅ Open gallery edit modal
  function openGalleryEdit(img: any, e: React.MouseEvent) {
    e.stopPropagation();
    setGEditItem(img);
    setGEditTitle(img.title || "");
    setGEditTag(img.tag || "");
  }

  // ✅ Save gallery edit
  async function saveGalleryEdit() {
    if (!gEditItem) return;
    setGEditSaving(true);
    try {
      await galleryApi.update(gEditItem.id, { title: gEditTitle, tag: gEditTag });
      setGallery(prev => prev.map(img =>
        img.id === gEditItem.id ? { ...img, title: gEditTitle, tag: gEditTag } : img
      ));
      setGEditItem(null);
      showToast("Image updated successfully!");
    } catch {
      showToast("Failed to update image", "error");
    } finally {
      setGEditSaving(false);
    }
  }

  const filtered = places.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const SIDEBAR = [
    { t: "dashboard", icon: "📊", label: "Dashboard"                            },
    { t: "places",    icon: "📍", label: "All Places"                            },
    { t: "gallery",   icon: "🖼️", label: "Gallery"                               },
    { t: "add",       icon: "➕", label: editId ? "Edit Place" : "Add Place"     },
  ] as const;

  return (
    <div className="flex min-h-screen pt-[70px] bg-[var(--cream)] dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#1a2e1a] dark:bg-[#0d1a0d] sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="font-serif text-xl font-bold text-white">🌿 PP Tourism</div>
          <div className="text-xs text-white/40 mt-1">Admin Dashboard</div>
        </div>
        <nav className="py-4 flex-1">
          <p className="px-5 text-xs font-bold tracking-widest text-white/25 uppercase mb-2">Management</p>
          {SIDEBAR.map(s => (
            <button key={s.t} onClick={() => setTab(s.t as Tab)}
              className={`flex items-center gap-3 w-full px-5 py-3 text-sm font-medium transition-all border-l-[3px]
                ${tab === s.t ? "bg-white/10 text-white border-amber-400" : "text-white/55 border-transparent hover:bg-white/5 hover:text-white"}`}>
              <span>{s.icon}</span>{s.label}
              {s.t === "add" && editId && <span className="ml-auto text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full">Edit</span>}
            </button>
          ))}
          <p className="px-5 text-xs font-bold tracking-widest text-white/25 uppercase mb-2 mt-6">View Site</p>
          {[{h:"/",l:"🏠 Home"},{h:"/pollachi",l:"🌿 Pollachi"},{h:"/palani",l:"🕌 Palani"},{h:"/gallery",l:"🖼️ Gallery"}].map(lk => (
            <a key={lk.h} href={lk.h} target="_blank"
              className="flex items-center gap-3 px-5 py-3 text-sm text-white/55 hover:text-white hover:bg-white/5 transition-all border-l-[3px] border-transparent">
              {lk.l}
            </a>
          ))}
        </nav>
        <div className="px-5 pb-6">
          <button onClick={() => { localStorage.removeItem("tourism_token"); router.push("/admin/login"); }}
            className="w-full text-left py-3 text-sm text-red-400 hover:text-red-300 transition-colors">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Pollachi & Palani Tourism CMS</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                { icon:"📍", num: places.length,                         label:"Total Places", bg:"bg-green-50 dark:bg-green-950" },
                { icon:"⭐", num: places.filter(p=>p.is_featured).length, label:"Featured",    bg:"bg-amber-50 dark:bg-amber-950" },
                { icon:"🌿", num: places.filter(p=>p.region_id===1).length, label:"Pollachi",  bg:"bg-blue-50 dark:bg-blue-950"  },
                { icon:"🕌", num: places.filter(p=>p.region_id===2).length, label:"Palani",    bg:"bg-orange-50 dark:bg-orange-950"},
              ].map(s => (
                <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.bg}`}>{s.icon}</div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? "…" : s.num}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { label:"➕ Add a new place",        color:"bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 hover:bg-green-100",   onClick:()=>{ setTab("add"); setEditId(null); setForm(EMPTY_FORM); } },
                    { label:"🖼️ Upload gallery images",   color:"bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-200 hover:bg-purple-100", onClick:()=>setTab("gallery") },
                    { label:"📝 View & edit all places",  color:"bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 hover:bg-blue-100",          onClick:()=>setTab("places") },
                  ].map(a => (
                    <button key={a.label} onClick={a.onClick} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${a.color}`}>{a.label}</button>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Gallery Images</span><span className="font-bold text-gray-900 dark:text-white">{galleryImages.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Featured Places</span><span className="font-bold text-gray-900 dark:text-white">{places.filter(p=>p.is_featured).length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Place Images</span><span className="font-bold text-gray-900 dark:text-white">{places.reduce((a,p)=>a+p.images.length,0)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Pollachi Places</span><span className="font-bold text-gray-900 dark:text-white">{places.filter(p=>p.region_id===1).length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Palani Places</span><span className="font-bold text-gray-900 dark:text-white">{places.filter(p=>p.region_id===2).length}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALL PLACES */}
        {tab === "places" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">All Places</h1>
                <p className="text-gray-500 text-sm mt-1">{filtered.length} places</p>
              </div>
              <div className="flex gap-3">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..."
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-green-500 w-48 dark:text-white" />
                <button onClick={() => { setTab("add"); setEditId(null); setForm(EMPTY_FORM); }}
                  className="px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
                  ➕ Add Place
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {loading ? (
                <div className="text-center py-16 text-gray-400">Loading…</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                      {["Place","Region","Category","Images","Status","Actions"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-green-100 shrink-0">
                              {p.primary_image
                                ? <Image src={getImageUrl(p.primary_image)} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                                : <div className="w-full h-full bg-gradient-to-br from-green-800 to-green-600" />}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900 dark:text-white">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{p.region_name}</td>
                        <td className="px-5 py-4 text-sm capitalize text-gray-500 dark:text-gray-400">{p.category}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{p.images.length}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.is_featured ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}`}>
                            {p.is_featured ? "⭐ Featured" : "Active"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(p)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 transition-colors">Edit</button>
                            <button onClick={() => handleDelete(p.id, p.name)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-16 text-gray-400">No places found</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ADD / EDIT PLACE */}
        {tab === "add" && (
          <div>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                  {editId ? "✏️ Edit Place" : "➕ Add New Place"}
                </h1>
                {editId && <button onClick={() => { setEditId(null); setForm(EMPTY_FORM); setImgFile(null); setImgPreview(null); }}
                  className="text-sm text-red-500 mt-1 hover:underline">Cancel editing</button>}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Place Name *</label>
                  <input required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                    placeholder="e.g. Monkey Falls"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">URL Slug *</label>
                  <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-filled from name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Region *</label>
                  <select value={form.region_id} onChange={e => setForm({ ...form, region_id: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500">
                    <option value={1}>🌿 Pollachi</option>
                    <option value={2}>🕌 Palani</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500">
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Entry Fee</label>
                  <input value={form.entry_fee} onChange={e => setForm({ ...form, entry_fee: e.target.value })}
                    placeholder="e.g. Rs.30 / Free"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Timings</label>
                  <input value={form.timings} onChange={e => setForm({ ...form, timings: e.target.value })}
                    placeholder="e.g. 06:00 AM - 06:00 PM"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Distance from City</label>
                  <input value={form.distance_from_city} onChange={e => setForm({ ...form, distance_from_city: e.target.value })}
                    placeholder="e.g. 25 km from Pollachi"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Best Time to Visit</label>
                  <input value={form.best_time_to_visit} onChange={e => setForm({ ...form, best_time_to_visit: e.target.value })}
                    placeholder="e.g. October to March"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Latitude (optional)</label>
                  <input type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })}
                    placeholder="e.g. 10.6545"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Short Description *</label>
                  <input required value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })}
                    placeholder="A brief, compelling one-liner about this place..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Full Description</label>
                  <textarea rows={5} value={form.full_description} onChange={e => setForm({ ...form, full_description: e.target.value })}
                    placeholder="Detailed description - history, highlights, visitor tips..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500 resize-none" />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Full Address</label>
                  <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Street, village, district, Tamil Nadu, PIN"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Primary Image {editId ? "(upload to replace)" : ""}
                  </label>
                  <div className="flex gap-4 items-start flex-wrap">
                    <label className="flex-1 min-w-[220px] h-36 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors bg-gray-50 dark:bg-gray-800">
                      <span className="text-3xl mb-2">📷</span>
                      <span className="text-sm font-medium">Click to upload image</span>
                      <span className="text-xs mt-1">JPG, PNG, WebP - max 16 MB</span>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImgChange} className="hidden" />
                    </label>
                    {imgPreview && (
                      <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                        <Image src={imgPreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={() => { setImgFile(null); setImgPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600">x</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {editId && (
                <div className="mt-6">
                  <p className="text-sm font-bold mb-3">Existing Images</p>
                  <div className="flex gap-4 flex-wrap">
                    {places.map((p) => {
                      if (p.id !== editId) return null;
                      return p.images.map((img: any) => (
                        <div key={img.id} className="relative w-32 h-32 border rounded-lg overflow-hidden">
                          <img src={`http://127.0.0.1:5000${img.url}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={async () => {
                            if (!confirm("Delete this image?")) return;
                            await fetch(`http://127.0.0.1:5000/api/upload/delete-image/${img.id}`, { method: "DELETE" });
                            showToast("Image deleted!"); fetchAll();
                          }} className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded">X</button>
                        </div>
                      ));
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="ml-3 text-sm font-semibold text-gray-700 dark:text-gray-300">⭐ Mark as Featured</span>
                </label>
              </div>

              {saveMsg && (
                <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${saveMsg.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {saveMsg}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button type="submit" disabled={saving}
                  className="px-8 py-3 bg-[#c9922a] hover:bg-[#e8b84b] text-white font-semibold rounded-xl transition-all disabled:opacity-60 text-sm">
                  {saving ? "Saving..." : editId ? "Update Place" : "Add Place"}
                </button>
                {editId && (
                  <button type="button" onClick={() => { setEditId(null); setForm(EMPTY_FORM); setImgFile(null); setImgPreview(null); }}
                    className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* GALLERY */}
        {tab === "gallery" && (
          <div>
            <div className="mb-6">
              <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Gallery Manager</h1>
              <p className="text-gray-500 text-sm mt-1">{galleryImages.length} images uploaded</p>
            </div>

            {/* Upload form */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Upload New Image</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Image File *</label>
                  <input ref={gFileRef} type="file" accept="image/*" onChange={e => setGFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Title (optional)</label>
                  <input value={gTitle} onChange={e => setGTitle(e.target.value)} placeholder="e.g. Monkey Falls at sunrise"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tag</label>
                  <input value={gTag} onChange={e => setGTag(e.target.value)} placeholder="e.g. nature, waterfall"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Region</label>
                  <select value={gRegion} onChange={e => setGRegion(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:border-green-500">
                    <option value="1">🌿 Pollachi</option>
                    <option value="2">🕌 Palani</option>
                  </select>
                </div>
              </div>
              <button onClick={handleGalleryUpload}
                className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors text-sm">
                Upload Image
              </button>
            </div>

            {/* ✅ Gallery grid with EDIT button */}
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map(img => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <div className="relative h-48">
                      <Image src={getImageUrl(img.image_url)} alt={img.title || "Gallery"} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{img.title || "Untitled"}</p>
                      {img.tag && <p className="text-xs text-gray-400 mt-0.5">{img.tag}</p>}
                    </div>

                    {/* ✅ Edit + Delete buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => openGalleryEdit(img, e)}
                        className="w-7 h-7 bg-amber-400 text-black rounded-full text-xs font-bold hover:bg-amber-500 flex items-center justify-center"
                        title="Edit"
                      >✏️</button>
                      <button
                        onClick={() => handleGalleryDelete(img.id)}
                        className="w-7 h-7 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 flex items-center justify-center"
                        title="Delete"
                      >x</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🖼️</div>
                <p className="font-medium">No gallery images yet</p>
                <p className="text-sm mt-1">Upload your first image using the form above</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ✅ Gallery Edit Modal */}
      {gEditItem && (
        <div className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-4" onClick={() => setGEditItem(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-5">Edit Image</h3>
            <div className="relative w-full h-40 rounded-xl overflow-hidden mb-5">
              <Image src={getImageUrl(gEditItem.image_url)} alt="" fill className="object-cover" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">Title</label>
                <input
                  type="text"
                  value={gEditTitle}
                  onChange={e => setGEditTitle(e.target.value)}
                  placeholder="e.g. Monkey Falls at sunrise"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">Tag</label>
                <input
                  type="text"
                  value={gEditTag}
                  onChange={e => setGEditTag(e.target.value)}
                  placeholder="e.g. nature, waterfall, temple"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setGEditItem(null)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveGalleryEdit} disabled={gEditSaving}
                className="flex-1 py-2.5 bg-[#1a2e1a] text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                {gEditSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] px-6 py-3 rounded-full text-white text-sm font-semibold shadow-lg transition-all ${
          toast.type === "success" ? "bg-green-600" : "bg-red-500"
        }`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}
