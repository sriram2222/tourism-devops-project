'use client';
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegionCards() {
  return (
    <section className="px-[5%] py-24">
      <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
        <p className="text-xs font-bold tracking-[0.25em] text-green-700 dark:text-green-400 uppercase mb-4">Destinations</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Two Worlds, One Journey</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mb-14">Lush western ghats wilderness meets ancient pilgrimage heritage — just hours apart.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { href:"/pollachi", img:"/images/pollachi/pollachi-banner.jpg", grad:"from-green-950/60", label:"🌿 Nature & Wildlife", name:"Pollachi", desc:"Gateway to Anamalai Tiger Reserve. Waterfalls, misty hill stations, and an ocean of green canopy." },
          { href:"/palani",   img:"/images/palani/palani-banner.jpg",     grad:"from-orange-950/60", label:"🕌 Pilgrimage & Culture", name:"Palani", desc:"Home to the legendary Dhandayuthapani Swamy Temple atop Sivagiri Hill — a sacred summit for millions." },
        ].map((card, i) => (
          <motion.div key={card.name}
            initial={{ opacity:0, x: i===0 ? -30 : 30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.7, delay: i*0.1 }} className="group">
            <Link href={card.href} className="relative block h-[480px] rounded-3xl overflow-hidden">
              <div className={`absolute inset-0 bg-cover bg-center bg-gradient-to-br ${card.grad} transition-transform duration-700 group-hover:scale-105`}
                style={{ backgroundImage:`url('${card.img}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3 block">{card.label}</span>
                <h3 className="font-serif text-4xl font-bold text-white mb-3">{card.name}</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-5 max-w-xs">{card.desc}</p>
                <span className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm group-hover:gap-4 transition-all">Explore {card.name} →</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
