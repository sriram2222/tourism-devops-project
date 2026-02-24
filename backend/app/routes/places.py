from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Place, Region

places_bp = Blueprint("places", __name__)

@places_bp.route("/", methods=["GET"])
def get_places():
    region_slug = request.args.get("region")
    category = request.args.get("category")
    search = request.args.get("search")
    featured = request.args.get("featured")

    query = Place.query.filter_by(is_active=True)

    # region filter
    if region_slug:
        r = Region.query.filter_by(slug=region_slug).first()
        if r:
            query = query.filter_by(region_id=r.id)

    # category filter
    if category:
        query = query.filter_by(category=category)

    # featured filter
    if featured == "true":
        query = query.filter_by(is_featured=True)

    # search filter
    if search:
        query = query.filter(Place.name.ilike(f"%{search}%"))

    places = query.order_by(
        Place.is_featured.desc(),
        Place.created_at.desc()
    ).all()

    return jsonify([p.to_dict() for p in places]), 200

@places_bp.route("/regions", methods=["GET"])
def get_regions():
    return jsonify([r.to_dict() for r in Region.query.all()]), 200

@places_bp.route("/<slug>", methods=["GET"])
def get_place(slug):
    place = Place.query.filter_by(slug=slug, is_active=True).first()
    if not place: return jsonify({"error":"Place not found"}), 404
    return jsonify(place.to_dict()), 200

@places_bp.route("/", methods=["POST"])
@jwt_required()
def create_place():
    data = request.get_json() or {}
    if Place.query.filter_by(slug=data.get("slug")).first():
        return jsonify({"error":f"Slug '{data.get('slug')}' already exists"}), 400
    place = Place(
        region_id=data.get("region_id",1), name=data.get("name"), slug=data.get("slug"),
        category=data.get("category","other"), short_description=data.get("short_description"),
        full_description=data.get("full_description"), address=data.get("address"),
        latitude=data.get("latitude"), longitude=data.get("longitude"),
        entry_fee=data.get("entry_fee"), timings=data.get("timings"),
        best_time_to_visit=data.get("best_time_to_visit"),
        distance_from_city=data.get("distance_from_city"), is_featured=data.get("is_featured",False),
    )
    db.session.add(place); db.session.commit()
    return jsonify(place.to_dict()), 201

@places_bp.route("/<int:place_id>", methods=["PUT"])
@jwt_required()
def update_place(place_id):
    place = Place.query.get(place_id)
    if not place: return jsonify({"error":"Not found"}), 404
    data = request.get_json() or {}
    for f in ["name","slug","category","short_description","full_description","address",
              "latitude","longitude","entry_fee","timings","best_time_to_visit",
              "distance_from_city","is_featured","is_active","region_id"]:
        if f in data: setattr(place, f, data[f])
    db.session.commit()
    return jsonify(place.to_dict()), 200

@places_bp.route("/<int:place_id>", methods=["DELETE"])
@jwt_required()
def delete_place(place_id):
    place = Place.query.get(place_id)
    if not place: return jsonify({"error":"Not found"}), 404
    db.session.delete(place); db.session.commit()
    return jsonify({"message":f'"{place.name}" deleted'}), 200
