'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ STATIC IMAGE ONLY (PALANI)
  const backgroundImage = "/images/bg/palani.jpg";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login(username, password);
      console.log("LOGIN RESPONSE:", res.data);
      localStorage.setItem("tourism_token", res.data.access_token);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <img 
        src={backgroundImage}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Premium moving light effect */}
      <div className="absolute inset-0 premiumLight pointer-events-none"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4 p-6 rounded-2xl bg-white/95 shadow-2xl">

        {/* Logo + title */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center text-2xl mx-auto mb-3">
            🌿
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
          <p className="text-gray-400 text-xs mt-1">PP Tourism Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Login ID"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
            />
          </div>

          {error && (
            <div className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#c9922a] hover:bg-[#b8821f] text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

        </form>

        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-red-400">
            ⚠️ Change password after first login
          </p>
        </div>

      </div>
    </div>
  );
}