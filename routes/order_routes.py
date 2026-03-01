from flask import Blueprint, render_template, request, redirect, session, flash
from db import users_collection, orders_collection
from bson import ObjectId
from datetime import datetime, timezone
import uuid

order_bp = Blueprint("order", __name__)


def get_current_user():
    if "user_id" not in session:
        return None
    return users_collection.find_one({"_id": ObjectId(session["user_id"])})


# ===== CHECKOUT PAGE =====
@order_bp.route("/checkout")
def checkout():
    if "user_id" not in session:
        flash("Please login to checkout.", "error")
        return redirect("/")

    user = get_current_user()
    cart = user.get("cart", [])

    if not cart:
        flash("Your cart is empty.", "error")
        return redirect("/cart")

    total = sum(item["price"] * item["quantity"] for item in cart)
    return render_template("checkout.html", cart=cart, total=total, user=user)


# ===== PLACE ORDER =====
@order_bp.route("/place-order", methods=["POST"])
def place_order():
    if "user_id" not in session:
        flash("Please login to place an order.", "error")
        return redirect("/")

    user = get_current_user()
    cart = user.get("cart", [])

    if not cart:
        flash("Your cart is empty.", "error")
        return redirect("/cart")

    # delivery details from form
    delivery = {
        "full_name": request.form.get("full_name"),
        "phone":     request.form.get("phone"),
        "address":   request.form.get("address"),
        "city":      request.form.get("city"),
        "state":     request.form.get("state"),
        "pincode":   request.form.get("pincode"),
    }

    total = sum(item["price"] * item["quantity"] for item in cart)
    shipping_charge = 0 if total >= 999 else 99
    grand_total = total + shipping_charge

    # generate unique order ID
    order_id = "ORD-" + uuid.uuid4().hex[:8].upper()

    order = {
        "order_id":        order_id,
        "user_id":         session["user_id"],
        "user_name":       session["user_name"],
        "items":           cart,
        "subtotal":        total,
        "shipping_charge": shipping_charge,
        "grand_total":     grand_total,
        "delivery":        delivery,
        "payment_method":  "Cash on Delivery",
        "status":          "confirmed",
        "created_at":      datetime.now(timezone.utc),
    }

    orders_collection.insert_one(order)

    # clear cart after order placed
    users_collection.update_one(
        {"_id": ObjectId(session["user_id"])},
        {"$set": {"cart": []}}
    )

    return redirect(f"/order-confirmation/{order_id}")


# ===== ORDER CONFIRMATION PAGE =====
@order_bp.route("/order-confirmation/<order_id>")
def order_confirmation(order_id):
    if "user_id" not in session:
        return redirect("/")

    order = orders_collection.find_one({"order_id": order_id})
    if not order:
        flash("Order not found.", "error")
        return redirect("/")

    return render_template("order_confirmation.html", order=order)


# ===== MY ORDERS PAGE =====
@order_bp.route("/my-orders")
def my_orders():
    if "user_id" not in session:
        flash("Please login to view your orders.", "error")
        return redirect("/")

    orders = list(orders_collection.find(
        {"user_id": session["user_id"]}
    ).sort("created_at", -1))

    return render_template("my_orders.html", orders=orders)