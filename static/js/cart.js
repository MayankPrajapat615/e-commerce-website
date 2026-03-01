// ===== ADD TO CART =====
document.addEventListener("DOMContentLoaded", function () {

  const addToCartBtn = document.querySelector(".btn-cart");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {

      const productId    = this.dataset.productId;
      const productName  = this.dataset.productName;
      const productPrice = this.dataset.productPrice;
      const productImage = this.dataset.productImage;

      fetch("/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id:    productId,
          product_name:  productName,
          product_price: productPrice,
          product_image: productImage,
          quantity:      1
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.message === "login_required") {
          // open auth modal if not logged in
          document.getElementById("auth-modal").classList.add("open");
        } else if (data.success) {
          // update cart count in navbar
          updateCartCount(data.cart_count);
          showCartNotification(productName);
        }
      })
      .catch(err => console.error("Cart error:", err));

    });
  }

});


// ===== REMOVE ITEM (called from cart.html) =====
function removeItem(productId) {
  fetch("/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("cart-item-" + productId).remove();
      updateCartCount(data.cart_count);
      updateTotal(data.total);

      // show empty state if no items left
      if (data.cart_count === 0) {
        location.reload();
      }
    }
  });
}


// ===== UPDATE QUANTITY (called from cart.html) =====
function updateQty(productId, newQty) {
  fetch("/cart/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity: newQty })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      updateCartCount(data.cart_count);
      updateTotal(data.total);

      if (newQty <= 0) {
        document.getElementById("cart-item-" + productId).remove();
        if (data.cart_count === 0) location.reload();
      } else {
        document.getElementById("qty-" + productId).textContent = newQty;
      }
    }
  });
}


// ===== HELPERS =====
function updateCartCount(count) {
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = count;
}

function updateTotal(total) {
  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = "₹ " + Math.round(total);
}

function showCartNotification(name) {
  const notif = document.createElement("div");
  notif.className = "cart-notif";
  notif.textContent = `✓ ${name} added to cart`;
  document.body.appendChild(notif);

  setTimeout(() => notif.classList.add("show"), 10);
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 400);
  }, 2500);
}