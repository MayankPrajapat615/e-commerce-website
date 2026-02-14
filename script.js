// Theme toggle (same)
document.getElementById('theme-toggle').onclick = () => {
  document.body.classList.toggle('dark-mode');
  document.getElementById('icon-moon').style.display = document.body.classList.contains('dark-mode') ? 'none' : 'inline';
  document.getElementById('icon-sun').style.display = document.body.classList.contains('dark-mode') ? 'inline' : 'none';
};

// Products (with description)
const PRODUCTS = [
  { id: 1, name: 'Blue Geometric Kurta', price: 1499, img: 'https://www.nihalfashions.com/blog/wp-content/uploads/sky-blue-digital-rayon-casual-kurta-pajama-nmk-5087-1-998x779.jpg', category: 'men', desc: 'Modern geometric print on soft rayon fabric. Perfect for casual outings and semi-formal events.' },
  { id: 2, name: 'Gold Floral Kurta', price: 1999, img: 'https://pub-95ccf2d427eb4955a7de1c41d3fa57dd.r2.dev/blog-g3fashion-com/2019/10/thumb-1.jpg', category: 'men', desc: 'Premium cotton-silk blend with golden floral motifs. Ideal for festivals and evening wear.' },
  { id: 3, name: 'Green Damask Kurta', price: 1299, img: 'https://www.shaadidukaan.com/vogue/wp-content/uploads/2019/09/Waistcoat.jpg', category: 'men', desc: 'Classic damask pattern in deep green. Lightweight cotton for daily ethnic comfort.' },
  { id: 4, name: 'Beige Tribal Kurta', price: 1599, img: 'http://glamourental.com/cdn/shop/articles/5_Reasons_Men_Should_Choose_Kurta_Pajama_as_an_Indian_Party_Wear_1.jpg?v=1723135140', category: 'men', desc: 'Hand-block printed tribal design on pure cotton. Relaxed fit with side slits.' },
  { id: 5, name: 'Pink Printed Kurta', price: 1799, img: 'https://www.beyoung.in/blog/wp-content/uploads/2019/06/Printed-Mens-Kurta-Designs-2020-1024x709.jpg', category: 'men', desc: 'Soft pastel pink with intricate block prints. Breathable for summer weddings.' },
  { id: 6, name: 'Navy Ethnic Kurta', price: 1399, img: 'https://www.nihalfashions.com/blog/wp-content/uploads/sky-blue-digital-rayon-casual-kurta-pajama-nmk-5087-1-998x779.jpg', category: 'men', desc: 'Rich navy blue with subtle ethnic embroidery. Comfortable cotton blend.' }
];

const grid = document.getElementById('products-grid');
const subCategoriesDiv = document.getElementById('sub-categories');

function renderProducts(category = 'all') {
  grid.innerHTML = '';
  const filtered = PRODUCTS.filter(p => category === 'all' || p.category === category);
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="description">${p.desc}</p>
      <div class="price">₹${p.price}</div>
      <button data-id="${p.id}">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// Sub-categories on main category click (Myntra style)
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.category;
    renderProducts(cat);

    // Show sub-categories bar (static example – tu chahe to dynamic kar sakta hai)
    if (cat !== 'all') {
      subCategoriesDiv.innerHTML = `
        <button class="sub-active">Kurtas</button>
        <button>Kurta Sets</button>
        <button>Sherwanis</button>
        <button>Nehru Jackets</button>
        <button>Indo-Western</button>
        <button>Accessories</button>
      `;
      subCategoriesDiv.classList.remove('hidden');
    } else {
      subCategoriesDiv.classList.add('hidden');
    }
  };
});

// Initial render
renderProducts();

// Cart Logic (same as before – full working)
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCart() {
  document.getElementById('cart-count').textContent = cart.reduce((t, i) => t + i.qty, 0);

  const list = document.getElementById('cart-items-list');
  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>₹${item.price} × ${item.qty}</p>
      </div>
      <button class="qty-minus" data-id="${item.id}">-</button>
      <span>${item.qty}</span>
      <button class="qty-plus" data-id="${item.id}">+</button>
      <button class="remove" data-id="${item.id}">×</button>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cart-subtotal').textContent = document.getElementById('cart-total').textContent = `₹${total}`;

  localStorage.setItem('cart', JSON.stringify(cart));
}

grid.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
    const id = +e.target.dataset.id;
    const prod = PRODUCTS.find(p => p.id === id);
    const exist = cart.find(i => i.id === id);
    if (exist) exist.qty++;
    else cart.push({ ...prod, qty: 1 });
    updateCart();
    const notif = document.getElementById('notification');
    notif.textContent = `${prod.name} added to cart!`;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
  }
});

document.getElementById('cart-btn').onclick = () => {
  updateCart();
  document.getElementById('cart-page').classList.add('visible');
};

document.getElementById('close-cart').onclick = () => document.getElementById('cart-page').classList.remove('visible');

document.getElementById('cart-items-list').addEventListener('click', e => {
  const id = +e.target.dataset.id;
  if (!id) return;
  if (e.target.classList.contains('qty-plus')) {
    cart.find(i => i.id === id).qty++;
  } else if (e.target.classList.contains('qty-minus')) {
    const item = cart.find(i => i.id === id);
    if (item.qty > 1) item.qty--;
    else cart = cart.filter(i => i.id !== id);
  } else if (e.target.classList.contains('remove')) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCart();
});

document.getElementById('proceed-checkout').onclick = () => alert('Proceed to payment (demo)');

// Initial load
updateCart();

// Profile button & dropdown
const profileBtn = document.getElementById('profile-btn');
const profileDropdown = document.getElementById('profile-dropdown-menu');

profileBtn.onclick = () => {
  document.getElementById('auth-modal').classList.add('open');
};

// Modal close
document.querySelector('.auth-modal-close').onclick = () => {
  document.getElementById('auth-modal').classList.remove('open');
};

// Tab switch (Login/Register)
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
  };
});

// Login
document.getElementById('login-form').onsubmit = async e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      alert('Login successful!');
      location.reload();
    } else {
      alert(data.msg || 'Login failed');
    }
  } catch (err) {
    alert('Backend not running or network error');
  }
};

// Register (same tarah)
document.getElementById('register-form').onsubmit = async e => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  try {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      alert('Registered & logged in!');
      location.reload();
    } else {
      alert(data.msg || 'Registration failed');
    }
  } catch (err) {
    alert('Error');
  }
};

// Logged-in check
if (localStorage.getItem('token')) {
  document.getElementById('auth-links').style.display = 'none';
  document.getElementById('user-info').style.display = 'flex';
  document.getElementById('user-name').textContent = localStorage.getItem('userName');
}

// Logout
document.getElementById('logout-btn').onclick = () => {
  localStorage.clear();
  location.reload();
};