import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a2e1a] dark:bg-[#0d1a0d] px-[5%] pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10 mb-8">
        <div>
          <div className="font-serif text-2xl font-bold text-white mb-4">🌿 PP&nbsp;<span className="text-amber-400">Tourism</span></div>
          <p className="text-sm text-white/50 leading-relaxed">
            Discover the untouched beauty of Pollachi and the sacred heritage of Palani in Tamil Nadu.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/35 mb-4">Destinations</h4>
          <div className="flex flex-col gap-2.5">
            {[{href:"/pollachi",l:"Pollachi"},{href:"/palani",l:"Palani"},{href:"/gallery",l:"Gallery"}].map(lk => (
              <Link key={lk.href} href={lk.href} className="text-sm text-white/55 hover:text-amber-400 transition-colors">{lk.l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/35 mb-4">Top Places</h4>
          <div className="flex flex-col gap-2.5">
            {[
              {href:"/place/anamalai-tiger-reserve",l:"Anamalai Tiger Reserve"},
              {href:"/place/monkey-falls",l:"Monkey Falls"},
              {href:"/place/palani-murugan-temple",l:"Palani Temple"},
              {href:"/place/palar-dam",l:"Palar Dam"},
            ].map(lk => (
              <Link key={lk.href} href={lk.href} className="text-sm text-white/55 hover:text-amber-400 transition-colors">{lk.l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/35 mb-4">Admin</h4>
          <div className="flex flex-col gap-2.5">
            {[{href:"/admin/login", l:"Admin Login"}].map(lk => (
                <Link key={lk.href} href={lk.href} className="text-sm text-white/55 hover:text-amber-400 transition-colors">{lk.l}</Link>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <span className="text-xs text-white/30">© 2026 PP Tourism. Next.js 15 · Flask · MySQL</span>
        <span className="text-xs text-white/30">Built for DevOps Portfolio</span>
      </div>
    </footer>
  );
}
