from flask import Blueprint, render_template, request, redirect, session, flash
from db import products_collection
from utils.slug import generate_slug
from utils.decorators import admin_required
from utils.validators import validate_product_form
import os
import uuid
from werkzeug.utils import secure_filename

admin_bp = Blueprint("admin", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
UPLOAD_FOLDER = "static/uploads"

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@admin_bp.route("/add-product", methods=["GET", "POST"])
@admin_required
def add_product():

    print("Session:", session)     #temporary debug statement to check session contents

    if request.method == "POST":

        validation_error = validate_product_form(request.form)
        if validation_error:
            flash(validation_error, "error")
            return redirect("/admin/add-product")

        name = request.form.get("name")
        description = request.form.get("description")
        price = float(request.form.get("price"))
        stock = int(request.form.get("stock"))

        slug = generate_slug(name)

        existing = products_collection.find_one({"slug": slug})
        if existing:
            slug = f"{slug}-{uuid.uuid4().hex[:6]}"

        files = request.files.getlist("images")
        image_filenames = []

        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                ext = os.path.splitext(filename)[1]
                unique_name = f"{uuid.uuid4().hex}{ext}"
                filepath = os.path.join(UPLOAD_FOLDER, unique_name)
                file.save(filepath)
                image_filenames.append(f"/static/uploads/{unique_name}")

        product = {
            "name": name,
            "description": description,
            "price": price,
            "stock": stock,
            "slug": slug,
            "images": image_filenames
        }

        products_collection.insert_one(product)
        flash("Product added successfully!", "success")
        return redirect("/admin/add-product")

    return render_template("admin_add_product.html")