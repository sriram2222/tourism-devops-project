'use client'
import { useParams } from "next/navigation";
import { useState } from "react";
import jsPDF from "jspdf";
import { FaWifi, FaParking, FaUtensils, FaSnowflake, FaTv, FaStar, FaRegStar, FaMapMarkerAlt, FaUsers, FaMoon, FaCheckCircle, FaDownload } from "react-icons/fa";

export default function HotelDetails() {

  const params: any = useParams();
  const slug = params.slug;

  const hotels: any = {

    // ══════════════════════════════
    // POLLACHI — LODGES
    // ══════════════════════════════
    "apple-inn": { name: "Apple Inn", location: "Pollachi, Tamil Nadu", rating: 4, ac: 2000, nonac: 1200, description: "A comfortable stay in the heart of Pollachi with modern amenities and warm hospitality.", image: "/images/stay-dine/pollachi/appleinn.jpg", amenities: ["wifi", "parking", "ac", "tv"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "sitaram-lodge": { name: "Sitaram Lodge", location: "Pollachi, Tamil Nadu", rating: 4.5, ac: 1500, nonac: 900, description: "Budget-friendly lodge with clean rooms and excellent service near Pollachi market.", image: "/images/stay-dine/pollachi/sitaram.jpg", amenities: ["wifi", "parking", "tv"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "ats-lodge": { name: "ATS Lodge", location: "Pollachi, Tamil Nadu", rating: 4, ac: 1800, nonac: 1200, description: "Cozy and affordable lodging with friendly staff and easy access to local attractions.", image: "/images/stay-dine/pollachi/ats.jpg", amenities: ["wifi", "parking", "ac"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "sakthi-lodge": { name: "Sakthi Lodge", location: "Pollachi, Tamil Nadu", rating: 4, ac: 1700, nonac: 1300, description: "Well-maintained lodge offering comfortable rooms at affordable prices.", image: "/images/stay-dine/pollachi/sakthi-lodge.jpg", amenities: ["wifi", "parking", "ac"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "surya-residency": { name: "Surya Residency", location: "Pollachi, Tamil Nadu", rating: 4.5, ac: 2200, nonac: 1700, description: "Premium residency with spacious rooms and excellent amenities for a relaxing stay.", image: "/images/stay-dine/pollachi/surya.jpg", amenities: ["wifi", "parking", "tv"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "gowrikrishna-lodge": { name: "Gowrikrishna Lodge", location: "Pollachi, Tamil Nadu", rating: 4, ac: 2000, nonac: 1400, description: "Traditional lodging with modern comforts in a central location.", image: "/images/stay-dine/pollachi/gowri.jpg", amenities: ["wifi", "parking"], map: "https://www.google.com/maps?q=pollachi&output=embed" },

    // ══════════════════════════════
    // POLLACHI — HOTELS
    // ══════════════════════════════
    "krishna-residency": { name: "Sri Krishna Residency", location: "Pollachi, Tamil Nadu", rating: 5, ac: 3000, nonac: 2200, description: "5-star hospitality in Pollachi with world-class amenities and breathtaking views.", image: "/images/stay-dine/pollachi/krishna.jpg", amenities: ["wifi", "parking", "ac", "tv", "food"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "sakthi-resort": { name: "Sakthi Resort", location: "Pollachi, Tamil Nadu", rating: 5, ac: 3500, nonac: 2500, description: "Luxury resort surrounded by nature offering an unforgettable experience.", image: "/images/stay-dine/pollachi/sakthi.jpg", amenities: ["wifi", "parking", "food", "ac"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "ratna-square": { name: "Ratna Square", location: "Pollachi, Tamil Nadu", rating: 4.5, ac: 2800, nonac: 1800, description: "Modern hotel with stylish rooms and all necessary comforts for travelers.", image: "/images/stay-dine/pollachi/ratna.jpg", amenities: ["wifi", "parking", "ac", "tv"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "annai-hotel": { name: "Annai Hotel", location: "Pollachi, Tamil Nadu", rating: 4, ac: 2200, nonac: 1500, description: "Family-friendly hotel with homely atmosphere and delicious local cuisine.", image: "/images/stay-dine/pollachi/annai.jpg", amenities: ["wifi", "parking", "tv"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "sp-hotel": { name: "SP Hotel", location: "Pollachi, Tamil Nadu", rating: 4, ac: 2400, nonac: 1700, description: "Contemporary hotel offering comfortable stays with modern facilities.", image: "/images/stay-dine/pollachi/sp.jpg", amenities: ["wifi", "parking", "ac"], map: "https://www.google.com/maps?q=pollachi&output=embed" },
    "gowrikrishna-hotel": { name: "Gowrikrishna Hotel", location: "Pollachi, Tamil Nadu", rating: 4.5, ac: 2600, nonac: 1900, description: "Elegant hotel with excellent dining options and comfortable well-furnished rooms.", image: "/images/stay-dine/pollachi/gowrihotel.jpg", amenities: ["wifi", "parking", "food"], map: "https://www.google.com/maps?q=pollachi&output=embed" },

    // ══════════════════════════════
    // PALANI — LODGES
    // ══════════════════════════════
    "hotel-nakshathra": { name: "Hotel Nakshathra", location: "Palani, Tamil Nadu", rating: 4, ac: 2000, nonac: 1200, description: "A comfortable stay in the heart of Palani with modern amenities and warm hospitality.", image: "/images/stay-dine/palani/nakshathra.jpg", amenities: ["wifi", "parking", "ac", "tv"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "hotel-amoha": { name: "Hotel Amoha", location: "Palani, Tamil Nadu", rating: 4, ac: 1600, nonac: 1000, description: "Clean and cozy rooms with friendly service near Palani town center.", image: "/images/stay-dine/palani/amoha.jpg", amenities: ["wifi", "parking", "tv"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "velan-temple-view": { name: "Velan Temple View", location: "Palani, Tamil Nadu", rating: 4.5, ac: 2200, nonac: 1500, description: "Enjoy a stunning temple view from your room at this premium residency.", image: "/images/stay-dine/palani/velan.jpg", amenities: ["wifi", "parking", "ac"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "sasti-lodge": { name: "Sasti Lodge", location: "Palani, Tamil Nadu", rating: 4, ac: 1200, nonac: 800, description: "Budget-friendly lodge perfect for pilgrims and travelers visiting Palani temple.", image: "/images/stay-dine/palani/sasti.jpg", amenities: ["wifi", "parking"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "sampath-residency": { name: "Sampath Residency", location: "Palani, Tamil Nadu", rating: 4.5, ac: 2000, nonac: 1300, description: "Premium residency offering spacious rooms with all modern comforts.", image: "/images/stay-dine/palani/sampath.jpg", amenities: ["wifi", "parking", "ac", "tv"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "kandhaguru-residency": { name: "Kandhaguru Residency", location: "Palani, Tamil Nadu", rating: 4, ac: 1800, nonac: 1400, description: "Named after Lord Murugan, this residency offers comfortable and peaceful stays.", image: "/images/stay-dine/palani/kandhaguru.jpg", amenities: ["wifi", "parking", "ac"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },

    // ══════════════════════════════
    // PALANI — HOTELS & RESTAURANTS
    // ══════════════════════════════
    "gowrikrishna-palani": { name: "Gowrikrishna Hotel", location: "Palani, Tamil Nadu", rating: 4.5, ac: 2500, nonac: 1800, description: "Elegant hotel with excellent dining options and comfortable well-furnished rooms.", image: "/images/stay-dine/palani/gowrikrishna.jpg", amenities: ["wifi", "parking", "food"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "tamizhan-unavagam": { name: "Tamizhan Unavagam", location: "Palani, Tamil Nadu", rating: 4, ac: 0, nonac: 0, description: "Authentic Tamil Nadu meals served fresh daily near the sacred Palani temple.", image: "/images/stay-dine/palani/tamizhan.jpg", amenities: ["food"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "sri-balaji-bhavan": { name: "Sri Balaji Bhavan", location: "Palani, Tamil Nadu", rating: 4.5, ac: 0, nonac: 0, description: "Pure veg restaurant serving delicious South Indian meals for pilgrims and tourists.", image: "/images/stay-dine/palani/balaji.jpg", amenities: ["food", "parking"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "sri-valli-bhavan": { name: "Sri Valli Bhavan Hotel", location: "Palani, Tamil Nadu", rating: 4, ac: 0, nonac: 0, description: "Tasty and hygienic meals served in a clean, comfortable dining environment.", image: "/images/stay-dine/palani/valli.jpg", amenities: ["food", "parking"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "sri-amsavalli-hotel": { name: "Sri Amsavalli Hotel", location: "Palani, Tamil Nadu", rating: 4, ac: 0, nonac: 0, description: "Popular local eatery known for its traditional recipes and fresh ingredients.", image: "/images/stay-dine/palani/amsavalli.jpg", amenities: ["food", "wifi"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
    "sr-pure-veg": { name: "SR Pure Veg Restaurant", location: "Palani, Tamil Nadu", rating: 4.5, ac: 0, nonac: 0, description: "100% pure veg restaurant offering wholesome meals for devotees and families.", image: "/images/stay-dine/palani/sr.jpg", amenities: ["food", "parking"], map: "https://www.google.com/maps?q=palani+tamil+nadu&output=embed" },
  };

  const hotel = hotels[slug];
  const isRestaurant = hotel && hotel.ac === 0 && hotel.nonac === 0;

  const [roomType, setRoomType] = useState("AC");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [members, setMembers] = useState(1);
  const [total, setTotal] = useState(0);
  const [days, setDays] = useState(0);
  const [status, setStatus] = useState("");
  const [bookingId, setBookingId] = useState("");

  if (!hotel) {
    return <div className="pt-[120px] text-center text-2xl text-gray-500">Hotel not found 😕</div>;
  }

  const calculatePrice = () => {
    if (!checkin || !checkout) { alert("Please select check-in and check-out dates"); return; }
    const d1: any = new Date(checkin);
    const d2: any = new Date(checkout);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    if (diff <= 0) { alert("Check-out must be after check-in"); return; }
    setDays(diff);
    setTotal(diff * (roomType === "AC" ? hotel.ac : hotel.nonac));
  };

  const confirmBooking = async () => {
  if (total === 0) {
    alert("Please calculate price first");
    return;
  }

  const stored = localStorage.getItem("user");
  if (!stored) {
    alert("Please login first");
    return;
  }

  const user = JSON.parse(stored);

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        hotel_name: hotel.name,
        location: hotel.location,
        check_in: checkin,
        check_out: checkout,
        guests: members
      })
    });

    const data = await res.json();

    if (res.ok) {
      const id = "PPB" + Date.now().toString().slice(-8);
      setBookingId(id);
      setStatus("confirmed");
      alert("Booking saved to database ✅");
    } else {
      alert("Booking failed");
      console.log(data);
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

  const downloadPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");

  // ===== Background Card =====
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 0, 210, 297, "F");

  // ===== Main White Card =====
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 20, 180, 250, 6, 6, "F");

  // ===== Header Gradient Style =====
  doc.setFillColor(16, 98, 70);
  doc.roundedRect(15, 20, 180, 40, 6, 6, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("PP Explorer", 25, 42);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Booking Confirmation", 25, 50);

  // Booking ID Badge
  doc.setFillColor(255, 193, 7);
  doc.roundedRect(130, 30, 55, 18, 4, 4, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Booking ID", 142, 38);
  doc.setFontSize(12);
  doc.text(bookingId, 142, 46);

  // ===== Hotel Name Section =====
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(hotel.name, 25, 75);

  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text(hotel.location, 25, 82);

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.line(25, 88, 185, 88);

  // ===== Booking Details Grid Style =====
  const details = [
    ["Room Type", roomType === "AC" ? "AC Room" : "Non-AC Room"],
    ["Check-in", checkin],
    ["Check-out", checkout],
    ["Duration", `${days} Night${days > 1 ? "s" : ""}`],
    ["Guests", `${members} Guest${members > 1 ? "s" : ""}`],
    ["Payment", "Pay at Hotel"],
    ["Booked On", new Date().toLocaleString()],
  ];

  let y = 100;

  details.forEach(([label, value]) => {
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(25, y - 6, 160, 16, 3, 3, "F");

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text(label, 30, y + 2);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(String(value), 110, y + 2);

    y += 22;
  });

  // ===== Total Amount Highlight =====
  doc.setFillColor(232, 245, 233);
  doc.roundedRect(25, y + 5, 160, 28, 5, 5, "F");

  doc.setFontSize(12);
  doc.setTextColor(0, 100, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Total Amount", 30, y + 20);

  doc.setFontSize(20);
  doc.text(`RS. ${total}`, 140, y + 20);

  // ===== Footer =====
  doc.setFillColor(16, 98, 70);
  doc.rect(0, 275, 210, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing PP Explorer ✨", 25, 288);
  doc.text("Pollachi • Palani Tourism Platform", 25, 293);

  doc.save(`PPExplorer_${bookingId}.pdf`);
};

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating)
        ? <FaStar key={i} className="text-amber-400" />
        : <FaRegStar key={i} className="text-amber-400" />
    );

  const amenityConfig: any = {
    wifi: { icon: <FaWifi />, label: "Free WiFi", color: "bg-blue-50 text-blue-700 border-blue-200" },
    parking: { icon: <FaParking />, label: "Parking", color: "bg-gray-50 text-gray-700 border-gray-200" },
    ac: { icon: <FaSnowflake />, label: "AC Rooms", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    tv: { icon: <FaTv />, label: "Smart TV", color: "bg-purple-50 text-purple-700 border-purple-200" },
    food: { icon: <FaUtensils />, label: "Restaurant", color: "bg-orange-50 text-orange-700 border-orange-200" },
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-[80px]">

      {/* Single Hero Image */}
      <div className="relative h-[70vh] md:h-[85vh] min-h-[500px] overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {renderStars(hotel.rating)}
                <span className="text-white/80 text-sm ml-1">{hotel.rating} Rating</span>
              </div>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <FaMapMarkerAlt className="text-amber-400" />
                {hotel.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">

          {/* LEFT */}
          <div className="space-y-8">

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About {hotel.name}</h2>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {!isRestaurant ? (
                  <>
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                      <FaSnowflake className="text-green-700 text-xs" />
                      <span className="text-green-800 text-sm font-semibold">AC Room — ₹{hotel.ac}/night</span>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
                      <FaMoon className="text-amber-600 text-xs" />
                      <span className="text-amber-800 text-sm font-semibold">Non-AC — ₹{hotel.nonac}/night</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2">
                    <FaUtensils className="text-orange-600 text-xs" />
                    <span className="text-orange-800 text-sm font-semibold">Pure Veg Restaurant · {hotel.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((a: any, i: number) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${amenityConfig[a]?.color}`}>
                    <span className="text-base">{amenityConfig[a]?.icon}</span>
                    {amenityConfig[a]?.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-700" /> Location
              </h2>
              <iframe src={hotel.map} className="w-full h-[280px] rounded-xl border border-gray-100" loading="lazy" />
            </div>

          </div>

          {/* RIGHT — BOOKING / RESTAURANT CARD */}
          <div className="lg:sticky lg:top-[90px] h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

              <div className="bg-gradient-to-r from-green-800 to-green-600 p-5">
                <h2 className="text-xl font-bold text-white">
                  {isRestaurant ? "🍽️ Visit Info" : "Book Your Stay"}
                </h2>
                <p className="text-green-200 text-sm mt-1">
                  {isRestaurant ? "Pure veg · Open daily" : "Pay at hotel • Free cancellation"}
                </p>
              </div>

              <div className="p-5 space-y-4">

                {isRestaurant ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center space-y-3">
                    <FaUtensils className="text-orange-500 text-4xl mx-auto" />
                    <p className="font-bold text-gray-800 text-lg">{hotel.name}</p>
                    <p className="text-sm text-gray-500">{hotel.location}</p>
                    <p className="text-sm text-orange-700 font-medium">✅ 100% Pure Vegetarian</p>
                    <p className="text-xs text-gray-400">Visit us for authentic Tamil Nadu meals</p>
                  </div>
                ) : (
                  <>
                    {/* Room type */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Room Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["AC", "Non AC"].map((type) => (
                          <button key={type} onClick={() => { setRoomType(type); setTotal(0); }}
                            className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${roomType === type ? "border-green-600 bg-green-50 text-green-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                            {type === "AC" ? "🧊 AC Room" : "🌀 Non-AC"}
                            <div className="text-xs font-normal mt-0.5">₹{type === "AC" ? hotel.ac : hotel.nonac}/night</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                        <FaUsers className="inline mr-1" /> Guests
                      </label>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => setMembers(Math.max(1, members - 1))}
                          className="w-12 h-11 bg-gray-50 hover:bg-gray-100 text-xl font-bold text-gray-600 transition-colors">−</button>
                        <div className="flex-1 text-center font-semibold text-gray-800">{members} Guest{members > 1 ? "s" : ""}</div>
                        <button onClick={() => setMembers(members + 1)}
                          className="w-12 h-11 bg-gray-50 hover:bg-gray-100 text-xl font-bold text-gray-600 transition-colors">+</button>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Check-in</label>
                        <input type="date" min={today} onChange={(e) => { setCheckin(e.target.value); setTotal(0); }}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Check-out</label>
                        <input type="date" min={checkin || today} onChange={(e) => { setCheckout(e.target.value); setTotal(0); }}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                    </div>

                    <button onClick={calculatePrice}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-colors">
                      Calculate Total Price
                    </button>

                    {total > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹{roomType === "AC" ? hotel.ac : hotel.nonac} × {days} night{days > 1 ? "s" : ""}</span>
                          <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{members} guest{members > 1 ? "s" : ""}</span>
                          <span className="text-green-700">Included</span>
                        </div>
                        <div className="border-t border-green-200 pt-2 flex justify-between font-bold text-green-800">
                          <span>Total</span>
                          <span className="text-xl">₹{total}</span>
                        </div>
                        <p className="text-xs text-gray-500 text-center">💳 Pay at hotel during check-in</p>
                      </div>
                    )}

                    {status !== "confirmed" ? (
                      <button onClick={confirmBooking}
                        className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-sm transition-colors">
                        Confirm Booking
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                          <FaCheckCircle className="text-green-600 text-3xl mx-auto mb-2" />
                          <p className="font-bold text-green-800">Booking Confirmed! 🎉</p>
                          <p className="text-xs text-gray-500 mt-1">Booking ID: <span className="font-mono font-bold text-green-700">{bookingId}</span></p>
                          <p className="text-xs text-gray-500 mt-1">Show this ID at hotel reception</p>
                        </div>
                        <button onClick={downloadPDF}
                          className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                          <FaDownload /> Download Booking Slip (PDF)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
