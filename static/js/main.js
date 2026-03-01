// └── js/
//     ├── main.js       ← navbar, burger menu, flash messages
//     ├── product.js    ← accordion, image gallery, size selector
//     ├── shop.js       ← filters, sorting (add this when you build it)
//     ├── cart.js       ← cart interactions (add when you build cart)
//     └── admin.js      ← all admin panel functionality
// the above For making difference between which Javascript code goes where☝🏻☝🏻☝🏻☝🏻☝🏻


// └── js/main.js — navbar, drawer, flash messages, auth modal, theme

document.addEventListener("DOMContentLoaded", function () {

  // =====================================================
  // NAVBAR — scroll shadow
  // =====================================================
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    });
  }

  // =====================================================
  // ACTIVE NAV LINK — highlight current page
  // =====================================================
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-links .nav-link").forEach(function (link) {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (linkPath === currentPath || (currentPath !== "/" && linkPath !== "/" && currentPath.startsWith(linkPath))) {
      link.classList.add("active");
    }
  });


  // =====================================================
  // MOBILE DRAWER
  // =====================================================
  const navToggle   = document.getElementById("nav-toggle");
  const drawer      = document.getElementById("mobile-drawer");
  const overlay     = document.getElementById("mobile-overlay");
  const drawerClose = document.getElementById("drawer-close");

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("open");
    navToggle.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    navToggle.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (navToggle) navToggle.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  // Close drawer on link click
  if (drawer) {
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeDrawer();
      closeModal();
    }
  });


  // =====================================================
  // FLASH MESSAGE AUTO DISMISS
  // =====================================================
  document.querySelectorAll(".flash-message").forEach(function (el) {
    setTimeout(function () {
      el.style.transition = "opacity 0.5s";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 500);
    }, 5000);
  });


  // =====================================================
  // AUTH MODAL OPEN / CLOSE
  // =====================================================
  const modal      = document.getElementById("auth-modal");
  const loginBtn   = document.getElementById("login-btn");
  const closeBtn   = document.getElementById("auth-modal-close");
  const footerLoginBtn = document.getElementById("footer-login-btn");

  function openModal(tab) {
    if (!modal) return;
    modal.classList.add("open");
    if (tab) switchTab(tab);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
  }

  if (loginBtn)      loginBtn.addEventListener("click", () => openModal("login"));
  if (footerLoginBtn) footerLoginBtn.addEventListener("click", (e) => { e.preventDefault(); openModal("login"); });
  if (closeBtn)      closeBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }


  // =====================================================
  // TAB SWITCHING (Login / Register)
  // =====================================================
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchTab(this.dataset.tab);
    });
  });

  document.querySelectorAll(".switch-tab").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      switchTab(this.dataset.tab);
    });
  });

  function switchTab(tab) {
    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    document.querySelectorAll(".tab-content").forEach(function (content) {
      content.classList.remove("active");
    });
    const target = document.getElementById("tab-" + tab);
    if (target) target.classList.add("active");
  }


  // =====================================================
  // PASSWORD TOGGLE
  // =====================================================
  document.querySelectorAll(".eye-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const input = document.getElementById(this.dataset.target);
      if (!input) return;
      if (input.type === "password") {
        input.type = "text";
        this.textContent = "🙈";
      } else {
        input.type = "password";
        this.textContent = "👁";
      }
    });
  });


  // =====================================================
  // DARK / LIGHT THEME TOGGLE
  // =====================================================
  const themeToggle = document.getElementById("theme-toggle");
  const iconMoon    = document.getElementById("icon-moon");
  const iconSun     = document.getElementById("icon-sun");

  function applyTheme(dark) {
    document.body.classList.toggle("dark-mode", dark);
    if (iconMoon) iconMoon.style.display = dark ? "none"  : "";
    if (iconSun)  iconSun.style.display  = dark ? ""      : "none";
  }

  // Restore saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) applyTheme(savedTheme === "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const isDark = document.body.classList.toggle("dark-mode");
      applyTheme(isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }


  // =====================================================
  // FOOTER YEAR
  // =====================================================
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});