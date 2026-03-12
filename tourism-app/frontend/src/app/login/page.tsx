'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {

  const router = useRouter();

  // ✅ ONLY ONE BACKGROUND (NO CHANGE)
  const backgroundImage = "/images/bg/pollachi.jpeg"; // keep coconut image

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful 🚀");
      router.push("/");
    } else {
      alert(data.error);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch("http://127.0.0.1:5000/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email
        })
      });

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Google login successful 🚀");
      router.push("/");
    } catch (error: any) {
      alert("Google login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <img 
        src={backgroundImage}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* ✨ PREMIUM MOVING LIGHT EFFECT */}
      <div className="absolute inset-0 premiumLight pointer-events-none"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm mx-4 p-7 rounded-2xl bg-white/95 shadow-2xl backdrop-blur">

        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">
          Welcome Back ✨
        </h2>
        <p className="text-center text-gray-400 text-xs mb-5">
          Sign in to PP Explorer
        </p>

        <form onSubmit={handleLogin} className="space-y-3">

          <input
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-green-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-lg text-sm font-semibold transition"
          >
            Login
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg text-sm font-semibold bg-white"
          >
            Continue with Google
          </button>

          <p className="text-center text-xs text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-green-700 font-semibold underline">
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
