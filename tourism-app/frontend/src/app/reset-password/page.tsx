'use client'

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Reset failed");
      }
    } catch {
      setError("Server error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm mx-4 p-7 rounded-2xl bg-white/95 shadow-2xl backdrop-blur">
      {!success ? (
        <>
          <div className="text-4xl text-center mb-3">🔑</div>
          <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">Reset Password</h2>
          <p className="text-center text-gray-400 text-xs mb-5">Enter your new password</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                ❌ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-60">
              {loading ? "Resetting..." : "Reset Password →"}
            </button>

            <Link href="/login" className="block text-center text-xs text-gray-400 hover:text-gray-600 transition">
              ← Back to Login
            </Link>
          </form>
        </>
      ) : (
        <>
          <div className="text-5xl text-center mb-3">✅</div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Password Reset!</h2>
          <p className="text-center text-gray-400 text-sm">Redirecting to login...</p>
        </>
      )}
    </div>
  );
}

export default function ResetPassword() {
  const backgroundImage = "/images/bg/pollachi.jpeg";
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={backgroundImage} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute inset-0 premiumLight pointer-events-none"></div>
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}