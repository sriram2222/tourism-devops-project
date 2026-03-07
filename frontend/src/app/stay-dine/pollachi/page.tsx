'use client'
import Link from "next/link";
import { FaStar, FaWifi, FaParking, FaSnowflake, FaTv, FaUtensils, FaArrowRight } from "react-icons/fa";

/* ---------------- LODGES ---------------- */
const lodges = [
  { name: "Apple Inn", price: 1200, rating: 4.0, image: "/images/stay-dine/pollachi/appleinn.jpg", slug: "apple-inn", amenities: ["wifi", "parking", "ac", "tv"], tag: "Popular" },
  { name: "Sitaram Lodge", price: 900, rating: 4.5, image: "/images/stay-dine/pollachi/sitaram.jpg", slug: "sitaram-lodge", amenities: ["wifi", "parking", "tv"], tag: "Budget Pick" },
  { name: "ATS Lodge", price: 1500, rating: 4.0, image: "/images/stay-dine/pollachi/ats.jpg", slug: "ats-lodge", amenities: ["wifi", "parking", "ac"], tag: "" },
  { name: "Sakthi Lodge", price: 1300, rating: 4.0, image: "/images/stay-dine/pollachi/sakthi-lodge.jpg", slug: "sakthi-lodge", amenities: ["wifi", "parking", "ac"], tag: "" },
  { name: "Surya Residency", price: 1700, rating: 4.5, image: "/images/stay-dine/pollachi/surya.jpg", slug: "surya-residency", amenities: ["wifi", "parking", "tv"], tag: "Top Rated" },
  { name: "Gowrikrishna Lodge", price: 1400, rating: 4.0, image: "/images/stay-dine/pollachi/gowri.jpg", slug: "gowrikrishna-lodge", amenities: ["wifi", "parking"], tag: "" },
];

/* ---------------- HOTELS ---------------- */
const hotels = [
  { name: "Sri Krishna Residency", rating: 5.0, image: "/images/stay-dine/pollachi/krishna.jpg", slug: "krishna-residency", amenities: ["wifi", "parking", "ac", "tv", "food"], tag: "⭐ Best Stay" },
  { name: "Sakthi Resort", rating: 5.0, image: "/images/stay-dine/pollachi/sakthi-resort.jpg", slug: "sakthi-resort", amenities: ["wifi", "parking", "food", "ac"], tag: "Luxury" },
  { name: "Ratna Square", rating: 4.5, image: "/images/stay-dine/pollachi/ratna.jpg", slug: "ratna-square", amenities: ["wifi", "parking", "ac", "tv"], tag: "" },
  { name: "Annai Hotel", rating: 4.0, image: "/images/stay-dine/pollachi/annai.jpg", slug: "annai-hotel", amenities: ["wifi", "parking", "tv"], tag: "" },
  { name: "SP Hotel", rating: 4.0, image: "/images/stay-dine/pollachi/sp.jpg", slug: "sp-hotel", amenities: ["wifi", "parking", "ac"], tag: "" },
  { name: "Gowrikrishna Hotel", rating: 4.5, image: "/images/stay-dine/pollachi/gowrihotel.jpg", slug: "gowrikrishna-hotel", amenities: ["wifi", "parking", "food"], tag: "" },
];

const amenityIcons: any = {
  wifi: <FaWifi />,
  parking: <FaParking />,
  ac: <FaSnowflake />,
  tv: <FaTv />,
  food: <FaUtensils />,
};

const tagColors: any = {
  "Popular": "bg-blue-500",
  "Budget Pick": "bg-amber-500",
  "Top Rated": "bg-purple-500",
  "⭐ Best Stay": "bg-green-700",
  "Luxury": "bg-rose-500",
};

function HotelCard({ item }: { item: any }) {
  return (
    <Link href={`/stay-dine/details/${item.slug}`}>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 flex flex-col h-full">

        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {item.tag && (
            <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full ${tagColors[item.tag] || "bg-green-700"}`}>
              {item.tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">

          <div className="flex items-start justify-between gap-2 mb-2 min-h-[48px]">
            <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
              {item.name}
            </h3>

            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg shrink-0">
              <FaStar className="text-amber-400 text-xs" />
              <span className="text-amber-700 text-xs font-semibold">{item.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4 min-h-[20px]">
            {item.amenities.map((a: string, i: number) => (
              <span key={i} className="hover:text-green-600 transition-colors">
                {amenityIcons[a]}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-1 text-green-700 text-sm font-semibold group-hover:gap-2 transition-all">
            View Details <FaArrowRight className="text-xs" />
          </div>

        </div>
      </div>
    </Link>
  );
}

export default function PollachStayDine() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-[90px]">
      <div className="px-[5%] py-12 max-w-[1400px] mx-auto">

        {/* LODGES */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">🏠 Lodges in Pollachi</h2>
              <p className="text-gray-500 text-sm mt-1">Budget-friendly stays with great comfort</p>
            </div>
            <span className="text-sm text-gray-400">{lodges.length} properties</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {lodges.map((item, i) => (
              <HotelCard key={i} item={item} />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 mb-14" />

        {/* HOTELS */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">🏨 Hotels in Pollachi</h2>
              <p className="text-gray-500 text-sm mt-1">Premium stays with top-class amenities</p>
            </div>
            <span className="text-sm text-gray-400">{hotels.length} properties</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {hotels.map((item, i) => (
              <HotelCard key={i} item={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}