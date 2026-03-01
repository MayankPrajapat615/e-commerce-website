from flask import Blueprint, render_template, request, redirect, session, flash, jsonify
from db import users_collection
from bson import ObjectId

cart_bp = Blueprint("cart", __name__)


def get_current_user():
    if "user_id" not in session:
        return None
    return users_collection.find_one({"_id": ObjectId(session["user_id"])})


# ===== VIEW CART =====
@cart_bp.route("/cart")
def view_cart():
    if "user_id" not in session:
        flash("Please login to view your cart.", "error")
        return redirect("/")

    user = get_current_user()
    cart = user.get("cart", [])

    total = sum(item["price"] * item["quantity"] for item in cart)
    return render_template("cart.html", cart=cart, total=total)


# ===== ADD TO CART =====
@cart_bp.route("/cart/add", methods=["POST"])
def add_to_cart():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "login_required"}), 401

    data = request.get_json()
    product_id    = data.get("product_id")
    product_name  = data.get("product_name")
    product_price = float(data.get("product_price"))
    product_image = data.get("product_image")
    quantity      = int(data.get("quantity", 1))

    user = get_current_user()
    cart = user.get("cart", [])

    # if product already in cart, increase quantity
    for item in cart:
        if item["product_id"] == product_id:
            item["quantity"] += quantity
            users_collection.update_one(
                {"_id": ObjectId(session["user_id"])},
                {"$set": {"cart": cart}}
            )
            return jsonify({"success": True, "message": "Quantity updated", "cart_count": sum(i["quantity"] for i in cart)})

    # else add new item
    cart.append({
        "product_id":   product_id,
        "product_name": product_name,
        "price":        product_price,
        "image":        product_image,
        "quantity":     quantity
    })

    users_collection.update_one(
        {"_id": ObjectId(session["user_id"])},
        {"$set": {"cart": cart}}
    )

    return jsonify({"success": True, "message": "Added to cart", "cart_count": sum(i["quantity"] for i in cart)})


# ===== REMOVE FROM CART =====
@cart_bp.route("/cart/remove", methods=["POST"])
def remove_from_cart():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "login_required"}), 401

    data = request.get_json()
    product_id = data.get("product_id")

    user = get_current_user()
    cart = user.get("cart", [])

    cart = [item for item in cart if item["product_id"] != product_id]

    users_collection.update_one(
        {"_id": ObjectId(session["user_id"])},
        {"$set": {"cart": cart}}
    )

    total = sum(item["price"] * item["quantity"] for item in cart)
    return jsonify({"success": True, "cart_count": sum(i["quantity"] for i in cart), "total": total})


# ===== UPDATE QUANTITY =====
@cart_bp.route("/cart/update", methods=["POST"])
def update_quantity():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "login_required"}), 401

    data = request.get_json()
    product_id = data.get("product_id")
    quantity   = int(data.get("quantity"))

    user = get_current_user()
    cart = user.get("cart", [])

    for item in cart:
        if item["product_id"] == product_id:
            if quantity <= 0:
                cart.remove(item)
            else:
                item["quantity"] = quantity
            break

    users_collection.update_one(
        {"_id": ObjectId(session["user_id"])},
        {"$set": {"cart": cart}}
    )

    total = sum(item["price"] * item["quantity"] for item in cart)
    return jsonify({"success": True, "cart_count": sum(i["quantity"] for i in cart), "total": total})


# ===== CLEAR CART =====
@cart_bp.route("/cart/clear", methods=["POST"])
def clear_cart():
    if "user_id" not in session:
        return jsonify({"success": False}), 401

    users_collection.update_one(
        {"_id": ObjectId(session["user_id"])},
        {"$set": {"cart": []}}
    )
    return jsonify({"success": True})