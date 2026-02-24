from app import db
from datetime import datetime

class AdminUser(db.Model):
    __tablename__ = "admin_users"
    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

class Region(db.Model):
    __tablename__ = "regions"
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(100), nullable=False)
    slug          = db.Column(db.String(100), unique=True, nullable=False)
    description   = db.Column(db.Text)
    banner_image  = db.Column(db.String(255))
    places        = db.relationship("Place", backref="region", lazy=True)

    def to_dict(self):
        return {"id":self.id,"name":self.name,"slug":self.slug,"description":self.description,"banner_image":self.banner_image}

class Place(db.Model):
    __tablename__       = "places"
    id                  = db.Column(db.Integer, primary_key=True)
    region_id           = db.Column(db.Integer, db.ForeignKey("regions.id"), nullable=False)
    name                = db.Column(db.String(200), nullable=False)
    slug                = db.Column(db.String(200), unique=True, nullable=False)
    category            = db.Column(db.String(50), default="other")
    short_description   = db.Column(db.String(500))
    full_description    = db.Column(db.Text)
    address             = db.Column(db.Text)
    latitude            = db.Column(db.Numeric(10,8))
    longitude           = db.Column(db.Numeric(11,8))
    entry_fee           = db.Column(db.String(100))
    timings             = db.Column(db.String(200))
    best_time_to_visit  = db.Column(db.String(200))
    distance_from_city  = db.Column(db.String(100))
    is_featured         = db.Column(db.Boolean, default=False)
    is_active           = db.Column(db.Boolean, default=True)
    created_at          = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at          = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    images              = db.relationship("PlaceImage", backref="place", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        primary = next((img.image_url for img in self.images if img.is_primary), None)
        if not primary and self.images: primary = self.images[0].image_url
        return {
            "id":self.id,"region_id":self.region_id,
            "region_name":self.region.name if self.region else None,
            "name":self.name,"slug":self.slug,"category":self.category,
            "short_description":self.short_description,"full_description":self.full_description,
            "address":self.address,
            "latitude":float(self.latitude) if self.latitude else None,
            "longitude":float(self.longitude) if self.longitude else None,
            "entry_fee":self.entry_fee,"timings":self.timings,
            "best_time_to_visit":self.best_time_to_visit,"distance_from_city":self.distance_from_city,
            "is_featured":self.is_featured,"is_active":self.is_active,
            "primary_image":primary,"images":[img.to_dict() for img in self.images],
        }

class PlaceImage(db.Model):
    __tablename__ = "place_images"
    id            = db.Column(db.Integer, primary_key=True)
    place_id      = db.Column(db.Integer, db.ForeignKey("places.id"), nullable=False)
    image_url     = db.Column(db.String(500), nullable=False)
    caption       = db.Column(db.String(255))
    is_primary    = db.Column(db.Boolean, default=False)
    sort_order    = db.Column(db.Integer, default=0)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"id":self.id,"place_id":self.place_id,"url":self.image_url,
                "caption":self.caption,"is_primary":self.is_primary,"sort_order":self.sort_order}

class Gallery(db.Model):
    __tablename__ = "gallery"
    id            = db.Column(db.Integer, primary_key=True)
    region_id     = db.Column(db.Integer, db.ForeignKey("regions.id"), nullable=True)
    title         = db.Column(db.String(255))
    image_url     = db.Column(db.String(500), nullable=False)
    tag           = db.Column(db.String(100))
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"id":self.id,"region_id":self.region_id,"title":self.title,
                "image_url":self.image_url,"tag":self.tag,"created_at":str(self.created_at)}
