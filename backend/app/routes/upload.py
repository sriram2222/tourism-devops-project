from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, PlaceImage
import os, uuid

upload_bp = Blueprint("upload", __name__)

# UPLOAD IMAGE
@upload_bp.route("/image", methods=["POST", "OPTIONS"])
@jwt_required(optional=True)
def upload_image():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    user = get_jwt_identity()
    if not user:
        return jsonify({"error": "Login required"}), 401

    file     = request.files.get("file")
    place_id = request.form.get("place_id")
    is_primary = request.form.get("is_primary") == "true"

    if not file or not place_id:
        return jsonify({"error": "Missing file or place_id"}), 400

    # ✅ Unique filename to avoid collisions
    ext      = file.filename.rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"

    # ✅ Correct Docker upload folder
    upload_folder = "/app/uploads"
    os.makedirs(upload_folder, exist_ok=True)

    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)

    # ✅ Fixed field name: image_url (not url)
    img = PlaceImage(
        place_id   = int(place_id),
        image_url  = f"/api/uploads/{filename}",
        is_primary = is_primary
    )
    db.session.add(img)
    db.session.commit()

    return jsonify({
        "message":   "Image uploaded",
        "image_url": f"/api/uploads/{filename}",
        "id":        img.id
    }), 200


# DELETE IMAGE
@upload_bp.route("/delete-image/<int:image_id>", methods=["DELETE"])
def delete_image(image_id):
    img = PlaceImage.query.get(image_id)
    if not img:
        return jsonify({"error": "Image not found"}), 404

    place_id = img.place_id

    # Delete file from disk
    try:
        filename = img.image_url.split("/")[-1]
        path = os.path.join("/app/uploads", filename)
        if os.path.exists(path):
            os.remove(path)
    except:
        pass

    db.session.delete(img)
    db.session.commit()

    # If no primary image left, set first remaining as primary
    remaining = PlaceImage.query.filter_by(place_id=place_id).all()
    if remaining and not any(i.is_primary for i in remaining):
        remaining[0].is_primary = True
        db.session.commit()

    return jsonify({"message": "Image deleted"}), 200
