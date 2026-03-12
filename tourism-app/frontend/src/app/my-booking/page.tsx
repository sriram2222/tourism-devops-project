"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function MyBookings() {
  const [bookings, setBookings]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState<"all" | "upcoming" | "past">("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId]   = useState<number | null>(null);
  const [mounted, setMounted]       = useState(false);
  const router = useRouter();

useEffect(() => {
  setMounted(true);

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    router.push("/login");
    return;
  }

  const token = localStorage.getItem("tourism_token");
  fetch(`/api/my-booking`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setBookings(Array.isArray(data) ? data : []))
    .catch(() => setBookings([]))
    .finally(() => setLoading(false));

}, []);

  const deleteBooking = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== id));
      } else {
        alert("Failed to cancel booking. Try again!");
      }
    } catch {
      alert("Server error. Try again!");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  function isUpcoming(checkIn: string) { return new Date(checkIn) >= new Date(); }
  function nightsBetween(checkIn: string, checkOut: string) {
    return Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000*60*60*24)));
  }
  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  const filtered = bookings.filter(b => {
    if (filter === "upcoming") return isUpcoming(b.check_in);
    if (filter === "past")     return !isUpcoming(b.check_in);
    return true;
  });
  const upcomingCount = bookings.filter(b => isUpcoming(b.check_in)).length;
  const pastCount     = bookings.filter(b => !isUpcoming(b.check_in)).length;

  // ✅ Portal modal — renders at document.body level, perfectly static
  const Modal = mounted && confirmId !== null ? createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) setConfirmId(null); }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
    >
      <div style={{
        background: "white", borderRadius: "20px", padding: "28px",
        maxWidth: "360px", width: "100%",
        boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
        animation: "none",
      }}>
        <div style={{ fontSize: "44px", textAlign: "center", marginBottom: "12px" }}>🗑️</div>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", textAlign: "center", margin: "0 0 8px" }}>
          Cancel Booking?
        </h3>
        <p style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", margin: "0 0 24px", lineHeight: "1.5" }}>
          This will permanently delete this booking.<br />This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setConfirmId(null)}
            style={{
              flex: 1, padding: "11px", borderRadius: "12px",
              border: "1.5px solid #e5e7eb", background: "white",
              color: "#374151", fontWeight: "600", fontSize: "14px", cursor: "pointer",
            }}>
            Keep Booking
          </button>
          <button
            onClick={() => deleteBooking(confirmId!)}
            disabled={deletingId === confirmId}
            style={{
              flex: 1, padding: "11px", borderRadius: "12px", border: "none",
              background: "#dc2626", color: "white",
              fontWeight: "600", fontSize: "14px", cursor: "pointer",
              opacity: deletingId === confirmId ? 0.6 : 1,
            }}>
            {deletingId === confirmId ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="min-h-screen bg-[#f5f7f2] pt-[70px]">

      {Modal}

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#0c1a0e] via-[#1a3a1e] to-[#0f2d15] overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📋</span>
                <h1 className="text-2xl font-bold text-white tracking-tight">My Bookings</h1>
              </div>
              <p className="text-white/40 text-sm">View and manage all your Stay & Dine reservations</p>
            </div>
            <button onClick={() => router.push("/stay-dine")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#c9922a] to-[#e8b84b] text-white font-bold rounded-xl text-sm shadow-lg hover:opacity-90 transition-opacity">
              + New Booking
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-8">
            {[
              { label: "Total",    val: bookings.length,  icon: "🗂️", color: "bg-white/8 border-white/10"              },
              { label: "Upcoming", val: upcomingCount,    icon: "🟢", color: "bg-emerald-500/10 border-emerald-500/20"  },
              { label: "Past",     val: pastCount,        icon: "⏳", color: "bg-white/5 border-white/8"                },
            ].map(s => (
              <div key={s.label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${s.color}`}>
                <span className="text-xl">{s.icon}</span>
                <div>
                  <div className="text-xl font-bold text-white tabular-nums">{loading ? "—" : s.val}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mt-6">
            {(["all","upcoming","past"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2.5 text-sm font-semibold capitalize rounded-t-xl transition-all
                  ${filter === f ? "bg-[#f5f7f2] text-green-800" : "text-white/40 hover:text-white/70"}`}>
                {f === "all" ? "🗂️ All" : f === "upcoming" ? "🟢 Upcoming" : "⏳ Past"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-20">
            <div className="text-6xl mb-4">🏨</div>
            <p className="font-bold text-gray-700 text-lg">
              {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
            </p>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              {filter === "all" ? "Your reservations will appear here" : `You have no ${filter} reservations`}
            </p>
            <button onClick={() => router.push("/stay-dine")}
              className="px-6 py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors">
              Browse Stay & Dine →
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((b) => {
              const nights = nightsBetween(b.check_in, b.check_out);
              const isUp   = isUpcoming(b.check_in);
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="flex flex-col sm:flex-row">

                    <div className={`shrink-0 flex items-center justify-center sm:w-24 py-6 sm:py-0 ${isUp ? "bg-gradient-to-b from-green-700 to-green-900" : "bg-gradient-to-b from-gray-400 to-gray-600"}`}>
                      <div className="text-center">
                        <div className="text-3xl">🏨</div>
                        <div className="text-white text-[10px] font-bold mt-1 opacity-70">{isUp ? "UPCOMING" : "PAST"}</div>
                      </div>
                    </div>

                    <div className="flex-1 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-bold text-gray-900 text-lg">{b.hotel_name}</h2>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isUp ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}>
                              {isUp ? "✓ Confirmed" : "Completed"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">📍 {b.location}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Booking ID</div>
                          <div className="text-xs font-bold font-mono text-gray-600">#{String(b.id).padStart(6,"0")}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        {[
                          { label: "Check-in",  val: formatDate(b.check_in)  },
                          { label: "Check-out", val: formatDate(b.check_out) },
                          { label: "Duration",  val: `${nights} Night${nights>1?"s":""}` },
                          { label: "Guests",    val: `👥 ${b.guests}` },
                        ].map(item => (
                          <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-gray-800">{item.val}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          {b.room_type && (
                            <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full font-semibold">🛏️ {b.room_type}</span>
                          )}
                          {b.total_price && (
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-semibold">
                              Rs.{Number(b.total_price).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                             onClick={() => {
                                  const slug =
                                    b.hotel_slug ||
                                    b.hotel_name?.toLowerCase().replaceAll(" ", "-");

                                  if (slug) {
                                    router.push(`/stay-dine/details/${slug}`);
                                  } else {
                                    router.push("/stay-dine");
                                  }
                                }}
                              className="px-4 py-2 text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition-colors"
                            >
                              View Hotel
                            </button>
                          <button
                            onClick={() => setConfirmId(b.id)}
                            disabled={deletingId === b.id}
                            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1">
                            🗑️ {isUp ? "Cancel" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

