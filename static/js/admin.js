// Product form validation
document.getElementById("productForm").addEventListener("submit", function(e) {
    const name = document.querySelector("input[name='name']").value.trim();
    const price = document.querySelector("input[name='price']").value;
    const stock = document.querySelector("input[name='stock']").value;

    if (!name) { alert("Product name is required"); e.preventDefault(); return; }
    if (price <= 0) { alert("Price must be greater than 0"); e.preventDefault(); return; }
    if (stock < 0) { alert("Stock cannot be negative"); e.preventDefault(); return; }
});

// Flash message auto-dismiss
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded");
    console.log("Flash elements found:", document.querySelectorAll('.flash-message').length);
    
    setTimeout(function() {
        console.log("Timeout fired");
        document.querySelectorAll('.flash-message').forEach(function(el) {
            console.log("Fading:", el);
            el.style.transition = "opacity 0.5s";
            el.style.opacity = "0";
            setTimeout(() => el.remove(), 500);
        });
    }, 3000);
});