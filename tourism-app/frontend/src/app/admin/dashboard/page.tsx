'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { placesApi, galleryApi, uploadApi } from "@/lib/api";
import { Place } from "@/types";
import { getImageUrl, slugify } from "@/lib/utils";
import api from "@/lib/api";

type Tab = "dashboard" | "places" | "gallery" | "add" | "bookings";
const CATEGORIES = ["nature","temple","waterfall","dam","viewpoint","market","other"];
const EMPTY_FORM = {
  name:"", slug:"", region_id:1, category:"nature",
  short_description:"", full_description:"", address:"",
  latitude:"", longitude:"", entry_fee:"", timings:"",
  best_time_to_visit:"", distance_from_city:"", is_featured: false,
  
};

export default function AdminDashboard() {
  const router                        = useRouter();
  const [tab, setTab]                 = useState<any>("dashboard");
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
  const fileRef                       = useRef<HTMLInputElement>(null);
  const gFileRef                      = useRef<HTMLInputElement>(null);
  const [gEditItem, setGEditItem]     = useState<any|null>(null);
  const [gEditTitle, setGEditTitle]   = useState("");
  const [gEditTag, setGEditTag]       = useState("");
  const [gEditSaving, setGEditSaving] = useState(false);
  const [toast, setToast]             = useState<{msg:string; type:"success"|"error"}|null>(null);
  const [collapsed, setCollapsed]     = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

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
    const [p, g, b] = await Promise.all([
      placesApi.getAll(),
      galleryApi.getAll(),
      api.get("/admin/bookings")
    ]);

    const bookingsData = b.data;

    setPlaces(p.data);
    setGallery(g.data);

    setBookings(bookingsData.bookings || []);
    setTotalRevenue(bookingsData.total_revenue || 0);
    setTotalBookings(bookingsData.total_bookings || 0);

  } catch (err) {
    console.log("Fetch error:", err);
  } finally {
    setLoading(false);
  }
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
    showToast(`"${name}" deleted`);
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
    fetchAll(); showToast("Image uploaded!");
  }

  async function handleGalleryDelete(id: number) {
    if (!confirm("Delete this image?")) return;
    await galleryApi.delete(id); fetchAll(); showToast("Image deleted!");
  }

  function openGalleryEdit(img: any, e: React.MouseEvent) {
    e.stopPropagation();
    setGEditItem(img); setGEditTitle(img.title || ""); setGEditTag(img.tag || "");
  }

  async function saveGalleryEdit() {
    if (!gEditItem) return;
    setGEditSaving(true);
    try {
      await galleryApi.update(gEditItem.id, { title: gEditTitle, tag: gEditTag });
      setGallery(prev => prev.map(img => img.id === gEditItem.id ? { ...img, title: gEditTitle, tag: gEditTag } : img));
      setGEditItem(null); showToast("Image updated!");
    } catch { showToast("Failed to update", "error"); }
    finally { setGEditSaving(false); }
  }

  const filtered = places.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const inp = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400";

  const NAV = [
    { t:"dashboard", icon:"⬛", emoji:"📊", label:"Dashboard"                        },
    { t:"places",    icon:"◉",  emoji:"📍", label:"All Places"                        },
    { t:"gallery",   icon:"⬜", emoji:"🖼️", label:"Gallery"                           },
    { t:"bookings", emoji:"📅", label:"Hotel Bookings" },
    { t:"add",       icon:"⊕",  emoji:"➕", label: editId ? "Edit Place" : "Add Place"},
  ] as const;

  const stats = [
    { label:"Total Places",   val: places.length,                           icon:"📍", color:"from-green-600 to-green-800",   light:"bg-green-50 text-green-700"  },
    { label:"Featured",       val: places.filter(p=>p.is_featured).length,  icon:"⭐", color:"from-amber-500 to-amber-700",   light:"bg-amber-50 text-amber-700"  },
    { label:"Pollachi",       val: places.filter(p=>p.region_id===1).length,icon:"🌿", color:"from-emerald-600 to-teal-700",  light:"bg-emerald-50 text-emerald-700"},
    { label:"Palani",         val: places.filter(p=>p.region_id===2).length,icon:"🕌", color:"from-orange-500 to-red-600",    light:"bg-orange-50 text-orange-700"},
  ];

  return (
    <div className="flex min-h-screen pt-[70px] bg-[#f4f6f8]" style={{fontFamily:"'Inter','Segoe UI',sans-serif"}}>

      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside style={{width: collapsed ? 72 : 240, transition:"width 0.25s ease"}}
        className="shrink-0 bg-[#0c1a0e] sticky top-[70px] h-[calc(100vh-70px)] flex flex-col overflow-hidden z-20 shadow-2xl">

        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-base shadow">🌿</div>
              <div>
                <div className="text-white text-sm font-bold leading-tight">PP Tourism</div>
                <div className="text-white/30 text-[10px]">Admin Panel</div>
              </div>
            </div>
          )}
          {collapsed && <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-base">🌿</div>}
          <button onClick={() => setCollapsed(!collapsed)}
            className="text-white/30 hover:text-white/70 transition-colors ml-auto p-1 rounded-lg hover:bg-white/5"
            title="Toggle sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {!collapsed && <p className="px-4 text-[9px] font-bold tracking-[0.2em] text-white/20 uppercase mb-1.5 mt-1">Management</p>}

          {NAV.map(n => (
            <button key={n.t} onClick={() => setTab(n.t as Tab)} title={collapsed ? n.label : ""}
              className={`relative flex items-center w-full transition-all duration-150
                ${collapsed ? "justify-center px-0 py-3.5" : "gap-3 px-4 py-2.5"}
                ${tab === n.t
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/75 hover:bg-white/5"}`}>
              {/* Active indicator */}
              {tab === n.t && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-400 rounded-r" />}
              <span className={`text-base transition-all ${tab === n.t ? "scale-110" : ""}`}>{n.emoji}</span>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium">{n.label}</span>
                  {n.t === "add" && editId && (
                    <span className="ml-auto text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold tracking-wide">EDIT</span>
                  )}
                </>
              )}
            </button>
          ))}

          {!collapsed && <p className="px-4 text-[9px] font-bold tracking-[0.2em] text-white/20 uppercase mb-1.5 mt-5">View Site</p>}
          {collapsed && <div className="mx-4 border-t border-white/10 my-3" />}

          {[{h:"/",e:"🏠",l:"Home"},{h:"/pollachi",e:"🌿",l:"Pollachi"},{h:"/palani",e:"🕌",l:"Palani"},{h:"/gallery",e:"🖼️",l:"Gallery"}].map(lk => (
            <a key={lk.h} href={lk.h} target="_blank" title={collapsed ? lk.l : ""}
              className={`flex items-center transition-all text-white/25 hover:text-white/60 hover:bg-white/5
                ${collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-4 py-2"}`}>
              <span className="text-sm">{lk.e}</span>
              {!collapsed && <span className="text-xs">{lk.l}</span>}
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className={`border-t border-white/10 ${collapsed ? "py-3 flex justify-center" : "px-4 py-4"}`}>
          <button onClick={() => { localStorage.removeItem("tourism_token"); router.push("/admin/login"); }}
            title={collapsed ? "Logout" : ""}
            className={`flex items-center gap-2 text-red-400/60 hover:text-red-400 transition-colors text-sm ${collapsed ? "" : "w-full"}`}>
            <span>🚪</span>
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* ═══════════ MAIN ═══════════ */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* Topbar */}
        <div className="sticky top-[70px] z-10 bg-white/90 backdrop-blur-md border-b border-gray-200/60 px-8 py-3.5 flex items-center gap-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400">Admin</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-semibold capitalize">{tab === "add" && editId ? "Edit Place" : tab}</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">A</div>
        </div>

        <div className="p-8 flex-1">

          {/* ══ DASHBOARD ══ */}
          {tab === "dashboard" && (
            <div className="space-y-7">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-0.5">Pollachi & Palani Tourism CMS</p>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${s.light} transition-transform group-hover:scale-110`}>{s.icon}</div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900 tabular-nums leading-tight">{loading ? "—" : s.val}</div>
                        <div className="text-xs text-gray-400 mt-0.5 font-medium">{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Quick actions */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { e:"➕", label:"Add a new place",      sub:"Create new place entry",     bg:"hover:bg-green-50 hover:border-green-200",  onClick:()=>{ setTab("add"); setEditId(null); setForm(EMPTY_FORM); } },
                      { e:"🖼️", label:"Upload gallery images", sub:"Add photos to the gallery",  bg:"hover:bg-violet-50 hover:border-violet-200",onClick:()=>setTab("gallery") },
                      { e:"📝", label:"Browse all places",     sub:"View, edit, delete entries", bg:"hover:bg-sky-50 hover:border-sky-200",      onClick:()=>setTab("places") },
                    ].map(a => (
                      <button key={a.label} onClick={a.onClick}
                        className={`w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-xl border border-transparent transition-all ${a.bg} group`}>
                        <span className="text-xl w-8 text-center">{a.e}</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{a.label}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{a.sub}</div>
                        </div>
                        <span className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats panel */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Statistics</h3>
                  <div className="space-y-3">
                    {[
                      { label:"Gallery Images",     val: galleryImages.length,                           max:20 },
                      { label:"Featured Places",    val: places.filter(p=>p.is_featured).length,         max:places.length||1 },
                      { label:"Total Place Images", val: places.reduce((a,p)=>a+p.images.length,0),      max:50 },
                      { label:"Pollachi Places",    val: places.filter(p=>p.region_id===1).length,       max:places.length||1 },
                      { label:"Palani Places",      val: places.filter(p=>p.region_id===2).length,       max:places.length||1 },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-32 truncate">{s.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5 rounded-full transition-all duration-700"
                            style={{width:`${Math.min(100,Math.round((s.val/s.max)*100))}%`}} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-5 text-right tabular-nums">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ ALL PLACES ══ */}
          {tab === "places" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">All Places</h1>
                  <p className="text-gray-400 text-sm mt-0.5">{filtered.length} properties</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search places..."
                      className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 w-52 shadow-sm" />
                  </div>
                  <button onClick={() => { setTab("add"); setEditId(null); setForm(EMPTY_FORM); }}
                    className="px-5 py-2.5 bg-[#0c1a0e] text-white rounded-xl text-sm font-semibold hover:bg-green-900 transition-colors shadow-sm">
                    + Add Place
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                  <div className="py-20 text-center">
                    <div className="text-4xl mb-3 animate-pulse">📍</div>
                    <p className="text-gray-400 text-sm">Loading places...</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70">
                        {["Place","Region","Category","Images","Status","Actions"].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-green-100 shrink-0 ring-1 ring-gray-100 shadow-sm">
                                {p.primary_image
                                  ? <Image src={getImageUrl(p.primary_image)} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                                  : <div className="w-full h-full bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-white text-xs">🌿</div>}
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{p.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{p.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.region_name === "Pollachi" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-orange-50 text-orange-700 border border-orange-100"}`}>
                              {p.region_name === "Pollachi" ? "🌿" : "🕌"} {p.region_name}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-sm capitalize text-gray-500">{p.category}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <div className="flex -space-x-1">
                                {p.images.slice(0,3).map((img: any, i: number) => (
                                  <div key={i} className="w-5 h-5 rounded-full overflow-hidden border border-white ring-1 ring-gray-100">
                                    <img src={getImageUrl(img.url)} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{p.images.length}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${p.is_featured ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}>
                              {p.is_featured ? "⭐ Featured" : "Active"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEdit(p)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 border border-green-100 transition-colors">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(p.id, p.name)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-16 text-gray-400">
                          <div className="text-4xl mb-3">🔍</div>
                          <p className="font-medium">No places found</p>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══ ADD / EDIT ══ */}
          {tab === "add" && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{editId ? "Edit Place" : "Add New Place"}</h1>
                  <p className="text-gray-400 text-sm mt-0.5">{editId ? "Update place details below" : "Fill in details to add a new place"}</p>
                </div>
                {editId && (
                  <button onClick={() => { setEditId(null); setForm(EMPTY_FORM); setImgFile(null); setImgPreview(null); }}
                    className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
                    ✕ Cancel Edit
                  </button>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Form header */}
                <div className="bg-gradient-to-r from-[#0c1a0e] to-[#1a3a1e] px-7 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base">📝</div>
                  <div>
                    <div className="text-white text-sm font-semibold">{editId ? "Editing: " + form.name : "New Place"}</div>
                    <div className="text-white/40 text-xs">All fields marked * are required</div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Place Name *</label>
                      <input required value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                        placeholder="e.g. Monkey Falls" className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">URL Slug *</label>
                      <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                        placeholder="auto-filled from name" className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Region *</label>
                      <select value={form.region_id} onChange={e => setForm({ ...form, region_id: Number(e.target.value) })} className={inp}>
                        <option value={1}>🌿 Pollachi</option>
                        <option value={2}>🕌 Palani</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inp}>
                        {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Entry Fee</label>
                      <input value={form.entry_fee} onChange={e => setForm({ ...form, entry_fee: e.target.value })}
                        placeholder="e.g. Rs.30 / Free" className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Timings</label>
                      <input value={form.timings} onChange={e => setForm({ ...form, timings: e.target.value })}
                        placeholder="06:00 AM – 06:00 PM" className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Distance from City</label>
                      <input value={form.distance_from_city} onChange={e => setForm({ ...form, distance_from_city: e.target.value })}
                        placeholder="e.g. 25 km from Pollachi" className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Best Time to Visit</label>
                      <input value={form.best_time_to_visit} onChange={e => setForm({ ...form, best_time_to_visit: e.target.value })}
                        placeholder="e.g. October to March" className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Latitude</label>
                      <input type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })}
                        placeholder="e.g. 10.6545" className={inp} />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Short Description *</label>
                      <input required value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })}
                        placeholder="A compelling one-liner about this place..." className={inp} />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Description</label>
                      <textarea rows={5} value={form.full_description} onChange={e => setForm({ ...form, full_description: e.target.value })}
                        placeholder="Detailed description — history, highlights, visitor tips..."
                        className={`${inp} resize-none`} />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Address</label>
                      <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                        placeholder="Street, village, district, Tamil Nadu, PIN" className={inp} />
                    </div>

                    {/* Image upload */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Primary Image {editId ? "(upload to replace)" : ""}
                      </label>
                      <div className="flex gap-4 items-start flex-wrap">
                        <label className="flex-1 min-w-[200px] h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:border-green-400 hover:bg-green-50/20 hover:text-green-600 transition-all bg-gray-50/50">
                          <span className="text-2xl mb-1.5">📷</span>
                          <span className="text-sm font-medium">Click to upload</span>
                          <span className="text-xs mt-0.5 text-gray-300">JPG, PNG, WebP · max 16MB</span>
                          <input ref={fileRef} type="file" accept="image/*" onChange={handleImgChange} className="hidden" />
                        </label>
                        {imgPreview && (
                          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                            <Image src={imgPreview} alt="Preview" fill className="object-cover" />
                            <button type="button"
                              onClick={() => { setImgFile(null); setImgPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 flex items-center justify-center shadow">×</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Existing images */}
                  {editId && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Existing Images</p>
                      <div className="flex gap-3 flex-wrap">
                        {places.find(p => p.id === editId)?.images.map((img: any) => (
                          <div key={img.id} className="relative w-24 h-24 rounded-xl overflow-hidden ring-1 ring-gray-100 shadow-sm group">
                            <img src={getImageUrl(img.url)} className="w-full h-full object-cover" />
                            <button type="button" onClick={async () => {
                              if (!confirm("Delete image?")) return;
                              await api.delete(`/upload/delete-image/${img.id}`);
                              showToast("Deleted!"); fetchAll();
                            }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured toggle */}
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 after:shadow-sm" />
                      <span className="ml-3 text-sm font-semibold text-gray-700">⭐ Mark as Featured</span>
                    </label>
                  </div>

                  {saveMsg && (
                    <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${saveMsg.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                      {saveMsg}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button type="submit" disabled={saving}
                      className="px-7 py-3 bg-[#c9922a] hover:bg-[#b8821f] text-white font-semibold rounded-xl transition-all disabled:opacity-60 text-sm shadow-sm">
                      {saving ? "Saving..." : editId ? "Update Place" : "Add Place →"}
                    </button>
                    {editId && (
                      <button type="button" onClick={() => { setEditId(null); setForm(EMPTY_FORM); setImgFile(null); setImgPreview(null); }}
                        className="px-5 py-3 border border-gray-200 text-gray-500 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

           {/* ══ BOOKINGS ══ */}
{tab === "bookings" && (
  <div className="space-y-6">

    {/* Title */}
    <div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hotel Bookings</h1>
      <p className="text-gray-400 text-sm mt-1">
        {totalBookings} total bookings
      </p>
    </div>

    {/* Table */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📅</div>
          <p>No bookings found</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["User","Phone","Hotel","Location","Check In","Check Out","Guests"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {bookings.map((b:any) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">

                <td className="px-5 py-3 font-semibold">
                  {b.user_name}
                </td>

                <td className="px-5 py-3 text-sm">
                  {b.phone}
                </td>

                <td className="px-5 py-3 font-semibold">
                  {b.hotel_name}
                </td>

                <td className="px-5 py-3">
                  {b.location}
                </td>

                <td className="px-5 py-3">
                  {b.check_in}
                </td>

                <td className="px-5 py-3">
                  {b.check_out}
                </td>

                <td className="px-5 py-3">
                  {b.guests}
                </td>


                <td className="px-5 py-3">
                  <button
                    onClick={async () => {
                      if (!confirm("Cancel this booking?")) return;
                      await api.delete(`/bookings/${b.id}`);
                      fetchAll();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                  >
                    Cancel
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

  </div>
  
)}


          {/* ══ GALLERY ══ */}
          {tab === "gallery" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gallery Manager</h1>
                <p className="text-gray-400 text-sm mt-0.5">{galleryImages.length} images total</p>
              </div>


              {/* Upload card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-violet-900 to-purple-800 px-7 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">🖼️</div>
                  <div>
                    <div className="text-white text-sm font-semibold">Upload New Image</div>
                    <div className="text-white/40 text-xs">Add to gallery collection</div>
                  </div>
                </div>
                <div className="p-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    <div className="lg:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Image File *</label>
                      <input ref={gFileRef} type="file" accept="image/*" onChange={e => setGFile(e.target.files?.[0] || null)}
                        className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Title</label>
                      <input value={gTitle} onChange={e => setGTitle(e.target.value)} placeholder="Image title..." className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tag</label>
                      <input value={gTag} onChange={e => setGTag(e.target.value)} placeholder="nature, waterfall..." className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Region</label>
                      <select value={gRegion} onChange={e => setGRegion(e.target.value)} className={inp}>
                        <option value="1">🌿 Pollachi</option>
                        <option value="2">🕌 Palani</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleGalleryUpload}
                    className="px-6 py-2.5 bg-[#0c1a0e] text-white font-semibold rounded-xl hover:bg-green-900 transition-colors text-sm shadow-sm">
                    Upload Image →
                  </button>
                </div>
              </div>

              {/* Gallery grid */}
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {galleryImages.map(img => (
                    <div key={img.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
                      <div className="relative h-44 bg-gray-100">
                        <Image src={getImageUrl(img.image_url)} alt={img.title || "Gallery"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-800 truncate">{img.title || "Untitled"}</p>
                        {img.tag && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">{img.tag}</span>}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                        <button onClick={e => openGalleryEdit(img, e)}
                          className="w-7 h-7 bg-amber-400 hover:bg-amber-500 text-black rounded-full text-xs flex items-center justify-center shadow-md font-bold">✏️</button>
                        <button onClick={() => handleGalleryDelete(img.id)}
                          className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full text-base flex items-center justify-center shadow-md font-bold">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-24">
                  <div className="text-5xl mb-4">🖼️</div>
                  <p className="font-semibold text-gray-600">No images yet</p>
                  <p className="text-sm text-gray-400 mt-1">Upload your first image above</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Gallery Edit Modal */}
      {gEditItem && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setGEditItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#0c1a0e] to-[#1a3a1e] px-6 py-4 flex items-center justify-between">
              <div className="text-white font-semibold text-sm">Edit Image</div>
              <button onClick={() => setGEditItem(null)} className="text-white/40 hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="p-6">
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-5 bg-gray-100">
                <Image src={getImageUrl(gEditItem.image_url)} alt="" fill className="object-cover" />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Title</label>
                  <input value={gEditTitle} onChange={e => setGEditTitle(e.target.value)} placeholder="Image title..." className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tag</label>
                  <input value={gEditTag} onChange={e => setGEditTag(e.target.value)} placeholder="nature, temple..." className={inp} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setGEditItem(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={saveGalleryEdit} disabled={gEditSaving}
                  className="flex-1 py-2.5 bg-[#0c1a0e] text-white rounded-xl text-sm font-semibold hover:bg-green-900 disabled:opacity-50 transition-colors">
                  {gEditSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] px-6 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl flex items-center gap-2 backdrop-blur border transition-all
          ${toast.type === "success" ? "bg-green-800/95 border-green-700" : "bg-red-600/95 border-red-500"}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}
