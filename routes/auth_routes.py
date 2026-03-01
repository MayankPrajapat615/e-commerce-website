from flask import Blueprint, render_template, request, redirect, session, flash, jsonify
from db import users_collection
import bcrypt

auth_bp = Blueprint("auth", __name__)


# ===== ADMIN ROUTES =====
@auth_bp.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if username == "admin" and password == "1234":
            session["admin_logged_in"] = True
            flash("Logged in successfully", "success")
            return redirect("/admin/add-product")

        flash("Invalid credentials", "error")

    return render_template("admin_login.html")


@auth_bp.route("/logout")
def logout():
    session.pop("admin_logged_in", None)
    flash("Logged out successfully", "success")
    return redirect("/admin/login")


# ===== USER ROUTES =====
@auth_bp.route("/register", methods=["POST"])
def register():
    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")

    # check if email already exists
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        flash("Email already registered. Please login.", "error")
        return redirect("/")

    # hash the password before storing
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password
    })

    flash("Account created! Please login.", "success")
    return redirect("/")


@auth_bp.route("/user-login", methods=["POST"])
def user_login():
    email = request.form.get("email")
    password = request.form.get("password")

    user = users_collection.find_one({"email": email})

    if not user:
        flash("No account found with that email.", "error")
        return redirect("/")

    # check password against hashed password
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        flash("Incorrect password.", "error")
        return redirect("/")

    session["user_id"] = str(user["_id"])
    session["user_name"] = user["name"]
    flash(f"Welcome back, {user['name']}!", "success")
    return redirect("/")


@auth_bp.route("/user-logout")
def user_logout():
    session.pop("user_id", None)
    session.pop("user_name", None)
    flash("Logged out successfully.", "success")
    return redirect("/")