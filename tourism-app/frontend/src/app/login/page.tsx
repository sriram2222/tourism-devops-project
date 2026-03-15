'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {

  const router = useRouter();
  const backgroundImage = "/images/bg/pollachi.jpeg";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [googleToken, setGoogleToken] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("tourism_token", data.token);
      alert("Login successful 🚀");
      router.push("/");
    } else {
      alert(data.error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email
        })
      });
      const data = await res.json();
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("tourism_token", data.token);

      if (!data.user.phone) {
        setGoogleToken(data.token);
        setShowPhonePopup(true);
      } else {
        alert("Google login successful 🚀");
        router.push("/");
      }
    } catch (error: any) {
      alert("Google login failed");
    }
  };

  const handleSavePhone = async () => {
    if (!phone) { alert("Please enter phone number"); return; }
    setSavingPhone(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${googleToken}`
        },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (res.ok) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.phone = phone;
        localStorage.setItem("user", JSON.stringify(storedUser));
        setShowPhonePopup(false);
        alert("Google login successful 🚀");
        router.push("/");
      } else {
        alert(data.error || "Failed to save phone");
      }
    } catch {
      alert("Server error");
    } finally {
      setSavingPhone(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <img src={backgroundImage} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute inset-0 premiumLight pointer-events-none"></div>

      {/* ✅ Phone Number Popup */}
      {showPhonePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl">
            <div className="text-4xl text-center mb-3">📱</div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-1">One Last Step!</h3>
            <p className="text-center text-gray-400 text-sm mb-5">
              Please add your phone number to complete your profile
            </p>
            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
            />
            <button
              onClick={handleSavePhone}
              disabled={savingPhone}
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
            >
              {savingPhone ? "Saving..." : "Save & Continue →"}
            </button>
            <button
              onClick={() => { setShowPhonePopup(false); router.push("/"); }}
              className="w-full py-2.5 mt-2 text-gray-400 text-sm hover:text-gray-600 transition"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

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

          {/* ✅ Password with eye toggle */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

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