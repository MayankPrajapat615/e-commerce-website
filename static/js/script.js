// this is for the accordion in the FAQ section of the product page
function toggleAccordion(header) {
  const item = header.parentElement;
  const isOpen = item.classList.contains('open');

  // close all
  document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

  // open clicked one if it wasn't already open
  if (!isOpen) {
    item.classList.add('open');
  }
}


//========================Frontend Validation (Popup Alerts)==============================>
document.getElementById("productForm").addEventListener("submit", function(e) {

    const name = document.querySelector("input[name='name']").value.trim();
    const price = document.querySelector("input[name='price']").value;
    const stock = document.querySelector("input[name='stock']").value;

    if (!name) {
        alert("Product name is required");
        e.preventDefault();
        return;
    }

    if (price <= 0) {
        alert("Price must be greater than 0");
        e.preventDefault();
        return;
    }

    if (stock < 0) {
        alert("Stock cannot be negative");
        e.preventDefault();
        return;
    }
});