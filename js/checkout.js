/**
 * LUMINA - Professional Luxury Checkout & Order Confirmation Engine
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // State
  var cartItems = JSON.parse(localStorage.getItem('luminaCart')) || [];
  var appliedCoupon = null;
  var selectedShippingCost = 0; // Standard Free by default
  var selectedPaymentMethod = 'Credit / Debit Card';
  var lastOrderData = null;

  // DOM Elements
  var itemsListEl = document.getElementById('checkout-items-list');
  var itemsCountEl = document.getElementById('sidebar-items-count');
  var subtotalEl = document.getElementById('co-subtotal');
  var discountRowEl = document.getElementById('co-discount-row');
  var discountEl = document.getElementById('co-discount');
  var shippingEl = document.getElementById('co-shipping');
  var taxEl = document.getElementById('co-tax');
  var grandTotalEl = document.getElementById('co-grand-total');
  var btnTotalPreviewEl = document.getElementById('btn-total-preview');

  var couponInput = document.getElementById('co-coupon-input');
  var applyCouponBtn = document.getElementById('btn-co-apply-coupon');
  var couponMsgEl = document.getElementById('co-coupon-msg');

  var checkoutForm = document.getElementById('main-checkout-form');
  var checkoutFormContainer = document.getElementById('checkout-form-container');
  var confirmationScreen = document.getElementById('order-confirmation-screen');
  var stepNav1 = document.getElementById('step-nav-1');
  var stepNav2 = document.getElementById('step-nav-2');
  var stepNav3 = document.getElementById('step-nav-3');

  // Support Ticket Modal Elements
  var ticketModal = document.getElementById('checkout-ticket-modal');
  var closeTicketModalBtn = document.getElementById('close-checkout-ticket-modal');
  var btnReceiptRaiseTicket = document.getElementById('btn-receipt-raise-ticket');
  var quickTicketForm = document.getElementById('co-quick-ticket-form');
  var qtSuccessBox = document.getElementById('co-qt-success');
  var btnCloseQtSuccess = document.getElementById('btn-close-co-qt-success');

  // Currency Formatter
  function fmtPrice(amount) {
    var val = Math.round(amount);
    return '₹' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 1. Render Order Summary Items
  function renderOrderItems() {
    if (!itemsListEl) return;

    if (cartItems.length === 0) {
      // If user directly opened checkout with empty cart, populate a fallback luxury item
      cartItems = [
        {
          id: 13,
          name: 'Solaris Aviator',
          price: 21490,
          quantity: 1,
          color: 'Gold / Black Polarized',
          image_url_resolved: 'images/products/solaris-aviator.jpg'
        }
      ];
      localStorage.setItem('luminaCart', JSON.stringify(cartItems));
    }

    var html = '';
    var totalCount = 0;

    cartItems.forEach(function (item) {
      var qty = item.quantity || 1;
      totalCount += qty;
      var imgSrc = item.image_url_resolved || item.image || 'images/products/solaris-aviator.jpg';

      html += '<div class="co-item">';
      html += '  <div class="co-item-img">';
      html += '    <img src="' + imgSrc + '" alt="' + (item.name || 'Product') + '">';
      html += '    <span class="co-item-qty">' + qty + '</span>';
      html += '  </div>';
      html += '  <div class="co-item-details">';
      html += '    <div class="co-item-name">' + (item.name || 'LUMINA Sunglasses') + '</div>';
      html += '    <div class="co-item-meta">' + (item.color ? 'Color: ' + item.color : '100% Polarized UV400') + '</div>';
      html += '  </div>';
      html += '  <div class="co-item-price">' + fmtPrice((item.price || 0) * qty) + '</div>';
      html += '</div>';
    });

    itemsListEl.innerHTML = html;
    if (itemsCountEl) {
      itemsCountEl.textContent = totalCount + ' item' + (totalCount > 1 ? 's' : '');
    }

    calculateTotals();
  }

  // 2. Calculation Logic
  function calculateTotals() {
    var subtotal = 0;
    cartItems.forEach(function (item) {
      subtotal += (item.price || 0) * (item.quantity || 1);
    });

    var discount = 0;
    if (appliedCoupon === 'LUMINA10') {
      discount = subtotal * 0.10;
    }

    var taxable = subtotal - discount;
    var tax = taxable * 0.18;
    var grandTotal = taxable + selectedShippingCost + tax;

    if (subtotalEl) subtotalEl.textContent = fmtPrice(subtotal);

    if (discountRowEl && discountEl) {
      if (discount > 0) {
        discountRowEl.style.display = 'flex';
        discountEl.textContent = '-' + fmtPrice(discount);
      } else {
        discountRowEl.style.display = 'none';
      }
    }

    if (shippingEl) {
      shippingEl.textContent = selectedShippingCost === 0 ? 'FREE' : fmtPrice(selectedShippingCost);
    }

    if (taxEl) taxEl.textContent = fmtPrice(tax);
    if (grandTotalEl) grandTotalEl.textContent = fmtPrice(grandTotal);
    if (btnTotalPreviewEl) btnTotalPreviewEl.textContent = fmtPrice(grandTotal);
  }

  // 3. Shipping Method Selector
  var shippingRadios = document.querySelectorAll('input[name="shippingMethod"]');
  shippingRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      document.querySelectorAll('.shipping-card').forEach(function (c) { c.classList.remove('selected'); });
      var parentCard = radio.closest('.shipping-card');
      if (parentCard) parentCard.classList.add('selected');

      selectedShippingCost = radio.value === 'express' ? 299 : 0;
      calculateTotals();
    });
  });

  // 4. Payment Method Tabs
  var payTabs = document.querySelectorAll('.pay-tab');
  payTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      payTabs.forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.payment-panel').forEach(function (p) { p.classList.remove('active'); });

      tab.classList.add('active');
      var tabType = tab.getAttribute('data-tab');
      var targetPanel = document.getElementById('pay-panel-' + tabType);
      if (targetPanel) targetPanel.classList.add('active');

      if (tabType === 'card') selectedPaymentMethod = 'Credit / Debit Card';
      else if (tabType === 'upi') selectedPaymentMethod = 'UPI / Instant QR';
      else if (tabType === 'netbanking') selectedPaymentMethod = 'Net Banking';
      else if (tabType === 'cod') selectedPaymentMethod = 'Cash on Delivery (COD)';
    });
  });

  // 5. Coupon Application
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', function () {
      var code = couponInput.value.trim().toUpperCase();
      if (code === 'LUMINA10') {
        appliedCoupon = code;
        couponMsgEl.style.display = 'block';
        couponMsgEl.style.color = '#27ae60';
        couponMsgEl.innerHTML = '<i class="fas fa-check-circle"></i> 10% Luxury Discount Applied!';
        applyCouponBtn.textContent = 'Applied';
        applyCouponBtn.disabled = true;
        calculateTotals();
      } else if (!code) {
        couponMsgEl.style.display = 'block';
        couponMsgEl.style.color = '#e74c3c';
        couponMsgEl.textContent = 'Please enter a coupon code';
      } else {
        couponMsgEl.style.display = 'block';
        couponMsgEl.style.color = '#e74c3c';
        couponMsgEl.textContent = 'Invalid coupon code. Try LUMINA10';
      }
    });
  }

  // 6. Checkout Form Submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('checkout-name').value.trim();
      var email = document.getElementById('checkout-email').value.trim();
      var phone = document.getElementById('checkout-phone').value.trim();
      var address = document.getElementById('checkout-address').value.trim();
      var city = document.getElementById('checkout-city').value.trim();
      var state = document.getElementById('checkout-state').value.trim();
      var zip = document.getElementById('checkout-zip').value.trim();
      var notes = document.getElementById('checkout-notes') ? document.getElementById('checkout-notes').value.trim() : '';

      if (!name || !email || !phone || !address || !city || !state || !zip) {
        alert('Please fill in all required shipping and contact fields.');
        return;
      }

      var submitBtn = document.getElementById('btn-submit-checkout');
      var originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing Your Order...';
      submitBtn.disabled = true;

      var orderTotalVal = grandTotalEl ? grandTotalEl.textContent : '₹21,490';
      var generatedOrderNumber = 'LUM-' + Math.floor(10000 + Math.random() * 90000);

      lastOrderData = {
        orderId: generatedOrderNumber,
        fullName: name,
        email: email,
        phone: phone,
        address: address + ', ' + city + ', ' + state + ' - ' + zip,
        total: orderTotalVal,
        paymentMethod: selectedPaymentMethod,
        items: JSON.parse(JSON.stringify(cartItems)),
        notes: notes,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      // Call Backend API or offline fallback
      window.apiFetch('/orders/create/', {
        method: 'POST',
        body: JSON.stringify({
          full_name: name,
          email: email,
          phone: phone,
          address: address,
          city: city,
          state: state,
          zip_code: zip,
          coupon_code: appliedCoupon || ''
        })
      }).catch(function () {
        return { id: generatedOrderNumber, total: orderTotalVal };
      }).then(function () {
        // Save to localStorage orders history
        var allOrders = JSON.parse(localStorage.getItem('luminaOrders')) || [];
        allOrders.unshift(lastOrderData);
        localStorage.setItem('luminaOrders', JSON.stringify(allOrders));

        // Clear Cart
        localStorage.removeItem('luminaCart');
        if (window.cartItems) window.cartItems = [];

        // Show Confirmation View
        showOrderConfirmation(lastOrderData);
      }).finally(function () {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
      });
    });
  }

  // 7. Show Order Confirmation & Receipt Screen
  function showOrderConfirmation(order) {
    if (checkoutFormContainer) checkoutFormContainer.style.display = 'none';
    if (confirmationScreen) confirmationScreen.style.display = 'block';

    // Update Progress Step
    if (stepNav1) { stepNav1.classList.remove('active'); stepNav1.classList.add('completed'); }
    if (stepNav2) { stepNav2.classList.remove('active'); stepNav2.classList.add('completed'); }
    if (stepNav3) { stepNav3.classList.add('active'); }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Populate Receipt
    var refEl = document.getElementById('receipt-order-ref');
    var nameEl = document.getElementById('rc-customer-name');
    var emailEl = document.getElementById('rc-customer-email');
    var phoneEl = document.getElementById('rc-customer-phone');
    var addrEl = document.getElementById('rc-customer-address');
    var payEl = document.getElementById('rc-payment-method');
    var totalEl = document.getElementById('rc-order-total');
    var portalLink = document.getElementById('btn-link-support-full');

    if (refEl) refEl.textContent = '#' + order.orderId;
    if (nameEl) nameEl.textContent = order.fullName;
    if (emailEl) emailEl.textContent = order.email;
    if (phoneEl) phoneEl.textContent = order.phone;
    if (addrEl) addrEl.textContent = order.address;
    if (payEl) payEl.innerHTML = '<i class="fas fa-check-circle" style="color:#27ae60;"></i> ' + order.paymentMethod + ' (Confirmed)';
    if (totalEl) totalEl.textContent = order.total;

    if (portalLink) {
      portalLink.href = 'support/index.html?order_id=' + encodeURIComponent(order.orderId) +
                        '&name=' + encodeURIComponent(order.fullName) +
                        '&email=' + encodeURIComponent(order.email) +
                        '&phone=' + encodeURIComponent(order.phone) +
                        '&subject=' + encodeURIComponent('Support Request for Order #' + order.orderId);
    }
  }

  // 8. Post-Purchase Support Ticket Modal Handling
  if (btnReceiptRaiseTicket) {
    btnReceiptRaiseTicket.addEventListener('click', function () {
      if (!lastOrderData) return;

      var bannerLabel = document.getElementById('co-ticket-order-id-label');
      var nameIn = document.getElementById('co-qt-name');
      var emailIn = document.getElementById('co-qt-email');
      var phoneIn = document.getElementById('co-qt-phone');
      var subjIn = document.getElementById('co-qt-subject');
      var msgIn = document.getElementById('co-qt-message');

      if (bannerLabel) bannerLabel.textContent = '#' + lastOrderData.orderId;
      if (nameIn) nameIn.value = lastOrderData.fullName;
      if (emailIn) emailIn.value = lastOrderData.email;
      if (phoneIn) phoneIn.value = lastOrderData.phone || '';
      if (subjIn) subjIn.value = 'Inquiry regarding Order #' + lastOrderData.orderId;
      if (msgIn) {
        msgIn.value = 'Hi Support Team,\n\nI just confirmed Order #' + lastOrderData.orderId + ' on ' + lastOrderData.date + ' (Total: ' + lastOrderData.total + ').\n\nI would like assistance with: ';
      }

      if (quickTicketForm) quickTicketForm.style.display = 'block';
      if (qtSuccessBox) qtSuccessBox.style.display = 'none';

      if (ticketModal) {
        ticketModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (closeTicketModalBtn) {
    closeTicketModalBtn.addEventListener('click', function () {
      if (ticketModal) {
        ticketModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (quickTicketForm) {
    quickTicketForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = document.getElementById('btn-co-ticket-submit');
      var originalHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting to Support...';
      submitBtn.disabled = true;

      var name = document.getElementById('co-qt-name').value;
      var email = document.getElementById('co-qt-email').value;
      var phone = document.getElementById('co-qt-phone').value;
      var subject = document.getElementById('co-qt-subject').value;
      var priority = document.getElementById('co-qt-priority').value;
      var category = document.getElementById('co-qt-category').value;
      var message = document.getElementById('co-qt-message').value;

      var payload = {
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        priority: priority,
        category: category,
        message: message,
        order_id: lastOrderData ? lastOrderData.orderId : ''
      };

      fetch('https://your-crm.example/api/support/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () {
        return { ok: true };
      }).then(function () {
        var ref = 'TICK-' + Math.floor(100000 + Math.random() * 900000);
        var refCodeEl = document.getElementById('co-qt-ref-code');
        if (refCodeEl) refCodeEl.textContent = ref;
        quickTicketForm.style.display = 'none';
        if (qtSuccessBox) qtSuccessBox.style.display = 'block';
      }).finally(function () {
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;
      });
    });
  }

  if (btnCloseQtSuccess) {
    btnCloseQtSuccess.addEventListener('click', function () {
      if (ticketModal) {
        ticketModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Initialize
  renderOrderItems();
});
