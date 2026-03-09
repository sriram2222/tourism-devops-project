from app import create_app, db
from app.models import AdminUser, Region, Place, User, Booking
import bcrypt
from flask import request, jsonify
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)


# ✅ No CORS here — it's already handled in create_app() / __init__.py
app = create_app()
app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

# ---------------- SEED FUNCTION ----------------
def seed():
    if not AdminUser.query.first():
        admin = AdminUser(
            username="admin",
            password_hash=bcrypt.hashpw(b"Admin@123", bcrypt.gensalt()).decode("utf-8")
        )
        db.session.add(admin)

    if not Region.query.first():
        pollachi = Region(name="Pollachi", slug="pollachi",
            description="Gateway to Anamalai Tiger Reserve — lush greenery, waterfalls, natural beauty.")
        palani = Region(name="Palani", slug="palani",
            description="Sacred pilgrimage town — home to Arulmigu Dhandayuthapani Swamy Temple.")

        db.session.add_all([pollachi, palani])
        db.session.flush()

        pid = pollachi.id
        qid = palani.id

        places = [
            Place(region_id=pid, name="Anamalai Tiger Reserve", slug="anamalai-tiger-reserve",
                category="nature", is_featured=True,
                short_description="Wildlife sanctuary with rich biodiversity.",
                full_description="The Anamalai Tiger Reserve spans over 958 sq km.",
                address="Forest Office, Pollachi",
                latitude=10.3750, longitude=76.9700,
                entry_fee="₹30", timings="06:00 AM - 06:00 PM",
                best_time_to_visit="October to March", distance_from_city="25 km"),

            Place(region_id=qid, name="Palani Murugan Temple", slug="palani-murugan-temple",
                category="temple", is_featured=True,
                short_description="Famous Murugan temple.",
                full_description="One of six abodes of Murugan.",
                address="Temple Hill, Palani",
                latitude=10.4491, longitude=77.5149,
                entry_fee="Free", timings="05:00 AM - 09:00 PM",
                best_time_to_visit="November to March", distance_from_city="City center"),
        ]
        db.session.add_all(places)
        print("✅ Places seeded")

    db.session.commit()
    print("Database ready!")

# ---------------- SIGNUP ----------------
@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        data     = request.get_json(force=True)
        name     = data.get("name")
        email    = data.get("email")
        password = data.get("password")
        phone    = data.get("phone")
        address  = data.get("address")

        if not name or not email or not password or not phone:
            return jsonify({"error": "All fields required"}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 400
        if User.query.filter_by(phone=phone).first():
            return jsonify({"error": "Phone already registered"}), 400

        hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode()
        new_user  = User(name=name, email=email, password=hashed_pw, phone=phone, address=address)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Signup successful"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- LOGIN ----------------
@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True)
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            return jsonify({"error": "Invalid email or password"}), 401

        token = create_access_token(identity=user.id)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- GOOGLE LOGIN ----------------
@app.route("/google-login", methods=["POST"])
def google_login():
    try:
        data  = request.get_json()
        email = data.get("email")
        name  = data.get("name")

        if not email:
            return jsonify({"error": "Email required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(name=name, email=email, password="google_auth", phone="", address="")
            db.session.add(user)
            db.session.commit()

        return jsonify({
            "message": "Google login success",
            "user": {"id": user.id, "name": user.name, "email": user.email}
        }), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Google login failed"}), 500

# ---------------- BOOK HOTEL ✅ /api/bookings ----------------
@app.route("/api/bookings", methods=["POST"])
def book_hotel():
    try:
        data = request.get_json(force=True)
        print("📦 Booking received:", data)

        booking = Booking(
            user_id     = data.get("user_id"),
            hotel_name  = data.get("hotel_name"),
            location    = data.get("location"),
            room_type   = data.get("room_type"),
            check_in    = data.get("check_in"),
            check_out   = data.get("check_out"),
            guests      = data.get("guests"),
            total_price = data.get("total_price"),
            booking_ref = data.get("booking_ref"),
            hotel_slug=data.get("hotel_slug"),
        )
        db.session.add(booking)
        db.session.commit()

        return jsonify({"message": "Booking successful", "id": booking.id}), 201
    except Exception as e:
        print("❌ Booking error:", str(e))
        return jsonify({"error": str(e)}), 500

# ---------------- ADMIN VIEW ALL BOOKINGS (ULTRA PRO) ----------------
@app.route("/api/admin/bookings", methods=["GET"])
@jwt_required()
def admin_all_bookings():
    try:


        bookings = db.session.query(Booking, User).join(
            User, Booking.user_id == User.id
        ).order_by(Booking.created_at.desc()).all()

        result = []
        total_revenue = 0

        for booking, user in bookings:
            price = float(booking.total_price) if booking.total_price else 0
            total_revenue += price

            result.append({
                "id": booking.id,
                "user_name": user.name,
                "phone": user.phone,
                "hotel_name": booking.hotel_name,
                "location": booking.location,
                "room_type": booking.room_type or "",
                "check_in": str(booking.check_in),
                "check_out": str(booking.check_out),
                "guests": booking.guests,
                "total_price": price,
                "created_at": str(booking.created_at)
            })

        return jsonify({
            "total_bookings": len(result),
            "total_revenue": total_revenue,
            "bookings": result
        }), 200

    except Exception as e:
        print("❌ Admin booking error:", str(e))
        return jsonify({"error": str(e)}), 500
    
   # ---------------- GET USER BOOKINGS ----------------
@app.route("/api/my-booking", methods=["GET"])
@jwt_required()
def get_user_bookings():
    try:
        user_id = get_jwt_identity()
        bookings = Booking.query.filter_by(user_id=user_id)\
            .order_by(Booking.created_at.desc()).all()

        result = []
        for b in bookings:
            result.append({
                "id": b.id,
                "hotel_name": b.hotel_name,
                "location": b.location,
                "room_type": b.room_type,
                "check_in": str(b.check_in),
                "check_out": str(b.check_out),
                "guests": b.guests,
                "total_price": b.total_price,
                "booking_ref": b.booking_ref,
                "created_at": str(b.created_at)
            })

        return jsonify(result), 200

    except Exception as e:
        print("❌ Fetch bookings error:", str(e))
        return jsonify({"error": str(e)}), 500
    
# Add this route to your app.py

# ---------------- DELETE BOOKING ----------------
@app.route("/api/bookings/<int:booking_id>", methods=["DELETE"])
def delete_booking(booking_id):
    try:
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({"error": "Booking not found"}), 404

        db.session.delete(booking)
        db.session.commit()

        return jsonify({"message": "Booking cancelled successfully"}), 200

    except Exception as e:
        print("❌ Delete booking error:", str(e))
        return jsonify({"error": str(e)}), 500

    
# ---------------- MAIN ----------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed()

    app.run(host="0.0.0.0", port=5000, debug=True)

