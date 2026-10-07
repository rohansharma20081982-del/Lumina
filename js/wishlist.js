document.addEventListener('DOMContentLoaded', function () {

  var wishlistGrid = document.querySelector('.wishlist-grid');
  var emptyState = document.querySelector('.wishlist-empty');
  var wishlistCountEl = document.querySelector('.wishlist-count');

  // ===== LOAD WISHLIST ITEMS =====
  function renderWishlist() {
    if (!wishlistGrid) return;

    var items = window.wishlistItems || [];
    var hasItems = items.length > 0;

    if (emptyState) {
      emptyState.classList.toggle('active', !hasItems);
    }

    if (wishlistCountEl) {
      wishlistCountEl.textContent = '(' + items.length + ' item' + (items.length !== 1 ? 's' : '') + ')';
    }

    if (!hasItems) {
      wishlistGrid.innerHTML = '';
      return;
    }

    var html = '';
    items.forEach(function (product) {
      var imgSrc = product.image_url_resolved || product.image || product.image_url || 'images/products/solaris-aviator.jpg';
      var oldPrice = product.oldPrice || product.old_price || '';

      html += '<div class="wishlist-card" data-id="' + product.id + '">';
      html += '<div class="wl-image">';
      html += '<button class="wl-remove" data-id="' + product.id + '" aria-label="Remove item"><i class="fas fa-times"></i></button>';
      html += '<img src="' + imgSrc + '" alt="' + product.name + '" loading="lazy">';
      html += '</div>';
      html += '<div class="wl-body">';
      html += '<h3 class="wl-name">' + product.name + '</h3>';
      html += '<div class="wl-price">';
      if (oldPrice) {
        html += '<span class="old-price">' + fmtPrice(oldPrice) + '</span> ';
      }
      html += fmtPrice(product.price) + '</div>';
      html += '<button class="wl-cart-btn" data-id="' + product.id + '"><i class="fas fa-shopping-bag"></i> Move to Cart</button>';
      html += '</div>';
      html += '</div>';
    });

    wishlistGrid.innerHTML = html;

    wishlistGrid.querySelectorAll('.wl-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        removeFromWishlist(id);
      });
    });

    wishlistGrid.querySelectorAll('.wl-cart-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'), 10);
        moveToCart(id);
      });
    });
  }

  // ===== REMOVE FROM WISHLIST =====
  function removeFromWishlist(id) {
    window.wishlistItems = window.wishlistItems.filter(function (item) { return item.id !== id; });
    window.saveWishlist();
    renderWishlist();
    showToast('Removed from wishlist');
  }

  // ===== MOVE TO CART =====
  function moveToCart(id) {
    var product = window.wishlistItems.find(function (item) { return item.id === id; });
    if (!product) return;
    window.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url_resolved || product.image || product.image_url || 'images/products/solaris-aviator.jpg',
      quantity: 1
    });
    removeFromWishlist(id);
    showToast('Moved to cart!');
  }

  // ===== SHARE WISHLIST =====
  var shareBtn = document.querySelector('.share-wishlist-btn');

  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({
          title: 'My LUMINA Wishlist',
          text: 'Check out my wishlist from LUMINA Sunglasses!',
          url: window.location.href
        }).catch(function () {});
      } else {
        var dummy = document.createElement('input');
        dummy.value = window.location.href;
        document.body.appendChild(dummy);
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showToast('Wishlist link copied!');
      }
    });
  }

  // ===== TOAST NOTIFICATION =====
  function showToast(message) {
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2500);
  }

  // Initial render
  renderWishlist();

});
