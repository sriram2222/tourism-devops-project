from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from app import db
from app.models import Gallery
import os, uuid

gallery_bp = Blueprint("gallery", __name__)

def _save_file(file):
    ext      = file.filename.rsplit(".",1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))
    return f"/api/uploads/{filename}"

def _allowed(filename):
    return "." in filename and filename.rsplit(".",1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]

@gallery_bp.route("/", methods=["GET"])
def get_gallery():
    query = Gallery.query
    if request.args.get("region_id"): query = query.filter_by(region_id=request.args.get("region_id"))
    if request.args.get("tag"):       query = query.filter(Gallery.tag.ilike(f"%{request.args.get('tag')}%"))
    return jsonify([i.to_dict() for i in query.order_by(Gallery.created_at.desc()).all()]), 200

@gallery_bp.route("/", methods=["POST"])
@jwt_required()
def create_gallery():
    if "file" not in request.files: return jsonify({"error":"No file"}), 400
    file = request.files["file"]
    if not _allowed(file.filename):  return jsonify({"error":"Invalid file type"}), 400
    item = Gallery(
        image_url=_save_file(file),
        title=request.form.get("title"),
        tag=request.form.get("tag"),
        region_id=int(request.form.get("region_id")) if request.form.get("region_id") else None,
    )
    db.session.add(item); db.session.commit()
    return jsonify(item.to_dict()), 201

@gallery_bp.route("/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_gallery(item_id):
    item = Gallery.query.get(item_id)
    if not item: return jsonify({"error":"Not found"}), 404
    try:
        fname = item.image_url.split("/api/uploads/")[-1]
        fpath = os.path.join(current_app.config["UPLOAD_FOLDER"], fname)
        if os.path.exists(fpath): os.remove(fpath)
    except Exception: pass
    db.session.delete(item); db.session.commit()
    return jsonify({"message":"Deleted"}), 200

@gallery_bp.route("/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_gallery(item_id):
    item = Gallery.query.get(item_id)
    if not item: return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    if "title" in data: item.title = data["title"]
    if "tag"   in data: item.tag   = data["tag"]
    db.session.commit()
    return jsonify(item.to_dict()), 200