/**
 * slider.js - Product card slider/carousel for LUMINA Sunglasses
 * Used for "Trending Products" and "Related Products" sections
 */

document.addEventListener('DOMContentLoaded', function () {

  // ===== SLIDER INITIALIZATION =====
  function initSlider(sliderContainer) {
    if (!sliderContainer) return;

    var track = sliderContainer.querySelector('.slider-track');
    var slides = sliderContainer.querySelectorAll('.slide');
    var prevBtn = sliderContainer.querySelector('.slider-arrow.prev');
    var nextBtn = sliderContainer.querySelector('.slider-arrow.next');
    var dotsContainer = sliderContainer.querySelector('.slider-dots');
    var autoplayDelay = parseInt(sliderContainer.getAttribute('data-autoplay'), 10) || 4000;
    var autoplayEnabled = sliderContainer.getAttribute('data-autoplay') !== 'false';

    if (!track || !slides.length) return;

    var currentIndex = 0;
    var totalSlides = slides.length;
    var slideWidth = 0;
    var slidesPerView = getSlidesPerView();
    var isDragging = false;
    var startPos = 0;
    var currentTranslate = 0;
    var prevTranslate = 0;
    var animationID = 0;
    var autoplayInterval = null;

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      var dotsCount = Math.ceil(totalSlides / slidesPerView);
      for (var i = 0; i < dotsCount; i++) {
        var dot = document.createElement('span');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function () {
          var idx = parseInt(this.getAttribute('data-index'), 10);
          goTo(idx);
        });
        dotsContainer.appendChild(dot);
      }
    }

    function getSlidesPerView() {
      if (window.innerWidth < 576) return 1;
      if (window.innerWidth < 992) return 2;
      return parseInt(sliderContainer.getAttribute('data-slides'), 10) || 4;
    }

    function updateDimensions() {
      slidesPerView = getSlidesPerView();
      slideWidth = sliderContainer.offsetWidth / slidesPerView;
      slides.forEach(function (s) { s.style.minWidth = slideWidth + 'px'; });
      track.style.transition = 'none';
      prevTranslate = -currentIndex * slideWidth;
      track.style.transform = 'translateX(' + prevTranslate + 'px)';
      updateDots();
    }

    function goTo(index) {
      var maxIndex = Math.max(0, totalSlides - slidesPerView);
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      prevTranslate = -currentIndex * slideWidth;
      track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      track.style.transform = 'translateX(' + prevTranslate + 'px)';
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      var dots = dotsContainer.querySelectorAll('.slider-dot');
      var activeDot = Math.round(currentIndex / slidesPerView);
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === activeDot);
      });
    }

    // Prev/Next buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(currentIndex - slidesPerView);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(currentIndex + slidesPerView);
        resetAutoplay();
      });
    }

    // ===== TOUCH / SWIPE SUPPORT =====
    function touchStart(e) {
      isDragging = true;
      startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      currentTranslate = prevTranslate;
      track.style.transition = 'none';
      cancelAutoplay();
    }

    function touchMove(e) {
      if (!isDragging) return;
      var currentPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      var diff = currentPos - startPos;
      currentTranslate = prevTranslate + diff;
      track.style.transform = 'translateX(' + currentTranslate + 'px)';
    }

    function touchEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      var moved = currentTranslate - prevTranslate;
      var threshold = slideWidth * 0.2;

      if (Math.abs(moved) > threshold) {
        if (moved < 0) {
          goTo(currentIndex + 1);
        } else {
          goTo(currentIndex - 1);
        }
      } else {
        goTo(currentIndex);
      }

      startAutoplay();
    }

    // Mouse events for drag
    track.addEventListener('mousedown', touchStart);
    window.addEventListener('mousemove', touchMove);
    window.addEventListener('mouseup', touchEnd);

    // Touch events
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: true });
    track.addEventListener('touchend', touchEnd);

    // Prevent image drag
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // ===== AUTO-PLAY =====
    function startAutoplay() {
      if (!autoplayEnabled) return;
      cancelAutoplay();
      autoplayInterval = setInterval(function () {
        var next = currentIndex + slidesPerView;
        var maxIndex = Math.max(0, totalSlides - slidesPerView);
        if (next > maxIndex) {
          goTo(0);
        } else {
          goTo(next);
        }
      }, autoplayDelay);
    }

    function cancelAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    function resetAutoplay() {
      cancelAutoplay();
      startAutoplay();
    }

    // Pause on hover
    sliderContainer.addEventListener('mouseenter', cancelAutoplay);
    sliderContainer.addEventListener('mouseleave', startAutoplay);

    // ===== WINDOW RESIZE =====
    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        updateDimensions();
        var maxIndex = Math.max(0, totalSlides - slidesPerView);
        if (currentIndex > maxIndex) goTo(maxIndex);
      }, 200);
    });

    // ===== INIT =====
    updateDimensions();
    startAutoplay();
  }

  // Initialize all sliders on the page
  var sliders = document.querySelectorAll('.product-slider');
  sliders.forEach(function (slider) {
    initSlider(slider);
  });

  // Expose initSlider for dynamic content
  window.initSlider = initSlider;

});
