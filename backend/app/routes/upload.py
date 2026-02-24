from flask import Blueprint, jsonify
from app.models import db, PlaceImage
import os

upload_bp = Blueprint("upload", __name__)

# DELETE IMAGE API
@upload_bp.route("/delete-image/<int:image_id>", methods=["DELETE"])
def delete_image(image_id):
    img = PlaceImage.query.get(image_id)

    if not img:
        return jsonify({"error": "Image not found"}), 404

    place_id = img.place_id

    # delete file from uploads folder
    try:
        filename = img.url.split("/")[-1]
        path = os.path.join("app/static/uploads", filename)
        if os.path.exists(path):
            os.remove(path)
    except:
        pass

    # delete from DB
    db.session.delete(img)
    db.session.commit()

    # if no primary image → set one
    remaining = PlaceImage.query.filter_by(place_id=place_id).all()

    if remaining:
        has_primary = any(i.is_primary for i in remaining)
        if not has_primary:
            remaining[0].is_primary = True
            db.session.commit()

    return jsonify({"message": "Image deleted"}), 200