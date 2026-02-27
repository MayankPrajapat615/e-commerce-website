from flask import Blueprint, render_template, abort
from db import products_collection

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


@public_bp.route("/shop/<slug>")
def product_detail(slug):
    product = products_collection.find_one({"slug": slug})
    if not product:
        abort(404)
    return render_template("kurta_detail.html", product=product)