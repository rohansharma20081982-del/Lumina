/**
 * product.js - Product detail page functionality for LUMINA Sunglasses
 */

document.addEventListener('DOMContentLoaded', function () {

  // ===== IMAGE GALLERY =====
  var mainImage = document.querySelector('.main-image img');
  var thumbnails = document.querySelectorAll('.thumbnail-list .thumbnail');

  if (mainImage && thumbnails.length) {
    thumbnails.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbnails.forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        var imgSrc = thumb.getAttribute('data-image') || thumb.querySelector('img').src;
        mainImage.src = imgSrc;
        mainImage.setAttribute('data-zoom', imgSrc);
      });
    });
  }

  // ===== IMAGE ZOOM =====
  var imageContainer = document.querySelector('.main-image');
  if (imageContainer && mainImage) {
    imageContainer.addEventListener('mousemove', function (e) {
      var rect = imageContainer.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImage.style.transformOrigin = x + '% ' + y + '%';
      mainImage.style.transform = 'scale(2)';
    });

    imageContainer.addEventListener('mouseleave', function () {
      mainImage.style.transformOrigin = 'center center';
      mainImage.style.transform = 'scale(1)';
    });
  }

  // ===== COLOR SELECTION =====
  var colorSwatches = document.querySelectorAll('.product-colors .color-swatch');
  var selectedColorInput = document.getElementById('selected-color');

  colorSwatches.forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      colorSwatches.forEach(function (s) { s.classList.remove('selected'); });
      swatch.classList.add('selected');
      if (selectedColorInput) {
        selectedColorInput.value = swatch.getAttribute('data-color') || swatch.style.backgroundColor;
      }
    });
  });

  // ===== QUANTITY SELECTOR =====
  var qtyInput = document.getElementById('qty-input');
  var qtyMinus = document.querySelector('.qty-btn.minus');
  var qtyPlus = document.querySelector('.qty-btn.plus');

  if (qtyInput) {
    function updateQty() {
      var val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) qtyInput.value = 1;
      if (val > 99) qtyInput.value = 99;
      if (qtyMinus) qtyMinus.disabled = parseInt(qtyInput.value, 10) <= 1;
      if (qtyPlus) qtyPlus.disabled = parseInt(qtyInput.value, 10) >= 99;
    }

    qtyInput.addEventListener('input', updateQty);
    qtyInput.addEventListener('change', updateQty);

    if (qtyMinus) {
      qtyMinus.addEventListener('click', function () {
        var v = parseInt(qtyInput.value, 10);
        if (v > 1) qtyInput.value = v - 1;
        updateQty();
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener('click', function () {
        var v = parseInt(qtyInput.value, 10);
        if (v < 99) qtyInput.value = v + 1;
        updateQty();
      });
    }

    updateQty();
  }

  // ===== ADD TO CART BUTTON =====
  var addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      var product = getProductData();
      if (!product) return;
      var qty = parseInt(qtyInput ? qtyInput.value : '1', 10);
      product.quantity = qty;
      window.addToCart(product);
      showAddedAnimation(addToCartBtn);
    });
  }

  // ===== BUY NOW BUTTON =====
  var buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function () {
      var product = getProductData();
      if (!product) return;
      var qty = parseInt(qtyInput ? qtyInput.value : '1', 10);
      product.quantity = qty;
      window.addToCart(product);
      window.location.href = 'cart.html';
    });
  }

  function getProductData() {
    var nameEl = document.querySelector('.product-title');
    var priceEl = document.querySelector('.current-price');
    var imageEl = document.querySelector('.main-image img');
    var idEl = document.querySelector('[data-product-id]');

    if (!nameEl) return null;
    return {
      id: idEl ? parseInt(idEl.getAttribute('data-product-id'), 10) : Date.now(),
      name: nameEl.textContent.trim(),
      price: priceEl ? parseFloat(priceEl.textContent.replace(/[₹$,]/g, '')) : 0,
      image: imageEl ? imageEl.src : 'images/products/solaris-aviator.jpg',
      color: selectedColorInput ? selectedColorInput.value : ''
    };
  }

  function showAddedAnimation(btn) {
    var original = btn.textContent;
    btn.textContent = 'Added to Cart ✓';
    btn.classList.add('added');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('added');
    }, 2000);
  }

  // ===== PRODUCT TABS =====
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        tabPanels.forEach(function (panel) {
          panel.classList.remove('active');
          if (panel.id === target) {
            panel.classList.add('active');
          }
        });
      });
    });
  }

  // ===== STICKY ADD TO CART ON MOBILE =====
  var stickyCart = document.querySelector('.sticky-add-to-cart');
  var addToCartSection = document.querySelector('.add-to-cart-section');

  if (stickyCart && addToCartSection) {
    window.addEventListener('scroll', function () {
      var sectionRect = addToCartSection.getBoundingClientRect();
      if (sectionRect.bottom < 0) {
        stickyCart.classList.add('visible');
      } else {
        stickyCart.classList.remove('visible');
      }
    });

    var stickyAddBtn = stickyCart.querySelector('.add-to-cart-btn');
    if (stickyAddBtn) {
      stickyAddBtn.addEventListener('click', function () {
        if (addToCartBtn) addToCartBtn.click();
      });
    }
  }

  // ===== FLOATING PURCHASE CARD =====
  var purchaseCard = document.querySelector('.purchase-card');
  if (purchaseCard) {
    window.addEventListener('scroll', function () {
      var stopPoint = document.querySelector('.product-tabs');
      if (!stopPoint) return;
      var stopRect = stopPoint.getBoundingClientRect();
      var cardHeight = purchaseCard.offsetHeight;
      var windowHeight = window.innerHeight;

      if (stopRect.top < windowHeight && stopRect.top > 0) {
        var offset = stopRect.top - windowHeight + cardHeight + 40;
        if (offset > 0) {
          purchaseCard.style.transform = 'translateY(' + (-offset) + 'px)';
        }
      } else if (stopRect.top <= 0) {
        purchaseCard.style.transform = 'translateY(' + (-(windowHeight - cardHeight - 40)) + 'px)';
      } else {
        purchaseCard.style.transform = 'translateY(0)';
      }
    });
  }

});
