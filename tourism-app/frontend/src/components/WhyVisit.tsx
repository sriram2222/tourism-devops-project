'use client';
import { motion } from "framer-motion";

const FEATURES = [
  { icon:"🐯", title:"Wildlife Safaris",    desc:"Jeep safaris inside Anamalai Tiger Reserve — spot tigers, elephants, and leopards." },
  { icon:"💧", title:"Waterfalls",          desc:"Monkey Falls, Palar Dam, and dozens of hidden cascades in the Western Ghats." },
  { icon:"🕌", title:"Sacred Heritage",     desc:"The Palani Murugan Temple draws millions — a deeply spiritual and architectural marvel." },
  { icon:"⛰️", title:"Hill Stations",       desc:"Valparai at 3,500 ft — mist, tea estates, winding hairpin roads, rare wildlife." },
];

export default function WhyVisit() {
  return (
    <section className="bg-[#f0f5f0] dark:bg-[#0a150a] px-[5%] py-24">
      <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-14">
        <p className="text-xs font-bold tracking-[0.25em] text-green-700 dark:text-green-400 uppercase mb-4">Why Visit</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Experiences You'll Never Forget</h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f, i) => (
          <motion.div key={f.title}
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.5, delay: i*0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{f.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
