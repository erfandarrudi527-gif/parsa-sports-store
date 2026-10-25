// سیستم انیمیشن زنده، ریسپانسیو و تعاملی فروشگاه ولیعصر V4.0

// سیستم Toast Messages
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'check-circle';
  if (type === 'error') icon = 'x-circle';
  if (type === 'info') icon = 'info';
  if (type === 'warning') icon = 'warning-circle';

  toast.innerHTML = `
    <i class="ph ph-${icon} toast-icon"></i>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => { toast.classList.add('show'); }, 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }, 3500);
};

// انیمیشن اسکرول (Scroll Reveal with IntersectionObserver)
window.initScrollReveal = function() {
  const targets = document.querySelectorAll('.reveal-on-scroll, .product-card, .category-card, .feature-item, .accordion-item, .flash-sale-banner, .footer-col');
  
  targets.forEach((el, index) => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
      if (!el.classList.contains('delay-1') && !el.classList.contains('delay-2')) {
        el.classList.add(`delay-${(index % 4) + 1}`);
      }
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Remove visible so it animates again when scrolling up and down repeatedly!
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  targets.forEach(el => observer.observe(el));
};


// اسلایدر بنر هیرو (Auto-slider)
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4500);
}

// تایمر معکوس پیشنهاد شگفت‌انگیز
function initCountdownTimer() {
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  let targetTime = Date.now() + (14 * 3600 * 1000 + 45 * 60 * 1000);

  function update() {
    const diff = Math.max(0, targetTime - Date.now());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// جستجوی زنده در هدر
function initHeaderLiveSearch() {
  const input = document.getElementById('header-search-input');
  const popup = document.getElementById('header-live-search-popup');

  if (!input || !popup) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (q.length < 2) {
      popup.classList.remove('show');
      return;
    }

    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)).slice(0, 5);
    
    if (matches.length === 0) {
      popup.innerHTML = `<div style="padding:14px; text-align:center; color:var(--text-muted); font-size:0.88rem;">محصولی پیدا نشد</div>`;
    } else {
      const detailPrefix = window.location.pathname.includes('/Page/') ? 'product-detail.html?id=' : 'Page/product-detail.html?id=';
      popup.innerHTML = matches.map(p => `
        <a href="${detailPrefix}${p.id}" class="search-result-item">
          <img src="${getCorrectImagePath(p.image)}" alt="${p.name}" />
          <div class="search-result-info">
            <h5>${p.name}</h5>
            <span>${formatPrice(p.price)}</span>
          </div>
        </a>
      `).join('');
    }
    popup.classList.add('show');
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !popup.contains(e.target)) {
      popup.classList.remove('show');
    }
  });
}

// مدال مشاهده سریع محصول (Quick View Modal)
function openQuickViewModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  let modal = document.getElementById('quick-view-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quick-view-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close-btn" onclick="closeQuickViewModal()"><i class="ph ph-x"></i></button>
        <div id="quick-view-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const imgPath = getCorrectImagePath(product.image);
  const detailUrl = window.location.pathname.includes('/Page/') ? `product-detail.html?id=${product.id}` : `Page/product-detail.html?id=${product.id}`;

  const body = document.getElementById('quick-view-body');
  body.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: center;">
      <div style="height: 320px; border-radius: var(--radius-md); overflow: hidden; background: var(--surface-alt);">
        <img src="${imgPath}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <div>
        <span style="color:var(--primary); font-size:0.8rem; font-weight:800;">${product.categoryName}</span>
        <h2 style="font-size:1.5rem; font-weight:900; margin: 8px 0 12px; line-height: 1.3;">${product.name}</h2>
        <div style="color:var(--accent); font-weight:800; font-size:0.9rem; margin-bottom:14px;">
          <i class="ph-fill ph-star"></i> ${product.rating} از ۵.۰ (${product.reviewsCount} نظر)
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px; line-height:1.7;">${product.description}</p>
        
        <div style="font-size:1.6rem; font-weight:900; color:var(--primary); margin-bottom:24px;">${formatPrice(product.price)}</div>

        <div style="display:flex; gap:12px;">
          <button class="btn-primary" style="flex-grow:1; justify-content:center;" onclick="window.cartStore.addItem(${product.id}, 1); closeQuickViewModal();">
            <i class="ph ph-shopping-bag"></i> افزودن به سبد خرید
          </button>
          <a href="${detailUrl}" class="btn-secondary">جزئیات کامل</a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('show');
}

function closeQuickViewModal() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.classList.remove('show');
}

// سیستم FAQ آکاردئونی
function initFaqAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}

// ایجاد منوی چسبان پایین موبایل (Mobile Bottom Navigation)
function initMobileBottomNav() {
  let nav = document.getElementById('mobile-bottom-nav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.id = 'mobile-bottom-nav';
    nav.className = 'mobile-bottom-nav';

    const homeUrl = window.location.pathname.includes('/Page/') ? '../index.html' : 'index.html';
    const shopUrl = window.location.pathname.includes('/Page/') ? 'products.html' : 'Page/products.html';
    const cartUrl = window.location.pathname.includes('/Page/') ? 'cart.html' : 'Page/cart.html';
    const authUrl = window.location.pathname.includes('/Page/') ? 'login.html' : 'Page/login.html';

    nav.innerHTML = `
      <a href="${homeUrl}" class="mobile-bottom-nav-item">
        <i class="ph ph-house"></i>
        <span>خانه</span>
      </a>
      <a href="${shopUrl}" class="mobile-bottom-nav-item">
        <i class="ph ph-shopping-bag"></i>
        <span>فروشگاه</span>
      </a>
      <a href="${cartUrl}" class="mobile-bottom-nav-item">
        <i class="ph ph-shopping-cart-simple"></i>
        <span>سبد خرید</span>
        <span class="cart-badge" style="top:-4px; left:8px;">0</span>
      </a>
      <a href="${authUrl}" class="mobile-bottom-nav-item">
        <i class="ph ph-user"></i>
        <span>حساب کاربری</span>
      </a>
    `;

    document.body.appendChild(nav);
  }
}

// ساخت کارت محصول با کلاس‌های reveal-on-scroll
function createProductCardHtml(product, index = 0) {
  const imageSrc = getCorrectImagePath(product.image);
  const detailUrl = window.location.pathname.includes('/Page/') || window.location.pathname.includes('/pages/')
    ? `product-detail.html?id=${product.id}`
    : `Page/product-detail.html?id=${product.id}`;

  const oldPriceHtml = product.oldPrice > product.price 
    ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` 
    : '';

  const discountBadge = product.discount > 0 
    ? `<span class="badge badge-discount">${product.discount}٪ تخفیف</span>` 
    : '';

  const newBadge = product.isNew 
    ? `<span class="badge badge-new">جدید</span>` 
    : '';

  const delayClass = `delay-${(index % 4) + 1}`;

  return `
    <div class="product-card reveal-on-scroll ${delayClass}">
      <div class="product-card-image-wrap">
        <div class="card-badges">
          ${discountBadge}
          ${newBadge}
        </div>
        <a href="${detailUrl}">
          <img src="${imageSrc}" alt="${product.name}" class="product-card-img" loading="lazy" onError="this.src='https://via.placeholder.com/300x300?text=Sports+Item'"/>
        </a>
        <div class="quick-view-btn-wrap">
          <button class="quick-add-btn" onclick="window.cartStore.addItem(${product.id}, 1)">
            <i class="ph ph-shopping-bag-open"></i> افزودن به سبد
          </button>
          <button class="quick-eye-btn" onclick="openQuickViewModal(${product.id})" title="مشاهده سریع">
            <i class="ph ph-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-card-body">
        <span class="product-category-tag">${product.categoryName}</span>
        <h3 class="product-title">
          <a href="${detailUrl}">${product.name}</a>
        </h3>
        <div class="product-rating">
          <div class="stars">
            <i class="ph-fill ph-star"></i>
            <span>${product.rating}</span>
          </div>
          <span class="reviews">(${product.reviewsCount} نظر)</span>
        </div>
        <div class="product-price-box">
          <div class="prices">
            ${oldPriceHtml}
            <span class="current-price">${formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initCountdownTimer();
  initHeaderLiveSearch();
  initFaqAccordion();
  initMobileBottomNav();
  initScrollReveal();

  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.navbar-items');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
});
