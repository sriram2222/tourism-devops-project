import email
import token

from app import create_app, db
from app.models import AdminUser, Region, Place, User, Booking
import bcrypt
import secrets
from app.s3_utils import upload_file_to_s3
from flask import request, jsonify, send_from_directory
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from flask_mail import Mail, Message

app = create_app()
app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

# ✅ Mail config
app.config["MAIL_SERVER"]         = "smtp.gmail.com"
app.config["MAIL_PORT"]           = 587
app.config["MAIL_USE_TLS"]        = True
app.config["MAIL_USERNAME"]       = "raamlakshmanan22@gmail.com"
app.config["MAIL_PASSWORD"]       = "vhii cosz qydm jwjc"
app.config["MAIL_DEFAULT_SENDER"] = "raamlakshmanan22@gmail.com"
mail = Mail(app)

# Temporary reset token storage
reset_tokens = {}

# ---------------- SERVE UPLOADED IMAGES ----------------
@app.route("/uploads/<path:filename>")
def uploaded_files(filename):
    return send_from_directory("uploads", filename)

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

        token = create_access_token(identity=str(user.id))

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ---------------- S3 IMAGE UPLOAD ----------------
@app.route("/api/upload", methods=["POST"])
def upload_image():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]

        file_url = upload_file_to_s3(file)

        if not file_url:
            return jsonify({"error": "Upload failed"}), 500

        return jsonify({
            "message": "Upload successful",
            "url": file_url
        }), 200

    except Exception as e:
        print("❌ Upload error:", str(e))
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

        token = create_access_token(identity=str(user.id))
        return jsonify({
            "message": "Google login success",
            "token": token,
            "user": {"id": user.id, "name": user.name, "email": user.email, "phone": user.phone}
        }), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Google login failed"}), 500

# ---------------- FORGOT PASSWORD ----------------
@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data  = request.get_json(force=True)
        email = data.get("email")

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Email not found"}), 404

        token = secrets.token_urlsafe(32)
        reset_tokens[email] = token

        # ✅ Replace with
        reset_link = f"http://52.66.242.219/reset-password?token={token}&email={email}"

        msg = Message(
            subject="PP Explorer — Password Reset",
            recipients=[email],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                <div style="background: #0c1a0e; padding: 20px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0;">🌿 PP Explorer</h1>
                    <p style="color: #ffffff80; margin: 5px 0 0;">Pollachi & Palani Tourism</p>
                </div>
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
                    <h2 style="color: #1a1a1a;">Reset Your Password</h2>
                    <p style="color: #555;">Hi {user.name},</p>
                    <p style="color: #555;">Click the button below to reset your password. This link expires in 1 hour.</p>
                    <a href="{reset_link}"
                       style="display: inline-block; background: #16a34a; color: white;
                              padding: 12px 28px; border-radius: 8px; text-decoration: none;
                              font-weight: bold; margin: 20px 0;">
                        Reset Password →
                    </a>
                    <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
                </div>
            </div>
            """
        )
        mail.send(msg)

        return jsonify({"message": "Reset link sent to your email"}), 200

    except Exception as e:
        print("❌ Email error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json(force=True)
        email = data.get("email")
        token = data.get("token")
        password = data.get("password")

        print("RESET REQUEST RECEIVED")
        print("Email:", email)
        print("Token from request:", token)
        print("Token stored:", reset_tokens.get(email))
        print("Password received:", password)

        if reset_tokens.get(email) != token:
            print("Token mismatch")
            return jsonify({"error": "Invalid or expired token"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            print("User not found")
            return jsonify({"error": "User not found"}), 404

        new_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode()

        print("Updating password hash to:", new_hash)

        user.password = new_hash
        db.session.commit()

        del reset_tokens[email]

        print("Password updated successfully")

        return jsonify({"message": "Password reset successful"}), 200

    except Exception as e:
        print("RESET ERROR:", e)
        return jsonify({"error": str(e)}), 500
    
# ---------------- BOOK HOTEL ----------------
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
            hotel_slug  = data.get("hotel_slug"),
        )
        db.session.add(booking)
        db.session.commit()

        return jsonify({"message": "Booking successful", "id": booking.id}), 201
    except Exception as e:
        print("❌ Booking error:", str(e))
        return jsonify({"error": str(e)}), 500

# ---------------- ADMIN VIEW ALL BOOKINGS ----------------
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
        user_id = int(get_jwt_identity())
        bookings = Booking.query.filter_by(user_id=user_id)\
            .order_by(Booking.created_at.desc()).all()

        result = []
        for b in bookings:
            result.append({
                "id": b.id,
                "hotel_name": b.hotel_name,
                "hotel_slug": b.hotel_slug,
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

# ---------------- UPDATE PROFILE ----------------
@app.route("/api/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json(force=True)
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        if data.get("name"):    user.name    = data.get("name")
        if data.get("phone"):   user.phone   = data.get("phone")
        if data.get("address"): user.address = data.get("address")
        db.session.commit()
        return jsonify({"message": "Profile updated", "user": user.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

    app.run(host="0.0.0.0", port=5000, debug=False)