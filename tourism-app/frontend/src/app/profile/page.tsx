"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "bookings" | "settings">("profile");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/login"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    setForm({ name: u.name || "", phone: u.phone || "", address: u.address || "" });
  }, []);

 async function handleSave() {
    try {
      const token = localStorage.getItem("tourism_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...user, ...form };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      alert("Server error");
    }
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f2]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
        <p className="text-gray-600 font-medium">Please login to view your profile</p>
        <button onClick={() => router.push("/login")}
          className="mt-4 px-6 py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors">
          Go to Login
        </button>
      </div>
    </div>
  );

  const initials = user.name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f5f7f2] pt-[70px]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-br from-[#0c1a0e] via-[#1a3a1e] to-[#0f2d15] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl" />
        <div className="absolute top-8 left-1/2 w-32 h-32 rounded-full bg-green-400/5 blur-2xl" />

        <div className="relative max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-white/10">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-[#0c1a0e] flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">✓</span>
            </div>
          </div>

          {/* Name & email */}
          <div className="text-center sm:text-left flex-1 pb-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-bold text-white tracking-tight">{user.name}</h1>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">Member</span>
            </div>
            <p className="text-white/50 text-sm mt-0.5">{user.email}</p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 text-center pb-1">
            {[
              { val: "0", label: "Bookings" },
              { val: "2", label: "Regions" },
              { val: "⭐", label: "Member" },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 min-w-[60px]">
                <div className="text-xl font-bold text-white">{s.val}</div>
                <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="relative max-w-5xl mx-auto px-6 flex gap-1">
          {(["profile", "bookings", "settings"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 text-sm font-semibold capitalize rounded-t-xl transition-all border-b-2
                ${activeTab === t
                  ? "bg-[#f5f7f2] text-green-800 border-transparent"
                  : "text-white/40 border-transparent hover:text-white/70"}`}>
              {t === "profile" ? "👤 Profile" : t === "bookings" ? "📋 Bookings" : "⚙️ Settings"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left card */}
            <div className="lg:col-span-1 space-y-5">

              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Contact Info</h3>
                <div className="space-y-4">
                  {[
                    { icon: "✉️", label: "Email",   val: user.email                  },
                    { icon: "📞", label: "Phone",   val: user.phone || "Not added"   },
                    { icon: "📍", label: "Address", val: user.address || "Not added" },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-sm shrink-0 mt-0.5">{item.icon}</div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{item.label}</p>
                        <p className={`text-sm font-medium mt-0.5 truncate ${item.val === "Not added" ? "text-gray-300 italic" : "text-gray-700"}`}>
                          {item.val}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Member since */}
              <div className="bg-gradient-to-br from-[#0c1a0e] to-[#1a3a1e] rounded-2xl p-5 text-white">
                <div className="text-3xl mb-2">🌿</div>
                <div className="text-sm font-bold">PP Explorer Member</div>
                <div className="text-white/40 text-xs mt-1">Pollachi & Palani Tourism</div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/40">Member Since</span>
                  <span className="text-xs font-bold text-amber-400">2025</span>
                </div>
              </div>
            </div>

            {/* Right — edit form / details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Personal Details</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Manage your profile information</p>
                  </div>
                  {!editing ? (
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-bold hover:bg-green-800 transition-colors">
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(false)}
                        className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSave}
                        className="px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-bold hover:bg-green-800 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {saved && (
                    <div className="mb-5 px-4 py-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
                      ✅ Profile updated successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                      {editing ? (
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                      ) : (
                        <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold text-gray-800">
                          {user.name}
                        </div>
                      )}
                    </div>

                    {/* Email — always readonly */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                      <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-400 flex items-center justify-between">
                        <span>{user.email}</span>
                        <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">Verified</span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                      {editing ? (
                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300" />
                      ) : (
                        <div className={`px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold ${user.phone ? "text-gray-800" : "text-gray-300 italic"}`}>
                          {user.phone || "Not added"}
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Address</label>
                      {editing ? (
                        <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                          placeholder="City, State"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300" />
                      ) : (
                        <div className={`px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold ${user.address ? "text-gray-800" : "text-gray-300 italic"}`}>
                          {user.address || "Not added"}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-sm">My Bookings</h3>
              <p className="text-xs text-gray-400 mt-0.5">Your Stay & Dine booking history</p>
            </div>
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-semibold text-gray-600">No bookings yet</p>
              <p className="text-sm text-gray-400 mt-1">Your hotel & lodge bookings will appear here</p>
              <button onClick={() => router.push("/stay-dine")}
                className="mt-5 px-6 py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors">
                Browse Stay & Dine →
              </button>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-sm">Account Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { icon:"🔔", label:"Push Notifications",  sub:"Get updates on bookings",       toggle: true  },
                  { icon:"📧", label:"Email Alerts",        sub:"Receive booking confirmations",  toggle: true  },
                  { icon:"🌙", label:"Dark Mode",           sub:"Switch to dark theme",           toggle: false },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-base">{s.icon}</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                        <p className="text-xs text-gray-400">{s.sub}</p>
                      </div>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${s.toggle ? "bg-green-600" : "bg-gray-200"}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${s.toggle ? "left-5" : "left-0.5"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-red-50 bg-red-50/30">
                <h3 className="font-bold text-red-600 text-sm">Danger Zone</h3>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Delete Account</p>
                  <p className="text-xs text-gray-400 mt-0.5">Permanently remove your account and all data</p>
                </div>
                <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>

            {/* Logout */}
            <button onClick={() => { localStorage.clear(); router.push("/"); }}
              className="w-full py-3.5 bg-[#0c1a0e] text-white rounded-2xl font-semibold text-sm hover:bg-green-900 transition-colors shadow-sm">
              🚪 Logout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
