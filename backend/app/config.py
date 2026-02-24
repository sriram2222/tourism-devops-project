import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USER','root')}:{os.getenv('DB_PASSWORD','root')}"
        f"@{os.getenv('DB_HOST','localhost')}:{os.getenv('DB_PORT','3306')}/{os.getenv('DB_NAME','tourism_db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY          = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-change-me")
    JWT_ACCESS_TOKEN_EXPIRES = 86400
    UPLOAD_FOLDER = r"E:\Claude\tourism-app\backend\uploads"
    MAX_CONTENT_LENGTH      = 16 * 1024 * 1024
    ALLOWED_EXTENSIONS      = {"png","jpg","jpeg","gif","webp"}
    FRONTEND_URL            = os.getenv("FRONTEND_URL", "http://localhost:3000")
