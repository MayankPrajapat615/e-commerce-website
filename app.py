from flask import Flask, render_template, request, redirect
from db import products_collection
from datetime import datetime

app = Flask(__name__)

@app.route('/') 
def home():
    return render_template('home.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/kurtas')
def kurtas():
    return render_template('kurta_detail.html')

@app.route('/about-Us')
def about():
    return render_template('about-us.html')

@app.route('/contact-Us')
def contact():
    return render_template('contact-us.html')

@app.route('/sustainability')
def services():
    return render_template('sustainability.html')

@app.route("/admin/add-product", methods=["GET"])
def admin_add_product():
    return render_template("admin_add_product.html")

@app.route("/admin/add-product", methods=["POST"])
def add_product():
    name = request.form.get("name")
    description = request.form.get("description")
    price = request.form.get("price")
    stock = request.form.get("stock")
    images = request.form.getlist("images")  # multiple inputs

    # Backend validation
    if not name or not description or not price or not stock:
        return "All fields are required", 400

    try:
        price = float(price)
        stock = int(stock)
    except ValueError:
        return "Invalid price or stock", 400

    if price < 0 or stock < 0:
        return "Price and stock must be positive", 400

    product = {
        "name": name,
        "description": description,
        "price": price,
        "stock": stock,
        "images": images,
        "created_at": datetime.utcnow()
    }

    products_collection.insert_one(product)

    return redirect("/admin/add-product")

if __name__ == "__main__":
    app.run(debug=True)
