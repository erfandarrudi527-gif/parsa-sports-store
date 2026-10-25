// سیستم مدیریت سبد خرید (Cart Store)
class CartStore {
  constructor() {
    this.cartKey = 'valiasr_sports_cart';
    this.appliedDiscount = 0; // percentage
    this.discountCode = '';
  }

  getCart() {
    try {
      const data = localStorage.getItem(this.cartKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartBadge();
  }

  addItem(productId, quantity = 1, selectedSize = 'L') {
    const product = PRODUCTS.find(p => p.id === parseInt(productId, 10));
    if (!product) return false;

    let cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: selectedSize
      });
    }

    this.saveCart(cart);
    if (window.showToast) {
      window.showToast(`«${product.name}» به سبد خرید اضافه شد`, 'success');
    }
    return true;
  }

  updateQuantity(productId, size, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      cart = cart.filter(item => !(item.id === productId && item.size === size));
    } else {
      const item = cart.find(i => i.id === productId && i.size === size);
      if (item) item.quantity = newQty;
    }
    this.saveCart(cart);
  }

  removeItem(productId, size) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    this.saveCart(cart);
    if (window.showToast) {
      window.showToast('محصول از سبد خرید حذف شد', 'info');
    }
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
    this.updateCartBadge();
  }

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  applyDiscountCode(code) {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'VALIASR10' || cleanCode === 'NOROOZ') {
      this.appliedDiscount = 10;
      this.discountCode = cleanCode;
      return { success: true, discount: 10, message: 'کد تخفیف ۱۰٪ با موفقیت اعمال شد' };
    } else if (cleanCode === 'SPORT20' || cleanCode === 'PARSA20') {
      this.appliedDiscount = 20;
      this.discountCode = cleanCode;
      return { success: true, discount: 20, message: 'کد تخفیف ۲۰٪ ویژه با موفقیت اعمال شد' };
    } else {
      return { success: false, discount: 0, message: 'کد تخفیف وارد شده معتبر نیست' };
    }
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discountAmount = Math.round((subtotal * this.appliedDiscount) / 100);
    const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 35000;
    return {
      subtotal,
      discountAmount,
      shipping,
      total: subtotal - discountAmount + shipping
    };
  }

  updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCartCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }
}

window.cartStore = new CartStore();
document.addEventListener('DOMContentLoaded', () => {
  window.cartStore.updateCartBadge();
});
