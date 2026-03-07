'use client'
import Link from "next/link";
import { FaStar, FaWifi, FaParking, FaSnowflake, FaTv, FaUtensils, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

const lodges = [
  { name: "Hotel Nakshathra", price: 1200, rating: 4.0, image: "/images/stay-dine/palani/nakshathra.jpg", slug: "hotel-nakshathra", amenities: ["wifi", "parking", "ac", "tv"], tag: "Popular" },
  { name: "Hotel Amoha", price: 1000, rating: 4.0, image: "/images/stay-dine/palani/amoha.jpg", slug: "hotel-amoha", amenities: ["wifi", "parking", "tv"], tag: "" },
  { name: "Velan Temple View", price: 1500, rating: 4.5, image: "/images/stay-dine/palani/velan.jpg", slug: "velan-temple-view", amenities: ["wifi", "parking", "ac"], tag: "Temple View" },
  { name: "Sasti Lodge", price: 800, rating: 4.0, image: "/images/stay-dine/palani/sasti.jpg", slug: "sasti-lodge", amenities: ["wifi", "parking"], tag: "Budget Pick" },
  { name: "Sampath Residency", price: 1300, rating: 4.5, image: "/images/stay-dine/palani/sampath.jpg", slug: "sampath-residency", amenities: ["wifi", "parking", "ac", "tv"], tag: "Top Rated" },
  { name: "Kandhaguru Residency", price: 1400, rating: 4.0, image: "/images/stay-dine/palani/kandhaguru.jpg", slug: "kandhaguru-residency", amenities: ["wifi", "parking", "ac"], tag: "" },
];

const restaurants = [
  { name: "Gowrikrishna Hotel", rating: 4.5, image: "/images/stay-dine/palani/gowrikrishna.jpg", slug: "gowrikrishna-palani", amenities: ["wifi", "parking", "food"], tag: "Best Stay" },
  { name: "Tamizhan Unavagam", rating: 4.0, image: "/images/stay-dine/palani/tamizhan.jpg", slug: "tamizhan-unavagam", amenities: ["food"], tag: "Pure Veg" },
  { name: "Sri Balaji Bhavan", rating: 4.5, image: "/images/stay-dine/palani/balaji.jpg", slug: "sri-balaji-bhavan", amenities: ["food", "parking"], tag: "" },
  { name: "Sri Valli Bhavan Hotel", rating: 4.0, image: "/images/stay-dine/palani/valli.jpg", slug: "sri-valli-bhavan", amenities: ["food", "parking"], tag: "" },
  { name: "Sri Amsavalli Hotel", rating: 4.0, image: "/images/stay-dine/palani/amsavalli.jpg", slug: "sri-amsavalli-hotel", amenities: ["food", "wifi"], tag: "" },
  { name: "SR Pure Veg Restaurant", rating: 4.5, image: "/images/stay-dine/palani/sr.jpg", slug: "sr-pure-veg", amenities: ["food", "parking"], tag: "Pure Veg" },
];

const amenityIcons: any = {
  wifi: <FaWifi title="WiFi" />,
  parking: <FaParking title="Parking" />,
  ac: <FaSnowflake title="AC" />,
  tv: <FaTv title="TV" />,
  food: <FaUtensils title="Restaurant" />,
};

const tagColors: any = {
  "Popular": "bg-blue-500",
  "Budget Pick": "bg-amber-500",
  "Top Rated": "bg-purple-500",
  "Best Stay": "bg-green-700",
  "Temple View": "bg-orange-500",
  "Pure Veg": "bg-green-600",
};

function Card({ item, showPrice }: { item: any, showPrice: boolean }) {
  return (
    <Link href={`/stay-dine/details/${item.slug}`}>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 h-full flex flex-col">
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {item.tag && (
            <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full ${tagColors[item.tag] || "bg-green-700"}`}>
              {item.tag}
            </span>
          )}
          {showPrice && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2.5 py-1">
              <span className="text-green-800 font-bold text-sm">₹{item.price}</span>
              <span className="text-gray-500 text-xs">/night</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-gray-800 text-sm leading-tight flex-1">{item.name}</h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg ml-2 shrink-0">
              <FaStar className="text-amber-400 text-xs" />
              <span className="text-amber-700 text-xs font-semibold">{item.rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3 flex-wrap">
            {item.amenities.map((a: string, i: number) => (
              <span key={i} className="hover:text-green-600 transition-colors">{amenityIcons[a]}</span>
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

export default function PalaniStayDine() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">

      {/* Clean header */}
      <div className="pt-[90px] pb-6 px-[5%] bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <Link href="/" className="hover:text-green-700">Home</Link>
            <span>/</span>
            <Link href="/stay-dine" className="hover:text-green-700">Stay & Dine</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Palani</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Stay & Dine in Palani</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-1">
            <FaMapMarkerAlt className="text-green-700 text-xs" />
            {lodges.length + restaurants.length} properties · Palani, Tamil Nadu
          </p>
        </div>
      </div>

      <div className="px-[5%] py-10 max-w-[1400px] mx-auto">

        {/* LODGES */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">🏠 Lodges in Palani</h2>
              <p className="text-gray-500 text-sm mt-1">Comfortable stays near Palani Temple</p>
            </div>
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{lodges.length} properties</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 items-stretch">
            {lodges.map((item, i) => <Card key={i} item={item} showPrice={true} />)}
          </div>
        </div>

        <div className="border-t border-gray-200 mb-12" />

        {/* HOTELS & RESTAURANTS */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">🍽️ Hotels & Restaurants in Palani</h2>
              <p className="text-gray-500 text-sm mt-1">Pure veg dining near the sacred temple</p>
            </div>
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{restaurants.length} properties</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 items-stretch">
            {restaurants.map((item, i) => <Card key={i} item={item} showPrice={false} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
