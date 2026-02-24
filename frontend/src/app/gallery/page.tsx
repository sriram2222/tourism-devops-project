'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { galleryApi } from "@/lib/api";
import { GalleryItem } from "@/types";
import { getImageUrl } from "@/lib/utils";

const FILTERS = ["All", "Pollachi", "Palani", "Nature", "Temple", "Waterfall"];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [images, setImages]             = useState<GalleryItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState<GalleryItem | null>(null);

  // ✅ NEW: Edit state
  const [editItem, setEditItem]         = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle]       = useState("");
  const [editTag, setEditTag]           = useState("");
  const [editSaving, setEditSaving]     = useState(false);

  // ✅ NEW: Delete confirm state
  const [deleteItem, setDeleteItem]     = useState<GalleryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ✅ NEW: Search state
  const [search, setSearch]             = useState("");

  // ✅ NEW: View mode
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");

  // ✅ NEW: Toast notification
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetchImages();
  }, []);

  function fetchImages() {
    setLoading(true);
    galleryApi.getAll()
      .then(r => setImages(r.data))
      .catch(() => showToast("Failed to load images", "error"))
      .finally(() => setLoading(false));
  }

  // Filter + Search
  const filtered = images.filter(img => {
    const matchFilter = activeFilter === "All"
      || img.tag?.toLowerCase().includes(activeFilter.toLowerCase())
      || img.title?.toLowerCase().includes(activeFilter.toLowerCase());
    const matchSearch = search === ""
      || img.title?.toLowerCase().includes(search.toLowerCase())
      || img.tag?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Open edit modal
  function openEdit(img: GalleryItem, e: React.MouseEvent) {
    e.stopPropagation();
    setEditItem(img);
    setEditTitle(img.title || "");
    setEditTag(img.tag || "");
  }

  // Save edit
  async function saveEdit() {
    if (!editItem) return;
    setEditSaving(true);
    try {
      await galleryApi.update(editItem.id, { title: editTitle, tag: editTag });
      setImages(prev => prev.map(img =>
        img.id === editItem.id ? { ...img, title: editTitle, tag: editTag } : img
      ));
      setEditItem(null);
      showToast("Image updated successfully!");
    } catch {
      showToast("Failed to update image", "error");
    } finally {
      setEditSaving(false);
    }
  }

  // Delete image
  async function confirmDelete() {
    if (!deleteItem) return;
    setDeleteLoading(true);
    try {
      await galleryApi.delete(deleteItem.id);
      setImages(prev => prev.filter(img => img.id !== deleteItem.id));
      setDeleteItem(null);
      showToast("Image deleted successfully!");
    } catch {
      showToast("Failed to delete image", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[300px] flex items-end px-[5%] pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-800" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,5,20,0.9), transparent)" }} />
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs text-white/50 mb-3 tracking-widest">HOME / GALLERY</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">
            Gallery — <em className="text-amber-400">Captured Beauty</em>
          </h1>
          <p className="text-white/60 mt-3 text-base">A visual journey through landscapes, temples, wildlife, and waterfalls.</p>
        </motion.div>
      </div>

      <section className="px-[5%] py-16">

        {/* ✅ Search + View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <input
            type="text"
            placeholder="🔍 Search by title or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-green-500 w-full md:w-72"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{filtered.length} images</span>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-sm ${viewMode === "grid" ? "bg-[#1a2e1a] text-white" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >⊞ Grid</button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg text-sm ${viewMode === "list" ? "bg-[#1a2e1a] text-white" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >☰ List</button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all
                ${activeFilter === f
                  ? "bg-[#1a2e1a] text-white border-transparent dark:bg-green-700"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid View */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-lg font-semibold">No images found</p>
            <p className="text-sm mt-2">Try changing the filter or search term</p>
          </div>
        ) : viewMode === "grid" ? (
          <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-5" layout>
            <AnimatePresence>
              {filtered.map((img, i) => (
                <motion.div key={img.id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => setSelected(img)}>
                  <Image src={getImageUrl(img.image_url)} alt={img.title || "Gallery"} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all" />

                  {/* ✅ Edit & Delete buttons on hover */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => openEdit(img, e)}
                      className="w-8 h-8 bg-white text-gray-800 rounded-full text-sm font-bold hover:bg-amber-400 hover:text-white transition-colors flex items-center justify-center"
                      title="Edit"
                    >✏️</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteItem(img); }}
                      className="w-8 h-8 bg-white text-gray-800 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                      title="Delete"
                    >🗑️</button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-semibold text-sm">{img.title || "Untitled"}</p>
                    {img.tag && <span className="px-2 py-0.5 bg-black/60 text-white text-xs rounded-full">{img.tag}</span>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        ) : (
          // ✅ List View
          <div className="flex flex-col gap-3">
            {filtered.map((img) => (
              <div key={img.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-green-200 transition-colors group">
                <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setSelected(img)}>
                  <Image src={getImageUrl(img.image_url)} alt={img.title || "Gallery"} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{img.title || "Untitled"}</p>
                  {img.tag && <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">{img.tag}</span>}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => openEdit(img, e)} className="px-3 py-1.5 text-xs bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 font-semibold">✏️ Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteItem(img); }} className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center mt-10 text-sm text-gray-400">
          Upload photos via the{" "}
          <a href="/admin/dashboard" className="text-green-700 dark:text-green-400 font-semibold hover:underline">Admin Panel</a>
          {" "}— supports JPG, PNG, WebP
        </p>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              <div className="relative w-full h-[80vh]">
                <Image src={getImageUrl(selected.image_url)} alt={selected.title || "Gallery"} fill className="object-contain rounded-2xl" />
              </div>
              {selected.title && <p className="text-white text-center mt-4 text-lg font-semibold">{selected.title}</p>}
              {selected.tag && <p className="text-white/50 text-center text-sm">{selected.tag}</p>}
              {/* ✅ Edit button inside lightbox */}
              <div className="flex justify-center gap-3 mt-4">
                <button onClick={(e) => { setSelected(null); openEdit(selected, e); }}
                  className="px-5 py-2 bg-amber-400 text-black rounded-full text-sm font-bold hover:bg-amber-500">
                  ✏️ Edit This Image
                </button>
              </div>
              <button onClick={() => setSelected(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white text-gray-900 rounded-full font-bold text-xl hover:bg-gray-100">
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Edit Modal */}
      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-4"
            onClick={() => setEditItem(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-5">✏️ Edit Image</h3>

              {/* Preview */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-5">
                <Image src={getImageUrl(editItem.image_url)} alt="" fill className="object-cover" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="e.g. Monkey Falls at sunrise"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">Tag</label>
                  <input
                    type="text"
                    value={editTag}
                    onChange={e => setEditTag(e.target.value)}
                    placeholder="e.g. nature, waterfall, temple"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditItem(null)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button onClick={saveEdit} disabled={editSaving}
                  className="flex-1 py-2.5 bg-[#1a2e1a] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Delete Confirm Modal */}
      <AnimatePresence>
        {deleteItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-4"
            onClick={() => setDeleteItem(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
              onClick={e => e.stopPropagation()}>
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Image?</h3>
              <p className="text-gray-500 text-sm mb-6">
                <strong>{deleteItem.title || "This image"}</strong> will be permanently deleted. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteItem(null)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDelete} disabled={deleteLoading}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                  {deleteLoading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] px-6 py-3 rounded-full text-white text-sm font-semibold shadow-lg ${
              toast.type === "success" ? "bg-green-600" : "bg-red-500"
            }`}>
            {toast.type === "success" ? "✅" : "❌"} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
