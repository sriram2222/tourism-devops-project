'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Signup() {

  const router = useRouter();

  // 🔥 Only ONE static background
  const background = "/images/bg/pollachi.jpeg";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();

   const res = await fetch("/api/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful 🚀");
      router.push("/login");
    } else {
      alert(data.error);
    }

  const handleGoogleSignup = async () => {
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
      alert("Google Signup successful 🚀");
      router.push("/");
    } catch (error) {
      console.log(error);
      alert("Google signup failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center pt-24"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10 w-full max-w-sm mx-4 p-6 rounded-2xl bg-white/95 shadow-2xl my-6">

        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">
          Create Account ✨
        </h2>
        <p className="text-center text-gray-400 text-xs mb-4">Join PP Explorer today</p>

        <form onSubmit={handleSignup} className="space-y-3">

          <input name="name" placeholder="Full Name" onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />

          <input name="email" type="email" placeholder="Email address" onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />

          <input name="password" type="password" placeholder="Password" onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />

          <input name="phone" placeholder="Phone Number" onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />

          <input name="address" placeholder="Address (Optional)" onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />

          <button type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Create Account
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google signup */}
          <button type="button" onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg text-sm font-semibold bg-white">
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-green-700 font-semibold underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
