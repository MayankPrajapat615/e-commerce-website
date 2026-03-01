// ===== product.js — accordion, image gallery, size selector, modals =====

// =====================================================
// ACCORDION
// =====================================================
function toggleAccordion(header) {
  const item = header.parentElement;
  const isOpen = item.classList.contains('open');
  // close all
  document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
  // open this one if it was closed
  if (!isOpen) item.classList.add('open');
}

// =====================================================
// IMAGE SWITCHER + zoom on hover
// =====================================================
function switchImage(btn, src) {
  const mainImg = document.getElementById('main-product-image');
  if (!mainImg) return;

  // Fade transition
  mainImg.style.opacity = '0';
  mainImg.style.transition = 'opacity 0.2s ease';
  setTimeout(() => {
    mainImg.src = src;
    mainImg.style.opacity = '1';
  }, 180);

  // Update active thumbnail
  document.querySelectorAll('.thumb-btn').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

// =====================================================
// SIZE SELECTOR
// =====================================================
function selectSize(btn) {
  document.querySelectorAll('.size-btn').forEach(s => s.classList.remove('selected'));
  btn.classList.add('selected');
  // hide error hint if visible
  const hint = document.getElementById('size-hint');
  if (hint) hint.style.display = 'none';
}

// =====================================================
// VALIDATE SIZE on Add to Cart / Buy Now
// =====================================================
function hasSelectedSize() {
  const hasSizes = document.querySelector('.size-btn');
  if (!hasSizes) return true; // no size option = no validation needed
  return !!document.querySelector('.size-btn.selected');
}

document.addEventListener('DOMContentLoaded', function () {

  const addCartBtn = document.getElementById('add-to-cart-btn');
  const buyNowBtn  = document.getElementById('buy-now-btn');
  const sizeHint   = document.getElementById('size-hint');

  function warnSize() {
    if (sizeHint) {
      sizeHint.style.display = 'block';
      // scroll size section into view
      sizeHint.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // shake animation
      const sizeOpts = document.querySelector('.size-options');
      if (sizeOpts) {
        sizeOpts.classList.add('shake');
        setTimeout(() => sizeOpts.classList.remove('shake'), 500);
      }
    }
  }

  if (addCartBtn) {
    addCartBtn.addEventListener('click', function (e) {
      if (!hasSelectedSize()) { e.stopImmediatePropagation(); warnSize(); }
    }, true); // capture phase so it fires before cart.js
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function () {
      if (!hasSelectedSize()) { warnSize(); return; }
      // If cart.js handles add-to-cart, replicate the data here
      const id    = this.dataset.productId;
      const name  = this.dataset.productName;
      const price = this.dataset.productPrice;
      const image = this.dataset.productImage;
      const selectedSize = document.querySelector('.size-btn.selected')?.textContent?.trim() || '';
      // Add to cart then redirect — reuse addToCart from cart.js if available
      if (typeof addToCart === 'function') {
        addToCart(id, name, price, image, selectedSize);
      }
      window.location.href = '/checkout';
    });
  }

  // =====================================================
  // WISHLIST TOGGLE
  // =====================================================
  const wishlistBtn = document.getElementById('wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function () {
      this.classList.toggle('wishlisted');
      const isWishlisted = this.classList.contains('wishlisted');
      // tiny feedback
      this.style.transform = 'scale(1.25)';
      setTimeout(() => { this.style.transform = ''; }, 200);
      // Persist to localStorage for now
      const productId = document.getElementById('add-to-cart-btn')?.dataset.productId;
      if (productId) {
        const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (isWishlisted && !saved.includes(productId)) saved.push(productId);
        else if (!isWishlisted) { const idx = saved.indexOf(productId); if (idx > -1) saved.splice(idx, 1); }
        localStorage.setItem('wishlist', JSON.stringify(saved));
      }
    });

    // Restore wishlist state on load
    const productId = document.getElementById('add-to-cart-btn')?.dataset.productId;
    if (productId) {
      const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (saved.includes(productId)) wishlistBtn.classList.add('wishlisted');
    }
  }

  // =====================================================
  // SHAKE KEYFRAME (injected via JS for simplicity)
  // =====================================================
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
    .shake { animation: shake 0.45s ease; }
  `;
  document.head.appendChild(style);

});

// =====================================================
// SIZE GUIDE MODAL
// =====================================================
function openSizeGuide() {
  const el = document.getElementById('size-guide-overlay');
  if (el) el.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSizeGuide() {
  const el = document.getElementById('size-guide-overlay');
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}

// =====================================================
// REVIEW MODAL
// =====================================================
function openReviewModal() {
  const el = document.getElementById('review-modal-overlay');
  if (el) el.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeReviewModal() {
  const el = document.getElementById('review-modal-overlay');
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}

// Star picker for review modal
document.addEventListener('DOMContentLoaded', function () {
  const stars = document.querySelectorAll('.pick-star');
  const ratingInput = document.getElementById('review-rating');

  stars.forEach(function (star, idx) {
    star.addEventListener('mouseover', function () {
      stars.forEach((s, i) => s.classList.toggle('lit', i <= idx));
    });
    star.addEventListener('click', function () {
      if (ratingInput) ratingInput.value = idx + 1;
      stars.forEach((s, i) => {
        s.classList.toggle('lit', i <= idx);
        s.dataset.selected = i <= idx ? '1' : '0';
      });
    });
  });

  const picker = document.getElementById('star-picker');
  if (picker) {
    picker.addEventListener('mouseleave', function () {
      // restore to selected state
      const selected = ratingInput ? parseInt(ratingInput.value) : 0;
      stars.forEach((s, i) => s.classList.toggle('lit', i < selected));
    });
  }
});

// Dummy review submit (replace with actual AJAX call)
function submitReview(e) {
  e.preventDefault();
  closeReviewModal();
  // Flash a success message
  const container = document.querySelector('.flash-container') || (() => {
    const c = document.createElement('div');
    c.className = 'flash-container';
    document.body.appendChild(c);
    return c;
  })();
  const msg = document.createElement('div');
  msg.className = 'flash-message flash-success';
  msg.textContent = 'Thank you! Your review has been submitted.';
  container.appendChild(msg);
  setTimeout(() => { msg.style.opacity = '0'; msg.style.transition = 'opacity 0.5s'; setTimeout(() => msg.remove(), 500); }, 4000);
}

// Close modals on Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { closeSizeGuide(); closeReviewModal(); }
});