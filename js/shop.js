/**
 * shop.js - Shop page for LUMINA
 */

document.addEventListener('DOMContentLoaded', function () {

  var filterBtn = document.querySelector('.shop-filter-btn');
  var filterPanel = document.querySelector('.shop-filter-panel');
  var filterOverlay = document.querySelector('.shop-filter-overlay');
  var filterClose = document.querySelector('.shop-filter-close');
  var filterClear = document.querySelector('.shop-filter-clear');
  var catBtns = document.querySelectorAll('.shop-cat');
  var sortSelect = document.querySelector('.shop-sort');
  var priceRange = document.querySelector('.shop-price-range');
  var priceVal = document.querySelector('.shop-price-val');
  var resultCount = document.querySelector('.shop-result-count');
  var activeFilters = document.querySelector('.shop-active-filters');
  var grid = document.querySelector('.shop-grid');
  var loadMore = document.querySelector('.shop-load-more');
  var viewBtns = document.querySelectorAll('.shop-view-btn');

  var currentFilters = {
    category: 'all',
    brands: [],
    colors: [],
    priceMax: 40000,
    sort: 'popular'
  };

  // ===== VIEW TOGGLE =====
  viewBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      viewBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var view = btn.getAttribute('data-view');
      if (grid) {
        if (view === 'list') {
          grid.classList.add('list-view');
        } else {
          grid.classList.remove('list-view');
        }
      }
    });
  });

  // ===== FILTER TOGGLE (mobile) =====
  if (filterBtn && filterPanel) {
    filterBtn.addEventListener('click', function () {
      filterPanel.classList.toggle('active');
      if (filterOverlay) filterOverlay.classList.toggle('active');
      document.body.style.overflow = filterPanel.classList.contains('active') ? 'hidden' : '';
    });
    if (filterClose) {
      filterClose.addEventListener('click', function () {
        filterPanel.classList.remove('active');
        if (filterOverlay) filterOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    if (filterOverlay) {
      filterOverlay.addEventListener('click', function () {
        filterPanel.classList.remove('active');
        filterOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }

  // ===== CATEGORY CHIPS =====
  catBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      catBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilters.category = btn.getAttribute('data-cat');
      applyFilters();
    });
  });

  // ===== BRAND CHECKBOXES =====
  document.querySelectorAll('.shop-check input[type="checkbox"]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      currentFilters.brands = [];
      document.querySelectorAll('.shop-check input[type="checkbox"]').forEach(function (c) {
        if (c.checked) currentFilters.brands.push(c.value);
      });
      applyFilters();
    });
  });

  // ===== COLOR SWATCHES =====
  document.querySelectorAll('.shop-color').forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      this.classList.toggle('active');
      currentFilters.colors = [];
      document.querySelectorAll('.shop-color.active').forEach(function (s) {
        currentFilters.colors.push(s.getAttribute('data-color'));
      });
      applyFilters();
    });
  });

  // ===== PRICE RANGE =====
  if (priceRange && priceVal) {
    priceRange.addEventListener('input', function () {
      var val = parseInt(this.value, 10);
      priceVal.textContent = fmtPrice(val);
      currentFilters.priceMax = val;

      // Update slider track color
      var min = parseInt(priceRange.min, 10);
      var max = parseInt(priceRange.max, 10);
      var percent = ((val - min) / (max - min)) * 100;
      priceRange.style.background = 'linear-gradient(90deg, var(--color-primary) ' + percent + '%, var(--color-light-3) ' + percent + '%)';

      applyFilters();
    });

    // Initialize slider color
    var initPercent = ((parseInt(priceRange.value, 10) - parseInt(priceRange.min, 10)) / (parseInt(priceRange.max, 10) - parseInt(priceRange.min, 10))) * 100;
    priceRange.style.background = 'linear-gradient(90deg, var(--color-primary) ' + initPercent + '%, var(--color-light-3) ' + initPercent + '%)';
  }

  // ===== SORT =====
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      currentFilters.sort = this.value;
      applyFilters();
    });
  }

  // ===== APPLY FILTERS =====
  function applyFilters() {
    if (!grid) return;
    var cards = Array.from(grid.querySelectorAll('.shop-card'));
    var total = cards.length;

    var filtered = cards.filter(function (card) {
      var cat = card.getAttribute('data-category') || '';
      var priceEl = card.querySelector('.shop-card-price');
      var price = priceEl ? parseInt(priceEl.textContent.replace(/[₹$,]/g, '')) || 0 : 0;
      var brand = (card.getAttribute('data-brand') || '').toLowerCase();

      if (currentFilters.category !== 'all' && cat !== currentFilters.category) return false;
      if (price > currentFilters.priceMax) return false;
      if (currentFilters.brands.length > 0 && currentFilters.brands.indexOf(brand) === -1) return false;
      if (currentFilters.colors.length > 0) {
        var cardColors = (card.getAttribute('data-colors') || '').split(',').map(function (c) { return c.trim(); });
        var colorMatch = currentFilters.colors.some(function (c) { return cardColors.indexOf(c) !== -1; });
        if (!colorMatch) return false;
      }
      return true;
    });

    // Sort
    var sortVal = currentFilters.sort;
    if (sortVal === 'price-low') {
      filtered.sort(function (a, b) { var pa = parseInt((a.querySelector('.shop-card-price') || {}).textContent.replace(/[₹$,]/g, '')) || 0; var pb = parseInt((b.querySelector('.shop-card-price') || {}).textContent.replace(/[₹$,]/g, '')) || 0; return pa - pb; });
    } else if (sortVal === 'price-high') {
      filtered.sort(function (a, b) { var pa = parseInt((a.querySelector('.shop-card-price') || {}).textContent.replace(/[₹$,]/g, '')) || 0; var pb = parseInt((b.querySelector('.shop-card-price') || {}).textContent.replace(/[₹$,]/g, '')) || 0; return pb - pa; });
    } else if (sortVal === 'rating') {
      filtered.sort(function (a, b) { return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating')); });
    } else if (sortVal === 'newest') {
      filtered.sort(function (a, b) { return parseInt(b.getAttribute('data-id')) - parseInt(a.getAttribute('data-id')); });
    }

    // Animate cards out
    cards.forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px) scale(0.95)';
    });

    setTimeout(function () {
      cards.forEach(function (card) { card.style.display = 'none'; });
      filtered.forEach(function (card, index) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(function () {
          card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
          grid.appendChild(card);
        }, index * 60);
      });

      // Handle no results
      var noResults = grid.querySelector('.shop-no-results');
      if (noResults) noResults.remove();

      if (filtered.length === 0) {
        var noRes = document.createElement('div');
        noRes.className = 'shop-no-results';
        noRes.innerHTML = '<div class="shop-no-results-icon"><i class="fas fa-search"></i></div>' +
          '<h3>No products found</h3>' +
          '<p>Try adjusting your filters or search criteria</p>';
        grid.appendChild(noRes);
      }
    }, 200);

    if (resultCount) {
      resultCount.textContent = filtered.length + ' of ' + total + ' Products';
    }

    renderFilterTags();
  }

  // ===== RENDER FILTER TAGS =====
  function renderFilterTags() {
    if (!activeFilters) return;
    activeFilters.innerHTML = '';

    if (currentFilters.category !== 'all') {
      addTag('Category: ' + currentFilters.category, function () {
        resetCategoryFilter();
        applyFilters();
      });
    }
    currentFilters.brands.forEach(function (b) {
      addTag('Brand: ' + b, function () {
        currentFilters.brands = currentFilters.brands.filter(function (x) { return x !== b; });
        document.querySelectorAll('.shop-check input[type="checkbox"]').forEach(function (cb) {
          if (cb.value === b) cb.checked = false;
        });
        applyFilters();
      });
    });
    currentFilters.colors.forEach(function (c) {
      addTag('Color', function () {
        currentFilters.colors = [];
        document.querySelectorAll('.shop-color').forEach(function (s) { s.classList.remove('active'); });
        applyFilters();
      });
    });
    if (currentFilters.priceMax < 40000) {
      addTag('Max: ' + fmtPrice(currentFilters.priceMax), function () {
        currentFilters.priceMax = 40000;
        if (priceRange) priceRange.value = 40000;
        if (priceVal) priceVal.textContent = fmtPrice(40000);
        applyFilters();
      });
    }

    function addTag(label, onRemove) {
      var tag = document.createElement('span');
      tag.className = 'shop-filter-tag';
      tag.innerHTML = label + ' <i class="fas fa-times"></i>';
      tag.querySelector('i').addEventListener('click', function (e) {
        e.stopPropagation();
        onRemove();
      });
      activeFilters.appendChild(tag);
    }
  }

  function resetCategoryFilter() {
    catBtns.forEach(function (b) { b.classList.remove('active'); });
    var allBtn = document.querySelector('.shop-cat[data-cat="all"]');
    if (allBtn) allBtn.classList.add('active');
    currentFilters.category = 'all';
  }

  // ===== CLEAR ALL =====
  if (filterClear) {
    filterClear.addEventListener('click', function () {
      currentFilters = {
        category: 'all',
        brands: [],
        colors: [],
        priceMax: 40000,
        sort: 'popular'
      };
      resetCategoryFilter();
      document.querySelectorAll('.shop-check input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
      document.querySelectorAll('.shop-color').forEach(function (s) { s.classList.remove('active'); });
      if (priceRange) {
        priceRange.value = 40000;
        priceRange.style.background = 'linear-gradient(90deg, var(--color-primary) 100%, var(--color-light-3) 100%)';
      }
      if (priceVal) priceVal.textContent = fmtPrice(40000);
      if (sortSelect) sortSelect.value = 'popular';
      applyFilters();
    });
  }

  // ===== CARD EVENTS =====
  if (grid) {
    function getProductFromCard(card) {
      var name = card.querySelector('.shop-card-name');
      if (!name) return null;
      return window.productData.find(function (p) { return p.name === name.textContent.trim(); });
    }

    // Quick view
    grid.addEventListener('click', function (e) {
      var qvBtn = e.target.closest('.shop-card-qv');
      if (qvBtn) {
        var card = qvBtn.closest('.shop-card');
        if (!card) return;
        var product = getProductFromCard(card);
        if (product && window.openQuickView) {
          window.openQuickView(product);
        } else {
          window.location.href = 'product.html';
        }
      }
    });

    // Add to cart
    grid.addEventListener('click', function (e) {
      var atcBtn = e.target.closest('.shop-card-atc');
      if (atcBtn) {
        var card = atcBtn.closest('.shop-card');
        if (!card) return;
        var product = getProductFromCard(card);
        if (product) {
          window.addToCart({ id: product.id, name: product.name, price: product.price, image: product.image_url_resolved || product.image, quantity: 1 });
          atcBtn.innerHTML = '<i class="fas fa-check"></i> Added';
          atcBtn.classList.add('added');
          setTimeout(function () {
            atcBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
            atcBtn.classList.remove('added');
          }, 1500);
        }
      }
    });

    // Wishlist toggle
    grid.addEventListener('click', function (e) {
      var wlBtn = e.target.closest('.shop-card-wishlist');
      if (wlBtn) {
        e.preventDefault();
        var card = wlBtn.closest('.shop-card');
        var product = getProductFromCard(card);
        if (!product) return;
        var idx = -1;
        if (window.wishlistItems) {
          idx = window.wishlistItems.findIndex(function (i) { return i.id === product.id; });
        }
        if (idx > -1) {
          window.wishlistItems.splice(idx, 1);
          wlBtn.classList.remove('active');
          wlBtn.querySelector('i').className = 'far fa-heart';
        } else {
          if (window.wishlistItems) {
            window.wishlistItems.push(product);
            wlBtn.classList.add('active');
            wlBtn.querySelector('i').className = 'fas fa-heart';
          }
        }
        if (window.saveWishlist) window.saveWishlist();
      }
    });
  }

  // ===== INIT WISHLIST STATES =====
  function initWishlistStates() {
    if (!window.wishlistItems || !grid) return;
    grid.querySelectorAll('.shop-card-wishlist').forEach(function (btn) {
      var card = btn.closest('.shop-card');
      if (!card) return;
      var id = parseInt(card.getAttribute('data-id'), 10);
      if (window.wishlistItems.find(function (i) { return i.id === id; })) {
        btn.classList.add('active');
        btn.querySelector('i').className = 'fas fa-heart';
      }
    });
  }
  initWishlistStates();

  // ===== CLOSE FILTER ON RESIZE =====
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && filterPanel && filterPanel.classList.contains('active')) {
      filterPanel.classList.remove('active');
      if (filterOverlay) filterOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ===== LOAD MORE =====
  if (loadMore) {
    loadMore.addEventListener('click', function () {
      this.textContent = 'All Products Loaded';
      this.style.opacity = '0.5';
      this.style.pointerEvents = 'none';
    });
  }

  // ===== UPDATE COLOR SWATCH RENDERING =====
  if (typeof window.renderColorSwatches === 'function') {
    window.renderColorSwatches('.shop-card[data-colors]', '.shop-card-colors');
  }

  // ===== INIT =====
  applyFilters();

  // Update result text on initial load
  setTimeout(function () {
    if (resultCount && grid) {
      var visible = grid.querySelectorAll('.shop-card:not([style*="display: none"])').length;
      resultCount.textContent = visible + ' of ' + grid.querySelectorAll('.shop-card').length + ' Products';
    }
  }, 50);

  // Re-render after dynamic products load from API
  window.addEventListener('productsLoaded', function () {
    setTimeout(function () {
      applyFilters();
      if (resultCount && grid) {
        var visible = grid.querySelectorAll('.shop-card:not([style*="display: none"])').length;
        resultCount.textContent = visible + ' of ' + grid.querySelectorAll('.shop-card').length + ' Products';
      }
    }, 100);
  });
});
