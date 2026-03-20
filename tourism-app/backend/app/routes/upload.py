from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, PlaceImage
from app.utils.s3_utils import upload_file_to_s3
import os, uuid, boto3

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/image", methods=["POST", "OPTIONS"])
@jwt_required(optional=True)
def upload_image():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    user = get_jwt_identity()
    if not user:
        return jsonify({"error": "Login required"}), 401

    file = request.files.get("file")
    place_id = request.form.get("place_id")
    is_primary = request.form.get("is_primary") == "true"

    if not file or not place_id:
        return jsonify({"error": "Missing file or place_id"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"

    # Try S3 first, fallback to local
    image_url = upload_file_to_s3(file, filename)

    if not image_url:
        upload_folder = "/app/uploads"
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        image_url = f"/api/uploads/{filename}"

    img = PlaceImage(
        place_id=int(place_id),
        image_url=image_url,
        is_primary=is_primary
    )
    db.session.add(img)
    db.session.commit()

    return jsonify({
        "message": "Image uploaded",
        "image_url": image_url,
        "id": img.id
    }), 200

@upload_bp.route("/delete-image/<int:image_id>", methods=["DELETE"])
def delete_image(image_id):
    img = PlaceImage.query.get(image_id)
    if not img:
        return jsonify({"error": "Image not found"}), 404

    place_id = img.place_id

    if img.image_url.startswith("http"):
        try:
            filename = img.image_url.split("/")[-1]
            s3 = boto3.client('s3',
                region_name=os.getenv('AWS_REGION'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            bucket = os.getenv('AWS_BUCKET_NAME') or os.getenv('AWS_S3_BUCKET')
            s3.delete_object(Bucket=bucket, Key=filename)
        except:
            pass
    else:
        try:
            filename = img.image_url.split("/")[-1]
            path = os.path.join("/app/uploads", filename)
            if os.path.exists(path):
                os.remove(path)
        except:
            pass

    db.session.delete(img)
    db.session.commit()

    remaining = PlaceImage.query.filter_by(place_id=place_id).all()
    if remaining and not any(i.is_primary for i in remaining):
        remaining[0].is_primary = True
        db.session.commit()

    return jsonify({"message": "Image deleted"}), 200