from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)

    CORS(
        app,
        origins=[
            app.config["FRONTEND_URL"],
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ],
        supports_credentials=True,
        methods=["GET","POST","PUT","DELETE","OPTIONS"],
        allow_headers=["Content-Type","Authorization"]
    )

    # ROUTES IMPORT
    from app.routes.auth import auth_bp
    from app.routes.places import places_bp
    from app.routes.gallery import gallery_bp
    from app.routes.upload import upload_bp
    from app.routes.dashboard import dashboard_bp   # 🔥 dashboard

    # REGISTER ROUTES
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(places_bp, url_prefix="/api/places")
    app.register_blueprint(gallery_bp, url_prefix="/api/gallery")
    app.register_blueprint(upload_bp, url_prefix="/api/upload")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")  # 🔥

    # HEALTH CHECK
    @app.route("/api/health")
    def health():
        return {"status":"ok","service":"tourism-api"}

    # IMAGE SERVE
    @app.route('/api/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app
