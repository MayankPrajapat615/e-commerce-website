def validate_product_form(form):

    name = form.get("name")
    price = form.get("price")
    stock = form.get("stock")

    if not name:
        return "Product name is required"

    try:
        float(price)
        int(stock)
    except (ValueError, TypeError):
        return "Invalid price or stock value"

    return None