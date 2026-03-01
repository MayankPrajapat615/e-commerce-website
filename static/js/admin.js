// Product form validation
const form = document.getElementById("productForm");

if (form) {
    form.addEventListener("submit", function(e) {
        const nameInput = document.querySelector("#productForm input[name='name']");
        const price = document.querySelector("#productForm input[name='price']").value;
        const stock = document.querySelector("#productForm input[name='stock']").value;
        const name = nameInput ? nameInput.value.trim() : "";

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
}


//====This is a dynamic image preview edition and delete buttons logic for add product page

document.addEventListener('DOMContentLoaded', () => {

  // handle fill state for existing boxes
  bindFileInput(document.querySelectorAll('.file-upload-box input[type="file"]'));

  // add more button
  document.getElementById('addMoreBox').addEventListener('click', () => {
    const grid = document.getElementById('uploadGrid');
    const addMoreBox = document.getElementById('addMoreBox');
    const count = grid.querySelectorAll('.file-upload-box:not(.add-more-box)').length + 1;

    const label = document.createElement('label');
    label.classList.add('file-upload-box');
    label.innerHTML = `
      <input type="file" name="images" accept="image/*" hidden>
      <span class="file-upload-icon">+</span>
      <span class="file-upload-text">Image ${count}</span>
    `;

    grid.insertBefore(label, addMoreBox);  // insert before add-more box
    bindFileInput(label.querySelectorAll('input[type="file"]'));  // bind to new box
  });

});

function bindFileInput(inputs) {
    inputs.forEach(input => {
    input.addEventListener('change', () => {
        const box = input.closest('.file-upload-box');
        const icon = box.querySelector('.file-upload-icon');
        const text = box.querySelector('.file-upload-text');
    
        if (input.files.length > 0) {
        icon.textContent = '✓';
        text.textContent = input.files[0].name.length > 15
            ? input.files[0].name.slice(0, 15) + '...'
            : input.files[0].name;
        box.classList.add('filled');
    
        // ADDED: add remove button if not already there
        if (!box.querySelector('.remove-box-btn')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.classList.add('remove-box-btn');
            btn.textContent = '✕';
            btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();  // stops label from reopening file picker
            box.remove();         // removes the entire box
            });
            box.appendChild(btn);
        }
        }
    });
    });
}
