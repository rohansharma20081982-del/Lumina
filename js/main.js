document.addEventListener('DOMContentLoaded', function () {

  window.cartItems = JSON.parse(localStorage.getItem('luminaCart')) || [];
  window.wishlistItems = JSON.parse(localStorage.getItem('luminaWishlist')) || [];

  window.productData = [];

  var fallbackProducts = [
    { id: 1, name: 'Aviator Classic', slug: 'aviator-classic', brand: 'LUMINA', price: 21490, old_price: 25990, rating: 4.8, reviews_count: 124, description: 'Timeless aviator design with premium gold-plated frame and UV400 polarized lenses.', image: null, image_url: null, image_url_resolved: 'images/products/solaris-aviator.jpg', colors: ['#1a1a2e', '#c9a84c', '#2d2d2d'], badge: 'Best Seller', stock: 10, featured: true, category_name: 'Aviator', category_slug: 'aviator', discount_percentage: 17 },
    { id: 2, name: 'Wayfarer Elite', slug: 'wayfarer-elite', brand: 'LUMINA', price: 16990, old_price: 21990, rating: 4.6, reviews_count: 98, description: 'Modern take on the classic wayfarer with lightweight titanium frame.', image: null, image_url: null, image_url_resolved: 'images/products/wayfarer-elite.jpg', colors: ['#1a1a2e', '#8b4513'], badge: null, stock: 10, featured: true, category_name: 'Wayfarer', category_slug: 'wayfarer', discount_percentage: 23 },
    { id: 3, name: 'Round Gold', slug: 'round-gold', brand: 'LUMINA', price: 23990, old_price: 27990, rating: 4.9, reviews_count: 156, description: 'Vintage-inspired round frames in lustrous gold with blue-tinted glass lenses.', image: null, image_url: null, image_url_resolved: 'images/products/round-gold.jpg', colors: ['#c9a84c', '#1a1a2e'], badge: 'New', stock: 10, featured: true, category_name: 'Round', category_slug: 'round', discount_percentage: 14 },
    { id: 4, name: 'Sport Shield', slug: 'sport-shield', brand: 'LUMINA', price: 14990, old_price: 18990, rating: 4.5, reviews_count: 72, description: 'High-performance wraparound sunglasses with shatterproof polycarbonate lenses.', image: null, image_url: null, image_url_resolved: 'images/products/sport-shield.jpg', colors: ['#2d2d2d', '#1a1a2e', '#c9a84c'], badge: 'Sale', stock: 10, featured: false, category_name: 'Sport', category_slug: 'sport', discount_percentage: 21 },
    { id: 5, name: 'Cat Eye Noir', slug: 'cat-eye-noir', brand: 'LUMINA', price: 25990, old_price: 30990, rating: 4.7, reviews_count: 89, description: 'Elegant cat-eye silhouette with hand-polished acetate and gradient lenses.', image: null, image_url: null, image_url_resolved: 'images/products/cat-eye-noir.jpg', colors: ['#1a1a2e', '#c9a84c'], badge: null, stock: 10, featured: true, category_name: 'Cat Eye', category_slug: 'cat-eye', discount_percentage: 16 },
    { id: 6, name: 'Navigator Silver', slug: 'navigator-silver', brand: 'LUMINA', price: 22990, old_price: 26990, rating: 4.4, reviews_count: 63, description: 'Sleek navigator style with brushed silver frame and anti-reflective coating.', image: null, image_url: null, image_url_resolved: 'images/products/navigator-silver.jpg', colors: ['#c0c0c0', '#1a1a2e'], badge: null, stock: 10, featured: false, category_name: 'Aviator', category_slug: 'aviator', discount_percentage: 15 },
    { id: 7, name: 'Square Titanium', slug: 'square-titanium', brand: 'LUMINA', price: 27990, old_price: 33990, rating: 4.8, reviews_count: 112, description: 'Bold square frame crafted from lightweight titanium with spring hinges.', image: null, image_url: null, image_url_resolved: 'images/products/square-titanium.jpg', colors: ['#2d2d2d', '#c9a84c'], badge: 'Best Seller', stock: 10, featured: true, category_name: 'Square', category_slug: 'square', discount_percentage: 18 },
    { id: 8, name: 'Retro Round', slug: 'retro-round', brand: 'LUMINA', price: 18990, old_price: null, rating: 4.3, reviews_count: 47, description: 'Classic round frames with tortoiseshell acetate and green-tinted lenses.', image: null, image_url: null, image_url_resolved: 'images/products/retro-round.jpg', colors: ['#8b4513', '#1a1a2e', '#c0c0c0'], badge: null, stock: 10, featured: false, category_name: 'Round', category_slug: 'round', discount_percentage: 0 },
    { id: 9, name: 'Pilot Pro', slug: 'pilot-pro', brand: 'LUMINA', price: 29990, old_price: 36990, rating: 4.9, reviews_count: 203, description: 'Premium pilot sunglasses with dual-bridge design and photochromic lenses.', image: null, image_url: null, image_url_resolved: 'images/products/pilot-pro.jpg', colors: ['#1a1a2e', '#c9a84c'], badge: 'New', stock: 10, featured: false, category_name: 'Aviator', category_slug: 'aviator', discount_percentage: 19 },
    { id: 10, name: 'Oversized Square', slug: 'oversized-square', brand: 'LUMINA', price: 21990, old_price: null, rating: 4.6, reviews_count: 84, description: 'Statement oversized square frame with UV400 protection and scratch-resistant coating.', image: null, image_url: null, image_url_resolved: 'images/products/oversized-square.jpg', colors: ['#1a1a2e', '#8b4513', '#c9a84c'], badge: null, stock: 10, featured: false, category_name: 'Square', category_slug: 'square', discount_percentage: 0 },
    { id: 11, name: 'Sport Wrap', slug: 'sport-wrap', brand: 'LUMINA', price: 13490, old_price: 16990, rating: 4.2, reviews_count: 38, description: 'Full-wrap sport sunglasses with rubberized grips and ventilation system.', image: null, image_url: null, image_url_resolved: 'images/products/sport-wrap.jpg', colors: ['#2d2d2d', '#c0c0c0'], badge: 'Sale', stock: 10, featured: false, category_name: 'Sport', category_slug: 'sport', discount_percentage: 21 },
    { id: 12, name: 'Butterfly Gold', slug: 'butterfly-gold', brand: 'LUMINA', price: 32990, old_price: 38990, rating: 4.7, reviews_count: 91, description: 'Dramatic butterfly cat-eye with 24k gold-plated temples and crystal embellishments.', image: null, image_url: null, image_url_resolved: 'images/products/butterfly-gold.jpg', colors: ['#c9a84c', '#1a1a2e'], badge: 'Best Seller', stock: 10, featured: true, category_name: 'Cat Eye', category_slug: 'cat-eye', discount_percentage: 15 },
    { id: 13, name: 'Solaris Aviator', slug: 'solaris-aviator', brand: 'LUMINA', price: 21490, old_price: null, rating: 4.9, reviews_count: 187, description: 'Premium aviator with gold-plated frame and UV400 polarized lenses.', image: null, image_url: null, image_url_resolved: 'images/products/solaris-aviator.jpg', colors: ['#1a1a2e', '#c9a84c', '#2d2d2d'], badge: 'Best Seller', stock: 10, featured: true, category_name: 'Aviator', category_slug: 'aviator', discount_percentage: 0 },
    { id: 14, name: 'Nova Round', slug: 'nova-round', brand: 'LUMINA', price: 16990, old_price: null, rating: 4.7, reviews_count: 134, description: 'Vintage-inspired round frames with blue-tinted glass lenses.', image: null, image_url: null, image_url_resolved: 'images/products/nova-round.jpg', colors: ['#c9a84c', '#1a1a2e'], badge: 'New', stock: 10, featured: false, category_name: 'Round', category_slug: 'round', discount_percentage: 0 },
    { id: 15, name: 'Eclipse Wayfarer', slug: 'eclipse-wayfarer', brand: 'LUMINA', price: 14990, old_price: 18990, rating: 4.8, reviews_count: 156, description: 'Modern wayfarer with lightweight titanium frame and gradient lenses.', image: null, image_url: null, image_url_resolved: 'images/products/eclipse-wayfarer.jpg', colors: ['#1a1a2e', '#8b4513'], badge: 'Sale', stock: 10, featured: true, category_name: 'Wayfarer', category_slug: 'wayfarer', discount_percentage: 21 },
    { id: 16, name: 'Aura Cat Eye', slug: 'aura-cat-eye', brand: 'LUMINA', price: 19490, old_price: null, rating: 5.0, reviews_count: 92, description: 'Stunning cat-eye silhouette with hand-polished acetate frame.', image: null, image_url: null, image_url_resolved: 'images/products/aura-cat-eye.jpg', colors: ['#1a1a2e', '#c9a84c'], badge: 'New', stock: 10, featured: false, category_name: 'Cat Eye', category_slug: 'cat-eye', discount_percentage: 0 },
    { id: 17, name: 'Vertex Square', slug: 'vertex-square', brand: 'LUMINA', price: 13490, old_price: null, rating: 4.6, reviews_count: 78, description: 'Bold square frame crafted from lightweight titanium with spring hinges.', image: null, image_url: null, image_url_resolved: 'images/products/vertex-square.jpg', colors: ['#2d2d2d', '#c9a84c'], badge: 'New', stock: 10, featured: false, category_name: 'Square', category_slug: 'square', discount_percentage: 0 },
    { id: 18, name: 'Prisma Shield', slug: 'prisma-shield', brand: 'LUMINA', price: 29990, old_price: null, rating: 4.9, reviews_count: 113, description: 'High-performance shield sunglasses with shatterproof polycarbonate lenses.', image: null, image_url: null, image_url_resolved: 'images/products/prisma-shield.jpg', colors: ['#2d2d2d', '#1a1a2e'], badge: 'New', stock: 10, featured: false, category_name: 'Sport', category_slug: 'sport', discount_percentage: 0 }
  ];

  function loadProducts() {
    if (window.productData.length > 0) return Promise.resolve(window.productData);
    return apiFetch('/products/').then(function (data) {
      window.productData = data;
      return data;
    }).catch(function () {
      window.productData = fallbackProducts;
      return fallbackProducts;
    });
  }
  window.loadProducts = loadProducts;

  loadProducts().then(function (data) {
    if (data && data.length) window.renderGrids(data);
    renderColorSwatches('.product-card[data-colors]', '.card-colors');
    renderColorSwatches('.product-card[data-colors]', '.product-card-colors');
    window.dispatchEvent(new Event('productsLoaded'));
  });

  window.renderColorSwatches = function (cardSelector, containerSelector) {
    document.querySelectorAll(cardSelector).forEach(function (card) {
      var colors = card.getAttribute('data-colors');
      if (!colors) return;
      var container = card.querySelector(containerSelector);
      if (!container) return;
      container.innerHTML = '';
      colors.split(',').forEach(function (hex, idx) {
        var dot = document.createElement('span');
        dot.className = 'color-dot' + (idx === 0 ? ' active' : '');
        dot.style.background = hex;
        var tip = document.createElement('span');
        tip.className = 'tooltip';
        tip.textContent = hex;
        dot.appendChild(tip);
        dot.addEventListener('click', function (e) {
          e.stopPropagation();
          container.querySelectorAll('.color-dot').forEach(function (d) { d.classList.remove('active'); });
          dot.classList.add('active');
        });
        container.appendChild(dot);
      });
    });
  };

  function getRatingStarsHTML(rating) {
    var full = Math.floor(rating);
    var half = rating % 1 >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    var s = '';
    for (var i = 0; i < full; i++) s += '<i class="fas fa-star"></i>';
    if (half) s += '<i class="fas fa-star-half-alt"></i>';
    for (var j = 0; j < empty; j++) s += '<i class="far fa-star"></i>';
    return s;
  }

  function getStockHTML(stock) {
    if (stock <= 0) return '<div class="card-stock out"><span class="stock-dot"></span> Out of Stock</div>';
    if (stock <= 5) return '<div class="card-stock low"><span class="stock-dot"></span> Only ' + stock + ' Left</div>';
    return '<div class="card-stock"><span class="stock-dot"></span> In Stock</div>';
  }

  function getBadgeHTML(badge) {
    if (!badge) return '';
    var cls = 'best';
    var icon = '<i class="fas fa-crown"></i>';
    if (badge.toLowerCase() === 'new') { cls = 'new'; icon = '<i class="fas fa-bolt"></i>'; }
    else if (badge.toLowerCase() === 'sale') { cls = 'sale'; icon = '<i class="fas fa-tag"></i>'; }
    else if (badge.toLowerCase().indexOf('best') !== -1) { cls = 'best'; icon = '<i class="fas fa-award"></i>'; }
    return '<span class="card-badge ' + cls + '">' + icon + '<span class="card-badge-text">' + badge + '</span></span>';
  }

  function getDiscountBadgeHTML(discount) {
    if (!discount || discount <= 0) return '';
    return '<span class="card-discount-badge">-' + discount + '%</span>';
  }

  window.renderProductCard = function (p) {
    var img = p.image_url_resolved || p.image_url || 'images/products/solaris-aviator.jpg';
    var colors = (p.colors || []).join(',');
    var oldPriceHTML = p.old_price ? '<span class="card-old-price">' + fmtPrice(p.old_price) + '</span>' : '';
    var badgeHTML = getBadgeHTML(p.badge);
    var discountBadgeHTML = '';
    if (p.discount_percentage && p.discount_percentage > 0) {
      discountBadgeHTML = '<span class="card-discount-badge">-' + p.discount_percentage + '%</span>';
    }
    var stockLabel = '';
    if (p.stock <= 0) {
      stockLabel = '<span class="card-stock out">Out of Stock</span>';
    } else if (p.stock <= 5) {
      stockLabel = '<span class="card-stock low">Only ' + p.stock + ' left</span>';
    }
    var catDot = p.category_name ? '<span class="card-cat-dot" style="background:' + ((p.colors && p.colors[0]) || 'var(--color-primary)') + '"></span>' : '';
    return '<div class="product-card animate-on-scroll" data-id="' + p.id + '" data-colors="' + colors + '">' +
      '<div class="card-image">' +
        badgeHTML +
        discountBadgeHTML +
        '<img src="' + img + '" alt="' + (p.name || '') + '" loading="lazy" decoding="async" width="400" height="533">' +
        '<div class="card-actions">' +
          '<button class="wishlist-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></button>' +
          '<button class="quick-view-trigger" aria-label="Quick view"><i class="fas fa-eye"></i></button>' +
        '</div>' +
        '<div class="card-image-overlay">' +
          '<button class="card-add-btn" data-id="' + p.id + '"><i class="fas fa-shopping-bag"></i> Add to Cart</button>' +
        '</div>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-top-row">' +
          '<span class="card-category">' + catDot + (p.category_name || '') + '</span>' +
          stockLabel +
        '</div>' +
        '<h3 class="card-name">' + (p.name || '') + '</h3>' +
        '<div class="card-rating">' + getRatingStarsHTML(p.rating || 0) + ' <span>(' + (p.reviews_count || 0) + ')</span></div>' +
        '<div class="card-colors"></div>' +
        '<div class="card-bottom-row">' +
          '<div class="card-price">' + oldPriceHTML + '<span class="current">' + fmtPrice(p.price) + '</span></div>' +
          '<button class="card-add-btn-inline" data-id="' + p.id + '"><i class="fas fa-shopping-bag"></i></button>' +
        '</div>' +
      '</div>' +
      '<div class="card-accent-bar"></div>' +
    '</div>';
  };

  window.renderShopCard = function (p) {
    var img = p.image_url_resolved || p.image_url || 'images/products/solaris-aviator.jpg';
    var colors = (p.colors || []).join(',');
    var catName = p.category_name || '';
    var slug = p.category_slug || '';
    var brand = (p.brand || '').toLowerCase();
    var oldPriceHTML = p.old_price ? '<span class="shop-card-old">' + fmtPrice(p.old_price) + '</span>' : '';
    var badgeHTML = getBadgeHTML(p.badge);
    var discountBadgeHTML = '';
    if (p.discount_percentage && p.discount_percentage > 0) {
      discountBadgeHTML = '<span class="shop-card-discount-badge">-' + p.discount_percentage + '%</span>';
    }
    var ratingStars = getRatingStarsHTML(p.rating || 0);
    var stockLabel = '';
    if (p.stock <= 0) {
      stockLabel = '<span class="shop-card-stock out">Out of Stock</span>';
    } else if (p.stock <= 5) {
      stockLabel = '<span class="shop-card-stock low">Only ' + p.stock + ' left</span>';
    }
    return '<div class="shop-card" data-id="' + p.id + '" data-category="' + slug + '" data-price="' + p.price + '" data-brand="' + brand + '" data-rating="' + (p.rating || 0) + '" data-colors="' + colors + '">' +
      '<div class="shop-card-image">' +
        badgeHTML +
        discountBadgeHTML +
        '<img src="' + img + '" alt="' + (p.name || '') + '" loading="lazy" decoding="async" width="400" height="400">' +
        '<div class="shop-card-actions">' +
          '<button class="shop-card-wishlist" aria-label="Wishlist"><i class="far fa-heart"></i></button>' +
          '<button class="shop-card-qv" aria-label="Quick view"><i class="fas fa-eye"></i></button>' +
        '</div>' +
        '<div class="shop-card-overlay">' +
          '<a href="product.html?id=' + p.id + '" class="shop-card-view">View Details</a>' +
        '</div>' +
      '</div>' +
      '<div class="shop-card-body">' +
        '<div class="shop-card-top">' +
          '<span class="shop-card-cat">' + catName + '</span>' +
          stockLabel +
        '</div>' +
        '<h3 class="shop-card-name">' + (p.name || '') + '</h3>' +
        '<div class="shop-card-rating">' + ratingStars + ' <span>(' + (p.reviews_count || 0) + ')</span></div>' +
        '<div class="shop-card-colors"></div>' +
        '<div class="shop-card-bottom">' +
          '<div class="shop-card-price">' + oldPriceHTML + fmtPrice(p.price) + '</div>' +
          '<button class="shop-card-atc"><i class="fas fa-shopping-bag"></i> Add to Cart</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  };

  window.renderGrids = function (products) {
    document.querySelectorAll('[data-render]').forEach(function (grid) {
      var mode = grid.getAttribute('data-render');
      var items = [];
      if (mode === 'trending') {
        items = products.filter(function (p) { return p.featured || (p.badge && p.badge.toLowerCase() === 'best'); }).slice(0, 3);
        if (items.length < 3) items = products.slice(0, 3);
      } else if (mode === 'newest') {
        items = products.slice(0, 4);
      } else if (mode === 'best-sellers') {
        items = products.filter(function (p) { return p.badge && p.badge.toLowerCase() === 'best'; }).slice(0, 3);
        if (items.length < 3) items = products.slice(0, 3);
      } else if (mode === 'shop') {
        items = products;
      }
      var html = '';
      items.forEach(function (p) {
        if (mode === 'shop') {
          html += window.renderShopCard(p);
        } else {
          html += window.renderProductCard(p);
        }
      });
      grid.innerHTML = html;
      if (typeof window.renderColorSwatches === 'function') {
        if (mode === 'shop') {
          window.renderColorSwatches('.shop-card[data-colors]', '.shop-card-colors');
        } else {
          window.renderColorSwatches('.product-card[data-colors]', '.card-colors');
        }
      }
      if (typeof window.observeReveal === 'function') {
        grid.querySelectorAll('.animate-on-scroll').forEach(function (el) { window.observeReveal(el); });
      } else {
        grid.querySelectorAll('.animate-on-scroll').forEach(function (el) { el.classList.add('revealed'); });
      }
    });
  };

  window.saveCart = function () {
    localStorage.setItem('luminaCart', JSON.stringify(window.cartItems));
    updateCartCount(window.cartItems.reduce(function (sum, item) { return sum + (item.quantity || 1); }, 0));
    try {
      apiFetch('/cart/clear/', { method: 'DELETE' });
      window.cartItems.forEach(function (item) {
        apiFetch('/cart/add/', {
          method: 'POST',
          body: JSON.stringify({ product_id: item.id, quantity: item.quantity, color: item.color || '' })
        });
      });
    } catch (e) {}
  };

  window.saveWishlist = function () {
    localStorage.setItem('luminaWishlist', JSON.stringify(window.wishlistItems));
    var count = document.querySelector('.wishlist-count');
    if (count) count.textContent = window.wishlistItems.length;
    try {
      window.wishlistItems.forEach(function (item) {
        apiFetch('/wishlist/add/', {
          method: 'POST',
          body: JSON.stringify({ product_id: item.id })
        });
      });
    } catch (e) {}
  };

  var hideLoader = function () {
    var loader = document.querySelector('.loading-screen');
    if (loader) loader.classList.add('hidden');
  };

  window.addEventListener('load', function () {
    setTimeout(hideLoader, 1500);
  });

  setTimeout(hideLoader, 5000);

  var navbar = document.querySelector('.navbar');
  if (navbar) {
    function handleNavbarScroll() {
      if (window.scrollY > 50 || !document.querySelector('.hero')) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    window.navbarLightMode = function () {
      navbar.classList.add('light-section');
      navbar.classList.remove('dark-section');
    };

    window.navbarDarkMode = function () {
      navbar.classList.add('dark-section');
      navbar.classList.remove('light-section');
    };
  }

  var mobileToggle = document.querySelector('.mobile-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  var searchToggle = document.querySelector('.search-trigger');
  var searchPopup = document.querySelector('.search-popup');
  var searchClose = document.querySelector('.search-popup .search-close');
  if (searchToggle && searchPopup) {
    searchToggle.addEventListener('click', function (e) {
      e.preventDefault();
      searchPopup.classList.toggle('active');
      if (searchPopup.classList.contains('active')) {
        setTimeout(function () {
          var input = searchPopup.querySelector('input[type="text"]');
          if (input) input.focus();
        }, 300);
      }
    });

    function closeSearch() {
      searchPopup.classList.remove('active');
    }

    if (searchClose) searchClose.addEventListener('click', closeSearch);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchPopup && searchPopup.classList.contains('active')) {
        closeSearch();
      }
    });

    searchPopup.addEventListener('click', function (e) {
      if (e.target === searchPopup) closeSearch();
    });
  }

  function updateCartCount(n) {
    var counters = document.querySelectorAll('.cart-count');
    counters.forEach(function (el) {
      el.textContent = n;
      if (n > 0) {
        el.classList.add('has-items');
      } else {
        el.classList.remove('has-items');
      }
    });
  }
  window.updateCartCount = updateCartCount;

  updateCartCount(window.cartItems.reduce(function (sum, item) { return sum + (item.quantity || 1); }, 0));

  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientWidth;
      var scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    });
  }

  var quickViewModal = document.querySelector('.quick-view-modal');
  var quickViewOverlay = document.querySelector('.quick-view-overlay');
  var quickViewBody = document.querySelector('.quick-view-body');

  window.openQuickView = function (productData) {
    if (!quickViewModal || !quickViewBody) return;
    var html = '<button class="quick-view-close">&times;</button>';
    html += '<div class="quick-view-grid">';
    html += '<div class="quick-view-image"><img src="' + (productData.image_url_resolved || productData.image || productData.image_url || 'images/products/solaris-aviator.jpg') + '" alt="' + productData.name + '"></div>';
    html += '<div class="quick-view-info">';
    html += '<span class="product-badge">' + (productData.badge || '') + '</span>';
    html += '<h2>' + productData.name + '</h2>';
    html += '<div class="product-rating">' + getRatingStars(productData.rating || 0) + ' <span>(' + (productData.reviews_count || productData.reviews || 0) + ' reviews)</span></div>';
    html += '<div class="product-price">';
    if (productData.old_price || productData.oldPrice) {
      html += '<span class="old-price">' + fmtPrice(productData.old_price || productData.oldPrice) + '</span>';
    }
    html += '<span class="current-price">' + fmtPrice(productData.price) + '</span>';
    html += '</div>';
    html += '<p class="product-description">' + (productData.description || '') + '</p>';
    if (productData.colors) {
      html += '<div class="color-options"><span class="label">Color:</span><div class="color-swatches">';
      productData.colors.forEach(function (c) {
        html += '<span class="color-swatch" style="background:' + c + '" data-color="' + c + '"></span>';
      });
      html += '</div></div>';
    }
    html += '<div class="quantity-selector">';
    html += '<button class="qty-btn minus">-</button>';
    html += '<input type="number" class="qty-input" value="1" min="1" max="99">';
    html += '<button class="qty-btn plus">+</button>';
    html += '</div>';
    html += '<button class="btn btn-primary add-to-cart-btn" data-product=\'' + JSON.stringify(productData).replace(/'/g, '&#39;') + '\'>Add to Cart</button>';
    html += '</div></div>';

    quickViewBody.innerHTML = html;
    quickViewModal.classList.add('active');
    if (quickViewOverlay) quickViewOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    var qtyInput = quickViewBody.querySelector('.qty-input');
    var minusBtn = quickViewBody.querySelector('.qty-btn.minus');
    var plusBtn = quickViewBody.querySelector('.qty-btn.plus');
    if (minusBtn && qtyInput) {
      minusBtn.addEventListener('click', function () {
        var v = parseInt(qtyInput.value, 10);
        if (v > 1) qtyInput.value = v - 1;
      });
    }
    if (plusBtn && qtyInput) {
      plusBtn.addEventListener('click', function () {
        var v = parseInt(qtyInput.value, 10);
        if (v < 99) qtyInput.value = v + 1;
      });
    }

    var atcBtn = quickViewBody.querySelector('.add-to-cart-btn');
    if (atcBtn) {
      atcBtn.addEventListener('click', function () {
        var data = productData;
        var qty = parseInt(qtyInput ? qtyInput.value : '1', 10);
        var cartProduct = { id: data.id, name: data.name, price: data.price, image: data.image_url_resolved || data.image || data.image_url, quantity: qty };
        addToCart(cartProduct);
        closeQuickView();
      });
    }

    var closeBtn = quickViewBody.querySelector('.quick-view-close');
    if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
  };

  window.closeQuickView = function () {
    if (quickViewModal) quickViewModal.classList.remove('active');
    if (quickViewOverlay) quickViewOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (quickViewOverlay) {
    quickViewOverlay.addEventListener('click', closeQuickView);
  }

  function getRatingStars(rating) {
    var full = Math.floor(rating);
    var half = rating % 1 >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    var stars = '';
    for (var i = 0; i < full; i++) stars += '<i class="fas fa-star"></i>';
    if (half) stars += '<i class="fas fa-star-half-alt"></i>';
    for (var j = 0; j < empty; j++) stars += '<i class="far fa-star"></i>';
    return stars;
  }
  window.getRatingStars = getRatingStars;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.wishlist-btn');
    if (!btn) return;
    e.preventDefault();
    btn.classList.toggle('active');
    var icon = btn.querySelector('i');
    if (icon) {
      if (btn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
      } else {
        icon.className = 'far fa-heart';
      }
    }

    var productCard = btn.closest('.product-card');
    if (productCard) {
      var productId = parseInt(productCard.getAttribute('data-id'), 10);
      if (!productId) return;
      var product = window.productData.find(function (p) { return p.id === productId; });
      if (product) {
        if (btn.classList.contains('active')) {
          if (!window.wishlistItems.find(function (i) { return i.id === productId; })) {
            window.wishlistItems.push(product);
          }
          apiFetch('/wishlist/add/', { method: 'POST', body: JSON.stringify({ product_id: productId }) }).catch(function () {});
        } else {
          window.wishlistItems = window.wishlistItems.filter(function (i) { return i.id !== productId; });
        }
        window.saveWishlist();
      }
    }
  });

  window.addToCart = function (product) {
    if (!product || !product.id) return;
    var existing = window.cartItems.find(function (item) { return item.id === product.id; });
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
    } else {
      window.cartItems.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: product.quantity || 1 });
    }
    window.saveCart();
    showCartAnimation();
    apiFetch('/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: product.id, quantity: product.quantity || 1 })
    }).catch(function () {});
  };

  function showCartAnimation() {
    var cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    var anim = document.createElement('span');
    anim.className = 'cart-bubble';
    anim.textContent = '+1';
    cartIcon.appendChild(anim);
    anim.addEventListener('animationend', function () {
      anim.remove();
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.card-add-btn, .card-add-btn-inline');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var id = parseInt(btn.getAttribute('data-id'), 10);
    if (!id) return;
    var product = window.productData.find(function (p) { return p.id === id; });
    if (product) {
      window.addToCart(product);
      var origHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.classList.add('added');
      setTimeout(function () {
        btn.innerHTML = origHTML;
        btn.classList.remove('added');
      }, 2000);
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.card-actions button, .wishlist-btn, .add-to-cart-btn, .card-add-btn, .card-add-btn-inline, .color-dot, a')) return;
    var card = e.target.closest('.product-card');
    if (!card) return;
    if (e.target.closest('.quick-view-trigger') || card) {
      var id = parseInt(card.getAttribute('data-id'), 10);
      if (!id) return;
      var product = window.productData.find(function (p) { return p.id === id; });
      if (product && typeof window.openQuickView === 'function') {
        window.openQuickView(product);
      }
    }
  });

  document.addEventListener('mouseenter', function (e) {
    var card = e.target.closest('.product-card');
    if (!card) return;
    var img = card.querySelector('.product-image img');
    if (img) img.style.transform = 'scale(1.08)';
  }, true);

  document.addEventListener('mouseleave', function (e) {
    var card = e.target.closest('.product-card');
    if (!card) return;
    var img = card.querySelector('.product-image img');
    if (img) img.style.transform = 'scale(1)';
  }, true);

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var targetId = link.getAttribute('href');
    if (targetId === '#') return;
    var target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  var newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input[type="email"]');
      if (!input) return;
      var email = input.value.trim();
      if (!validateEmail(email)) {
        showFieldError(input, 'Please enter a valid email address');
        return;
      }
      clearFieldError(input);
      var btn = newsletterForm.querySelector('button');
      if (btn) btn.disabled = true;

      apiFetch('/newsletter/', {
        method: 'POST',
        body: JSON.stringify({ email: email })
      }).then(function () {
        var successMsg = newsletterForm.querySelector('.newsletter-success');
        if (successMsg) {
          successMsg.style.display = 'block';
        } else {
          var msg = document.createElement('p');
          msg.className = 'newsletter-success';
          msg.textContent = 'Thank you for subscribing!';
          newsletterForm.appendChild(msg);
        }
        input.value = '';
        if (btn) {
          btn.textContent = 'Subscribed!';
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = 'Subscribe';
            if (successMsg) successMsg.style.display = 'none';
          }, 3000);
        }
      }).catch(function () {
        if (btn) { btn.disabled = false; }
        showFieldError(input, 'Subscription failed. Try again.');
      });
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  window.validateEmail = validateEmail;

  function showFieldError(input, msg) {
    var parent = input.closest('.form-group') || input.parentElement;
    var error = parent.querySelector('.error-message');
    if (!error) {
      error = document.createElement('span');
      error.className = 'error-message';
      parent.appendChild(error);
    }
    error.textContent = msg;
    input.classList.add('error');
  }
  window.showFieldError = showFieldError;

  function clearFieldError(input) {
    var parent = input.closest('.form-group') || input.parentElement;
    var error = parent.querySelector('.error-message');
    if (error) error.textContent = '';
    input.classList.remove('error');
  }
  window.clearFieldError = clearFieldError;

});
