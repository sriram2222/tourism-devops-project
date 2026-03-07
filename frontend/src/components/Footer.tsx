import Link from "next/link";
import { FaInstagram, FaLinkedin, FaGithub, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
return ( <footer className="relative bg-[#061106] text-white px-4 md:px-[5%] pt-20 pb-10 overflow-hidden">


  {/* Glow background */}
  <div className="absolute inset-0 opacity-25 pointer-events-none"
    style={{
      background:
        "radial-gradient(circle at 10% 20%, #1a6b30 0%, transparent 40%), radial-gradient(circle at 90% 80%, #c9922a 0%, transparent 40%)"
    }}
  />

  <div className="relative z-10">

    {/* TOP GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14 border-b border-white/10">

      {/* BRAND */}
      <div className="lg:col-span-2">
        <div className="font-serif text-3xl font-bold mb-4">
          🌿 PP <span className="text-amber-400">Explorer</span>
        </div>

        <p className="text-sm text-white/60 leading-relaxed max-w-md">
          Discover the untouched beauty of Pollachi and the sacred heritage of Palani in Tamil Nadu.
          Explore nature, temples, stays and hidden gems with a premium travel experience.
        </p>

        {/* SOCIAL */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">
            Connect with me
          </p>

          <div className="flex gap-3">

            {/* Instagram */}
            <a href="https://www.instagram.com/sriram1100?igsh=MTNwZzZ0N2dueDM4Yw==" target="_blank"
              className="w-11 h-11 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-400 flex items-center justify-center transition">
              <FaInstagram className="text-lg text-pink-400" />
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/sriram-sakthivel-6b3772246/" target="_blank"
              className="w-11 h-11 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400 flex items-center justify-center transition">
              <FaLinkedin className="text-lg text-blue-400" />
            </a>

            {/* X */}
            <a href="https://x.com/SriRam202020" target="_blank"
              className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white flex items-center justify-center transition">
              <FaXTwitter className="text-lg text-white" />
            </a>

            {/* GitHub */}
            <a href="https://github.com/sriram2222" target="_blank"
              className="w-11 h-11 rounded-xl bg-white/5 hover:bg-gray-400/20 border border-white/10 hover:border-white flex items-center justify-center transition">
              <FaGithub className="text-lg text-white" />
            </a>

          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-5">
          Destinations
        </h4>

        <div className="flex flex-col gap-3">
          <Link href="/pollachi" className="text-sm text-white/60 hover:text-amber-400 transition">Pollachi</Link>
          <Link href="/palani" className="text-sm text-white/60 hover:text-amber-400 transition">Palani</Link>
          <Link href="/gallery" className="text-sm text-white/60 hover:text-amber-400 transition">Gallery</Link>
        </div>
      </div>

      {/* TOP PLACES */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-5">
          Top Places
        </h4>

        <div className="flex flex-col gap-3">
          <Link href="/place/anamalai-tiger-reserve" className="text-sm text-white/60 hover:text-amber-400 transition">Anamalai Tiger Reserve</Link>
          <Link href="/place/monkey-falls" className="text-sm text-white/60 hover:text-amber-400 transition">Monkey Falls</Link>
          <Link href="/place/palani-murugan-temple" className="text-sm text-white/60 hover:text-amber-400 transition">Palani Temple</Link>
          <Link href="/place/palar-dam" className="text-sm text-white/60 hover:text-amber-400 transition">Palar Dam</Link>
        </div>
      </div>

      {/* ADMIN */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-5">
          Admin
        </h4>

        <Link href="/admin/login"
          className="text-sm text-white/60 hover:text-amber-400 transition">
          Admin Login
        </Link>
      </div>

    </div>

    {/* BOTTOM */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 text-xs text-white/40">
      <span>© 2026 PP Explorer · All rights reserved</span>
      <span className="text-amber-400">Pollachi & Palani Tourism Platform 🌿</span>
    </div>

  </div>
</footer>


);
}
