from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from app import db
from app.models import AdminUser

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username","").strip()
    password = data.get("password","").strip()
    if not username or not password:
        return jsonify({"error":"Username and password required"}), 400
    user = AdminUser.query.filter_by(username=username).first()
    if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return jsonify({"error":"Invalid credentials"}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token":token,"username":user.username}), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = AdminUser.query.get(get_jwt_identity())
    if not user: return jsonify({"error":"Not found"}), 404
    return jsonify({"id":user.id,"username":user.username}), 200

@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    user = AdminUser.query.get(get_jwt_identity())
    if not user: return jsonify({"error":"Not found"}), 404
    data = request.get_json() or {}
    if not bcrypt.checkpw(data.get("old_password","").encode(), user.password_hash.encode()):
        return jsonify({"error":"Current password incorrect"}), 400
    new_pw = data.get("new_password","")
    if len(new_pw) < 8:
        return jsonify({"error":"Password must be at least 8 characters"}), 400
    user.password_hash = bcrypt.hashpw(new_pw.encode(), bcrypt.gensalt()).decode()
    db.session.commit()
    return jsonify({"message":"Password changed"}), 200
