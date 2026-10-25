const products = [
  { id: 1, title: "توپ فوتبال دربی ۴", price: 660000, image: "/parsa/assets/image/top1.jpg" },
  { id: 2, title: " توپ بسکتبال نایک", price: 740000, image: "/parsa/assets/image/top2.jpg" },
  { id: 3, title: "  توپ فوتبال یورو", price: 1450000, image: "/parsa/assets/image/top3.jpg" },
  { id: 4, title: "توپ فوتبال دربی استار", price: 830000, image: "/parsa/assets/image/top4.jpg" },
  { id: 5, title: "کیت تایلندی ایتالیا", price: 1500000, image: "/parsa/assets/image/lebas1.jpg" },
  { id: 6, title: " کیت تایلندی میلان", price: 1500000, image: "/parsa/assets/image/lebas2.jpg" },
  { id: 7, title: " کیت تایلندی ريال", price: 1500000, image: "/parsa/assets/image/lebas3.jpg" },
  { id: 8, title: "کیت پلیری میلان", price: 1900000, image: "/parsa/assets/image/lebas4.jpg" }
];

const discountCodes = {
  OFF10: 10,
  OFF15: 15,
  OFF25: 25,
  GOLD30: 30
};

function getCart() {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("خطا در خواندن سبد خرید:", error);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("خطا در ذخیره سبد خرید:", error);
  }
}

function getDiscount() {
  try {
    const discount = localStorage.getItem("discount");
    return discount ? JSON.parse(discount) : null;
  } catch (error) {
    console.error("خطا در خواندن تخفیف:", error);
    return null;
  }
}

function saveDiscount(discount) {
  try {
    if (discount) {
      localStorage.setItem("discount", JSON.stringify(discount));
    } else {
      localStorage.removeItem("discount");
    }
  } catch (error) {
    console.error("خطا در ذخیره تخفیف:", error);
  }
}

function formatPrice(price) {
  return Number(price).toLocaleString("fa-IR") + " تومان";
}

function addToCart(productId) {
  const cart = getCart();
  const product = products.find(p => p.id === productId);

  if (!product) return false;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  return true;
}

function renderProducts() {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return;

  productsGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button type="button" class="add-to-cart-btn" data-id="${product.id}">
          سبد خرید
        </button>
      </div>
    </div>
  `).join("");

  const buttons = document.querySelectorAll(".add-to-cart-btn");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const productId = Number(this.getAttribute("data-id"));
      const added = addToCart(productId);

      if (added) {
        window.location.href = "cart.html";
      } else {
        alert("محصول به سبد خرید اضافه نشد.");
      }
    });
  });
}

function increaseQty(productId) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item) {
    item.quantity += 1;
    saveCart(cart);
    renderCartPage();
  }
}

function decreaseQty(productId) {
  let cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }

    saveCart(cart);
    renderCartPage();
  }
}

function removeItem(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCartPage();
}

function applyDiscountCode() {
  const input = document.getElementById("discountCode");
  const message = document.getElementById("discountMessage");

  if (!input || !message) return;

  const code = input.value.trim().toUpperCase();

  if (!code) {
    message.textContent = "لطفاً کد تخفیف را وارد کنید.";
    message.className = "discount-message error";
    saveDiscount(null);
    renderCartPage();
    return;
  }

  if (discountCodes[code]) {
    const percent = discountCodes[code];
    saveDiscount({ code, percent });
    message.textContent = `کد ${code} با ${percent}% تخفیف اعمال شد.`;
    message.className = "discount-message success";
  } else {
    saveDiscount(null);
    message.textContent = "کد تخفیف نامعتبر است.";
    message.className = "discount-message error";
  }

  renderCartPage();
}

function renderCartPage() {
  const cartItems = document.getElementById("cartItems");
  const subtotalPrice = document.getElementById("subtotalPrice");
  const discountAmount = document.getElementById("discountAmount");
  const finalPrice = document.getElementById("finalPrice");

  if (!cartItems) return;

  const cart = getCart();
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="empty-cart">سبد خرید شما خالی است.</div>`;
    if (subtotalPrice) subtotalPrice.textContent = "0 تومان";
    if (discountAmount) discountAmount.textContent = "0 تومان";
    if (finalPrice) finalPrice.textContent = "0 تومان";
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;

    const card = document.createElement("div");
    card.className = "cart-item";

    card.innerHTML = `
      <div class="cart-item-box">
        <div class="cart-thumb">
          <img src="${item.image}" alt="${item.title}">
        </div>

        <div class="cart-item-details">
          <h3>${item.title}</h3>

          <div class="cart-meta">
            <span>قیمت واحد: ${formatPrice(item.price)}</span>
          </div>

          <div class="cart-actions">
            <div class="qty-box">
              <button type="button" class="qty-btn decrease-btn" data-id="${item.id}">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button type="button" class="qty-btn increase-btn" data-id="${item.id}">+</button>
            </div>

            <button type="button" class="remove-btn" data-id="${item.id}">حذف</button>
          </div>
        </div>

        <div class="cart-item-total">
          <span class="label">جمع این محصول</span>
          <strong class="price">${formatPrice(item.price * item.quantity)}</strong>
        </div>
      </div>
    `;

    cartItems.appendChild(card);
  });

  const discount = getDiscount();
  let discountValue = 0;

  if (discount && discount.percent) {
    discountValue = Math.floor((subtotal * discount.percent) / 100);
  }

  const final = subtotal - discountValue;

  if (subtotalPrice) subtotalPrice.textContent = formatPrice(subtotal);
  if (discountAmount) discountAmount.textContent = formatPrice(discountValue);
  if (finalPrice) finalPrice.textContent = formatPrice(final);

  document.querySelectorAll(".increase-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      increaseQty(Number(this.dataset.id));
    });
  });

  document.querySelectorAll(".decrease-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      decreaseQty(Number(this.dataset.id));
    });
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      removeItem(Number(this.dataset.id));
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  renderCartPage();

  const applyBtn = document.getElementById("applyDiscountBtn");
  if (applyBtn) {
    applyBtn.addEventListener("click", applyDiscountCode);
  }
});
