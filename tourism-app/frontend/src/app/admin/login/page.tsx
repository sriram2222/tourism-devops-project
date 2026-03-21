'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const backgroundImage = "/images/bg/palani.jpg";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login(username, password);
      console.log("LOGIN RESPONSE:", res.data);
      localStorage.setItem("admin_token", res.data.access_token);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <img
        src={backgroundImage}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute inset-0 premiumLight pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-sm mx-4 p-6 rounded-2xl bg-white/95 shadow-2xl">

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
            {/* ✅ Password with eye toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
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