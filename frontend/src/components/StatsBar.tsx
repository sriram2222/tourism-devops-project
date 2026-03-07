const STATS = [
  { num: "9+",   label: "Must-Visit Places",   icon: "📍" },
  { num: "2",    label: "Unique Regions",       icon: "🗺️" },
  { num: "958",  label: "km² Tiger Reserve",   icon: "🐯" },
  { num: "152m", label: "Palani Hill Height",   icon: "⛰️" },
];

export default function StatsBar() {
  return (
    <div className="bg-[#1a2e1a] dark:bg-[#0d1a0d]">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label}
            className={`py-12 px-8 text-center hover:bg-[#2d4a2d] transition-colors duration-300
              ${i < STATS.length - 1 ? "border-r border-white/10" : ""}`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="font-serif text-4xl font-bold text-amber-400 leading-none">{s.num}</div>
            <div className="text-xs text-white/50 mt-2 tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
