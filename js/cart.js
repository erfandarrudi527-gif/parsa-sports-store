function renderCartPage() {
  const cartItems = document.getElementById("cartItems");
  const subtotalPrice = document.getElementById("subtotalPrice");

  if (!cartItems) return;

  const cart = getCart();
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="empty-cart">سبد خرید شما خالی است.</div>`;
    if (subtotalPrice) subtotalPrice.textContent = "0 تومان";
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div class="cart-item-box">
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <div class="cart-meta">
            <span>قیمت واحد: ${formatPrice(item.price)}</span>
            <span>تعداد: ${item.quantity}</span>
          </div>
        </div>

        <div class="cart-item-total">
          <span class="label">جمع این محصول</span>
          <strong class="price">${formatPrice(item.price * item.quantity)}</strong>
        </div>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  if (subtotalPrice) {
    subtotalPrice.textContent = formatPrice(subtotal);
  }
}
