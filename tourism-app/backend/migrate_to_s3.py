import os
from app import create_app, db
from app.models import Gallery
from app.utils.s3_utils import upload_file_to_s3

app = create_app()

UPLOAD_FOLDER = "/app/uploads"

with app.app_context():
    images = Gallery.query.all()

    for img in images:
        if not img.image_url:
            continue

        if img.image_url.startswith("http"):
            continue

        filename = os.path.basename(img.image_url.strip())
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        print(f"\n🔍 Checking: {file_path}")

        if not os.path.exists(file_path):
            print(f"❌ File NOT found: {file_path}")
            continue

        try:
            print(f"⬆️ Uploading: {filename}")

            with open(file_path, "rb") as f:
                url = upload_file_to_s3(f, filename)

            img.image_url = url
            db.session.commit()

            print(f"✅ Uploaded & Updated: {url}")

        except Exception as e:
            print(f"🔥 Error uploading {filename}: {str(e)}")

    print("\n🎉 Migration completed!")