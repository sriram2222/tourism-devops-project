'use client'

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backgroundImage = "/images/bg/pollachi.jpeg";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
      } else {
        setError(data.error || "Failed to send reset link");
      }
    } catch {
      setError("Server error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <img src={backgroundImage} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute inset-0 premiumLight pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-sm mx-4 p-7 rounded-2xl bg-white/95 shadow-2xl backdrop-blur">

        {!sent ? (
          <>
            <div className="text-4xl text-center mb-3">🔐</div>
            <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">
              Forgot Password?
            </h2>
            <p className="text-center text-gray-400 text-xs mb-5">
              Enter your email and we'll send you a reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />

              {error && (
                <div className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link →"}
              </button>

              <Link href="/login"
                className="block text-center text-xs text-gray-400 hover:text-gray-600 transition">
                ← Back to Login
              </Link>
            </form>
          </>
        ) : (
          <>
            <div className="text-5xl text-center mb-3">✅</div>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Email Sent!
            </h2>
            <p className="text-center text-gray-400 text-sm mb-5">
              We've sent a password reset link to<br />
              <span className="font-semibold text-gray-700">{email}</span>
            </p>
            <p className="text-center text-xs text-gray-400 mb-5">
              Check your inbox and follow the instructions
            </p>
            <Link href="/login"
              className="block w-full text-center py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-semibold transition">
              ← Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}