from flask import Blueprint, render_template, request, redirect, session, flash

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/admin/login", methods=["GET", "POST"])
def login():

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