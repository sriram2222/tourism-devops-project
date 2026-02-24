'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await authApi.login(username, password);
      localStorage.setItem("tourism_token", res.data.access_token);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid username or password");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] dark:bg-[#0d1a0d] px-4 pt-[70px]">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center text-3xl mx-auto mb-5">🌿</div>
            <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Admin Portal</h2>
            <p className="text-gray-400 text-sm mt-1">PP Tourism Management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Login ID"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 text-sm" />
            </div>
            {error && <div className="text-red-600 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 px-4 py-3 rounded-xl">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#c9922a] hover:bg-[#e8b84b] text-white font-semibold rounded-xl transition-all disabled:opacity-60 text-sm">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-red-400 mt-1">⚠️ Change password after first login</p>
          </div>
        </div>
      </div>
    </div>
  );
}
