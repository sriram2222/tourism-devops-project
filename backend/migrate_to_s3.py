import os
from app import create_app, db
from app.models import Gallery  # change if your model name is different
from app.utils.s3_utils import upload_file_to_s3

app = create_app()

UPLOAD_FOLDER = "uploads"

with app.app_context():
    images = Gallery.query.all()

    for img in images:
        if not img.image_url:
            continue

        # Skip already uploaded images
        if img.image_url.startswith("http"):
            continue

        file_path = os.path.join(UPLOAD_FOLDER, img.image_url)

        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            continue

        print(f"⬆️ Uploading: {img.image_url}")

        with open(file_path, "rb") as f:
            url = upload_file_to_s3(f, img.image_url)

            # ✅ Update DB
            img.image_url = url
            db.session.commit()

            print(f"✅ Updated DB: {url}")

    print("🎉 Migration completed!")