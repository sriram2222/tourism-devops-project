from app import create_app, db
from app.models import AdminUser, Region, Place
import bcrypt

app = create_app()

def seed():
    if not AdminUser.query.first():
        admin = AdminUser(username="admin",
            password_hash=bcrypt.hashpw(b"Admin@123", bcrypt.gensalt()).decode())
        db.session.add(admin)
        

    if not Region.query.first():
        pollachi = Region(name="Pollachi", slug="pollachi",
            description="Gateway to Anamalai Tiger Reserve — lush greenery, waterfalls, natural beauty.")
        palani   = Region(name="Palani",   slug="palani",
            description="Sacred pilgrimage town — home to Arulmigu Dhandayuthapani Swamy Temple.")
        db.session.add_all([pollachi, palani])
        db.session.flush()

        pid = pollachi.id
        qid = palani.id

        places = [
            Place(region_id=pid, name="Anamalai Tiger Reserve", slug="anamalai-tiger-reserve",
                category="nature", is_featured=True,
                short_description="A wildlife sanctuary home to tigers, elephants, leopards spanning 958 sq km.",
                full_description="The Anamalai Tiger Reserve spans over 958 sq km and is one of the finest biodiversity hotspots in South India. It supports tigers, Asian elephants, leopards, gaur, and over 300 bird species. The reserve offers jeep safaris, elephant rides, and trekking through dense shola forests and grasslands.",
                address="Forest Office, Anamalai, Pollachi, Tamil Nadu 642104",
                latitude=10.3750, longitude=76.9700, entry_fee="₹30 (Indian) / ₹250 (Foreigner)",
                timings="06:00 AM - 06:00 PM", best_time_to_visit="October to March",
                distance_from_city="25 km from Pollachi"),
            Place(region_id=pid, name="Monkey Falls", slug="monkey-falls",
                category="waterfall", is_featured=True,
                short_description="A scenic waterfall surrounded by dense forest, perfect for a refreshing dip.",
                full_description="Monkey Falls is on the Pollachi-Palani Highway, cascading through rocky terrain amidst thick forest, creating a natural pool ideal for swimming. Named after the monkeys that frequent the area, it is a popular weekend getaway.",
                address="Pollachi-Palani Highway, Tamil Nadu 642109",
                latitude=10.4100, longitude=76.9500, entry_fee="Free",
                timings="06:00 AM - 06:00 PM", best_time_to_visit="July to February",
                distance_from_city="25 km from Pollachi"),
            Place(region_id=pid, name="Valparai", slug="valparai",
                category="viewpoint", is_featured=True,
                short_description="A stunning hill station at 3,500 ft with sprawling tea and coffee estates.",
                full_description="Valparai is at 3,500 feet in the Anamalai Hills. Known for vast tea and coffee plantations, misty roads, and the endangered Lion-tailed Macaque. The 40 hairpin bends leading up are an adventure themselves.",
                address="Valparai, Coimbatore District, Tamil Nadu 642127",
                latitude=10.3269, longitude=76.9516, entry_fee="Free",
                timings="24 hours", best_time_to_visit="September to February",
                distance_from_city="65 km from Pollachi"),
            Place(region_id=pid, name="Top Slip", slug="top-slip",
                category="nature", is_featured=False,
                short_description="Base camp of Anamalai Tiger Reserve — entry for safaris, elephant rides, and trekking.",
                full_description="Top Slip is the main entry point for Anamalai Tiger Reserve, set amidst dense forests at 750 meters. It offers jeep safaris, elephant rides, and guided treks, plus a mini zoo, crocodile park, and orchidarium.",
                address="Top Slip, Anamalai, Pollachi, Tamil Nadu 642104",
                latitude=10.3956, longitude=76.9688, entry_fee="₹50 entry + safari charges",
                timings="06:00 AM - 06:00 PM", best_time_to_visit="November to May",
                distance_from_city="32 km from Pollachi"),
            Place(region_id=pid, name="Pollachi Market", slug="pollachi-market",
                category="market", is_featured=False,
                short_description="One of Asia's largest coconut, vegetable and flower wholesale markets.",
                full_description="Pollachi is renowned for being one of the largest wholesale markets for coconut, vegetables, and flowers in Asia. The bazaar is a bustling hub where farmers from across Tamil Nadu sell their produce. It comes alive in the early morning hours.",
                address="Pollachi Main Market, Pollachi, Tamil Nadu 642001",
                latitude=10.6545, longitude=77.0071, entry_fee="Free",
                timings="05:00 AM - 08:00 PM", best_time_to_visit="Year round",
                distance_from_city="City center"),
            Place(region_id=qid, name="Palani Murugan Temple", slug="palani-murugan-temple",
                category="temple", is_featured=True,
                short_description="One of the six abodes of Lord Murugan, atop the sacred 152-meter Sivagiri Hill.",
                full_description="The Arulmigu Dhandayuthapani Swamy Temple is one of the Arupadai Veedu of Lord Murugan. The presiding deity is unique — the idol is made of Navapashanam (nine minerals) by Sage Bogar. Millions visit during Thaipusam, Panguni Uthiram, and Kanda Sashti.",
                address="Temple Hill, Palani, Dindigul District, Tamil Nadu 624601",
                latitude=10.4491, longitude=77.5149, entry_fee="Free (special entry available)",
                timings="05:00 AM - 09:00 PM", best_time_to_visit="November to March",
                distance_from_city="City center"),
            Place(region_id=qid, name="Agasthiyar Falls", slug="agasthiyar-falls",
                category="waterfall", is_featured=True,
                short_description="A sacred and scenic waterfall near Palani, believed to have medicinal properties.",
                full_description="Agasthiyar Falls is in the Pathala Gangai region near Palani, about 9 km from town. Named after Sage Agasthiyar, the water is believed to have medicinal properties. The trek to the falls passes through beautiful forest terrain.",
                address="Pathala Gangai Road, Palani, Dindigul District, Tamil Nadu 624601",
                latitude=10.4700, longitude=77.5300, entry_fee="₹10",
                timings="06:00 AM - 05:30 PM", best_time_to_visit="August to February",
                distance_from_city="9 km from Palani"),
            Place(region_id=qid, name="Thiru Avinankudi Temple", slug="thiru-avinankudi-temple",
                category="temple", is_featured=False,
                short_description="Ancient temple of Lord Murugan at the foothills of Palani Hill.",
                full_description="Thiru Avinankudi Murugan Temple is at the foothills of Palani Hill and is one of the oldest Murugan temples in Tamil Nadu. The presiding deity is Bala Murugan (child form).",
                address="Avinankudi, Palani, Dindigul District, Tamil Nadu 624601",
                latitude=10.4452, longitude=77.5125, entry_fee="Free",
                timings="06:00 AM - 12:00 PM, 04:00 PM - 09:00 PM",
                best_time_to_visit="October to March", distance_from_city="2 km from Palani"),
            Place(region_id=qid, name="Palani Hills", slug="palani-hills",
                category="viewpoint", is_featured=False,
                short_description="Scenic hill ranges with breathtaking views and cool climate year-round.",
                full_description="The Palani Hills are a range in the Western Ghats covering parts of Dindigul and Coimbatore districts. These hills form the eastern extension of the Anamalai Hills, reaching heights of up to 2,400 meters at Kodaikanal.",
                address="Palani Hills, Dindigul District, Tamil Nadu",
                latitude=10.4800, longitude=77.5200, entry_fee="Free",
                timings="24 hours", best_time_to_visit="October to March",
                distance_from_city="Surrounds Palani town"),
        ]
        db.session.add_all(places)
        print(f"✅ {len(places)} places seeded")

    db.session.commit()
    print("Database ready!")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed()
    app.run(host="0.0.0.0", port=5000, debug=True)
