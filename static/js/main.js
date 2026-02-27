// └── js/
//     ├── main.js       ← navbar, burger menu, flash messages
//     ├── product.js    ← accordion, image gallery, size selector
//     ├── shop.js       ← filters, sorting (add this when you build it)
//     ├── cart.js       ← cart interactions (add when you build cart)
//     └── admin.js      ← all admin panel functionality


// the above For making difference between which Javascript code goes where☝🏻☝🏻☝🏻☝🏻☝🏻

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        document.querySelectorAll('.flash-message').forEach(function(el) {
            el.style.transition = "opacity 0.5s";
            el.style.opacity = "0";
            setTimeout(() => el.remove(), 500);
        });
    }, 3000);
});