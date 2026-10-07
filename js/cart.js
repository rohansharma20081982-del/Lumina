document.addEventListener('DOMContentLoaded', function () {

  var cartContainer = document.querySelector('.cart-items-container');
  var cartEmpty = document.querySelector('.empty-cart');
  var cartSummary = document.querySelector('.order-summary');
  var subtotalEl = document.getElementById('subtotal');
  var shippingEl = document.getElementById('shipping');
  var taxEl = document.getElementById('tax');
  var discountEl = document.getElementById('discount');
  var totalEl = document.getElementById('total');
  var couponInput = document.querySelector('.coupon-input input');
  var applyCouponBtn = document.querySelector('.coupon-input button');
  var checkoutBtn = document.querySelector('.checkout-btn');
  var clearCartBtn = document.getElementById('clear-cart-btn');

  var appliedCoupon = null;
  var SHIPPING_THRESHOLD = 1499;
  var SHIPPING_COST = 99;
  var TAX_RATE = 0.18;

  function renderCart() {
    if (!cartContainer) return;

    var items = window.cartItems || [];
    var hasItems = items.length > 0;

    if (cartEmpty) cartEmpty.style.display = hasItems ? 'none' : 'block';
    if (cartSummary) cartSummary.style.display = hasItems ? 'block' : 'none';

    if (!hasItems) {
      cartContainer.innerHTML = '';
      updateCartTitle(0);
      updateTotals();
      return;
    }

    var html = '';
    items.forEach(function (item, index) {
      var itemTotal = (item.price || 0) * (item.quantity || 1);
      html += '<div class="cart-item" data-index="' + index + '" data-id="' + item.id + '">';
      html += '<div class="cart-item-image">';
      html += '<img src="' + (item.image_url_resolved || item.image || 'images/products/solaris-aviator.jpg') + '" alt="' + item.name + '">';
      html += '</div>';
      html += '<div class="cart-item-info">';
      html += '<span class="ci-brand">LUMINA</span>';
      html += '<h3 class="ci-name">' + item.name + '</h3>';
      if (item.color) html += '<span class="ci-color">Color: ' + item.color + '</span>';
      html += '<div class="ci-price">' + fmtPrice(item.price) + '</div>';
      html += '</div>';
      html += '<div class="cart-item-qty">';
      html += '<button class="qty-minus" data-index="' + index + '" aria-label="Decrease quantity">-</button>';
      html += '<input type="number" class="qty-input" value="' + (item.quantity || 1) + '" min="1" max="99" aria-label="Quantity" data-index="' + index + '">';
      html += '<button class="qty-plus" data-index="' + index + '" aria-label="Increase quantity">+</button>';
      html += '</div>';
      html += '<div class="cart-item-total">' + fmtPrice(itemTotal) + '</div>';
      html += '<button class="cart-item-remove" data-index="' + index + '" aria-label="Remove item"><i class="fas fa-trash-alt"></i></button>';
      html += '</div>';
    });

    cartContainer.innerHTML = html;

    updateCartTitle(items.length);

    cartContainer.querySelectorAll('button.qty-minus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        if (window.cartItems[idx] && window.cartItems[idx].quantity > 1) {
          window.cartItems[idx].quantity--;
          window.saveCart();
          renderCart();
        }
      });
    });

    cartContainer.querySelectorAll('button.qty-plus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        if (window.cartItems[idx] && window.cartItems[idx].quantity < 99) {
          window.cartItems[idx].quantity++;
          window.saveCart();
          renderCart();
        }
      });
    });

    cartContainer.querySelectorAll('.qty-input').forEach(function (input) {
      input.addEventListener('change', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        var val = parseInt(this.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 99) val = 99;
        if (window.cartItems[idx]) {
          window.cartItems[idx].quantity = val;
          window.saveCart();
          renderCart();
        }
      });
    });

    cartContainer.querySelectorAll('.cart-item-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        window.cartItems.splice(idx, 1);
        window.saveCart();
        renderCart();
      });
    });

    updateTotals();
  }

  function updateCartTitle(count) {
    var title = document.getElementById('cart-title-count');
    if (title) {
      title.textContent = count === 0 ? '(0 items)' : '(' + count + ' item' + (count > 1 ? 's' : '') + ')';
    }
  }

  function updateTotals() {
    var items = window.cartItems || [];
    var subtotal = 0;
    items.forEach(function (item) {
      subtotal += (item.price || 0) * (item.quantity || 1);
    });

    var discountAmount = 0;
    if (appliedCoupon === 'LUMINA10') {
      discountAmount = subtotal * 0.1;
    }

    var discountedSubtotal = subtotal - discountAmount;
    var shipping = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    var tax = discountedSubtotal * TAX_RATE;
    var total = discountedSubtotal + shipping + tax;

    if (subtotalEl) subtotalEl.textContent = fmtPrice(subtotal);
    if (discountEl) {
      if (discountAmount > 0) {
        discountEl.textContent = '-' + fmtPrice(discountAmount);
        discountEl.parentElement.style.display = 'flex';
      } else {
        discountEl.parentElement.style.display = 'none';
      }
    }
    if (shippingEl) {
      if (shipping === 0) {
        shippingEl.textContent = 'FREE';
        shippingEl.classList.add('free');
      } else {
        shippingEl.textContent = fmtPrice(shipping);
        shippingEl.classList.remove('free');
      }
    }
    if (taxEl) taxEl.textContent = fmtPrice(tax);
    if (totalEl) totalEl.textContent = fmtPrice(total);

    var progressEl = document.querySelector('.free-shipping-progress .progress-bar');
    var messageEl = document.querySelector('.free-shipping-progress .shipping-message');
    if (progressEl && messageEl) {
      if (subtotal >= SHIPPING_THRESHOLD) {
        messageEl.textContent = 'You qualify for free shipping!';
        progressEl.style.width = '100%';
      } else {
        var remaining = SHIPPING_THRESHOLD - subtotal;
        messageEl.textContent = 'Add ' + fmtPrice(remaining) + ' more for free shipping';
        var percent = (subtotal / SHIPPING_THRESHOLD) * 100;
        progressEl.style.width = Math.min(percent, 99) + '%';
      }
    }
  }

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', function () {
      var code = couponInput.value.trim().toUpperCase();
      if (code === 'LUMINA10') {
        appliedCoupon = code;
        couponInput.classList.remove('error');
        couponInput.classList.add('success');
        applyCouponBtn.textContent = 'Applied!';
        applyCouponBtn.disabled = true;
        showCouponMessage('10% discount applied!', 'success');
        renderCart();
      } else if (code === '') {
        showCouponMessage('Please enter a coupon code', 'error');
      } else {
        couponInput.classList.add('error');
        showCouponMessage('Invalid coupon code', 'error');
      }
    });

    couponInput.addEventListener('input', function () {
      couponInput.classList.remove('error', 'success');
      applyCouponBtn.textContent = 'Apply';
      applyCouponBtn.disabled = false;
      if (appliedCoupon) {
        appliedCoupon = null;
        renderCart();
      }
    });
  }

  function showCouponMessage(msg, type) {
    var existing = document.querySelector('.coupon-message');
    if (existing) existing.remove();
    var el = document.createElement('p');
    el.className = 'coupon-message ' + type;
    el.textContent = msg;
    var wrapper = document.querySelector('.coupon-section');
    if (wrapper) wrapper.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 4000);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      var items = window.cartItems || [];
      if (items.length === 0) return;

      var fullName = prompt('Full Name:');
      if (!fullName) return;
      var email = prompt('Email:');
      if (!email) return;
      var phone = prompt('Phone:');
      if (!phone) return;
      var address = prompt('Address:');
      if (!address) return;
      var city = prompt('City:');
      if (!city) return;
      var state = prompt('State:');
      if (!state) return;
      var zip = prompt('ZIP Code:');
      if (!zip) return;

      var originalText = checkoutBtn.innerHTML;
      checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      checkoutBtn.disabled = true;

      apiFetch('/orders/create/', {
        method: 'POST',
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone: phone,
          address: address,
          city: city,
          state: state,
          zip_code: zip,
          coupon_code: appliedCoupon || ''
        })
      }).then(function (order) {
        window.cartItems = [];
        appliedCoupon = null;
        if (couponInput) {
          couponInput.value = '';
          couponInput.classList.remove('success', 'error');
        }
        if (applyCouponBtn) {
          applyCouponBtn.textContent = 'Apply';
          applyCouponBtn.disabled = false;
        }
        window.saveCart();
        renderCart();
        alert('Order #' + order.id + ' placed successfully!\nTotal: ' + fmtPrice(order.total) + '\nThank you for your purchase!');
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
      }).catch(function () {
        alert('Order failed. Please try again.');
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
      });
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function () {
      if (window.cartItems.length === 0) return;
      if (confirm('Are you sure you want to clear your cart?')) {
        window.cartItems = [];
        appliedCoupon = null;
        if (couponInput) {
          couponInput.value = '';
          couponInput.classList.remove('success', 'error');
        }
        if (applyCouponBtn) {
          applyCouponBtn.textContent = 'Apply';
          applyCouponBtn.disabled = false;
        }
        window.saveCart();
        renderCart();
        showToast('Cart cleared');
      }
    });
  }

  function showToast(message) {
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2500);
  }

  renderCart();

});
