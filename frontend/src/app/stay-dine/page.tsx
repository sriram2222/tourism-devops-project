'use client'

import Link from "next/link";

export default function StayDine() {
  return (
    <div className="pt-[100px] px-[5%] min-h-screen pb-24">

      {/* Title */}
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-12">
        Stay & Dine
      </h1>

      {/* Two Image Cards */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">

        {/* Pollachi */}
        <Link href="/stay-dine/pollachi"
          className="relative h-[400px] rounded-2xl overflow-hidden group shadow-xl">

          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: "url('/images/stay-dine/pollachi.jpeg')" }}
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

          <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
            <h2 className="font-serif text-3xl font-bold">Pollachi</h2>
            <p className="opacity-90 mb-3">Nature stays & dining</p>
            <span className="bg-green-700 px-4 py-2 rounded-full text-sm w-fit">
              Explore →
            </span>
          </div>
        </Link>

        {/* Palani */}
        <Link href="/stay-dine/palani"
          className="relative h-[400px] rounded-2xl overflow-hidden group shadow-xl">

          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: "url('/images/stay-dine/palani.jpg')" }}
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

          <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
            <h2 className="font-serif text-3xl font-bold">Palani</h2>
            <p className="opacity-90 mb-3">Temple view stays & dining</p>
            <span className="bg-green-700 px-4 py-2 rounded-full text-sm w-fit">
              Explore →
            </span>
          </div>
        </Link>

      </div>
    </div>
  );
}