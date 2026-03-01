from flask import Blueprint, render_template, abort
from db import products_collection   # ← only this, drop "import db"

public_bp = Blueprint("public", __name__)

@public_bp.route("/")
def home():
    return render_template("home.html")

@public_bp.route("/about-us")
def about():
    return render_template("about-us.html")

@public_bp.route("/sustainability")
def sustainability():
    return render_template("sustainability.html")

@public_bp.route("/contact-us")
def contact():
    return render_template("contact-us.html")

@public_bp.route("/shop")
def shop():
    products = list(products_collection.find())
    return render_template("shop.html", products=products)


@public_bp.route("/product/<slug>")
def product_detail(slug):
    product = products_collection.find_one({"slug": slug})
    if not product:
        abort(404)
    product["_id"] = str(product["_id"])

    related_products = []
    if product.get("occasion"):
        related_cursor = products_collection.find({     # ← was db.products
            "slug": {"$ne": slug},
            "occasion": {"$in": product["occasion"]}
        }).limit(4)
        related_products = list(related_cursor)

    if len(related_products) < 4:
        existing_slugs = [slug] + [r["slug"] for r in related_products]
        extra = products_collection.find({              # ← was db.products
            "slug": {"$nin": existing_slugs}
        }).limit(4 - len(related_products))
        related_products += list(extra)

    for rp in related_products:
        rp["_id"] = str(rp["_id"])

    return render_template(
        "kurta_detail.html",
        product=product,
        related_products=related_products
    )