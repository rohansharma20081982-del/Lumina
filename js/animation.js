/**
 * animation.js - Scroll animations and visual effects for LUMINA Sunglasses
 */

document.addEventListener('DOMContentLoaded', function () {

  // ===== PREFERS REDUCED MOTION CHECK =====
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  // Fallback: if IntersectionObserver is not supported, reveal all immediately
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.animate-on-scroll, .reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      el.classList.add('revealed');
    });
    return;
  }

  // ===== INTERSECTION OBSERVER FOR REVEAL ANIMATIONS =====
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.classList.add('revealed');

        // Stagger children if present
        var staggerParent = el.getAttribute('data-stagger');
        if (staggerParent !== null) {
          var children = el.children;
          var delay = parseFloat(el.getAttribute('data-stagger-delay')) || 0.1;
          Array.from(children).forEach(function (child, index) {
            child.style.transitionDelay = (index * delay) + 's';
            child.classList.add('revealed');
          });
        }

        // Counter animation
        var counter = el.querySelector('.counter');
        if (counter) {
          animateCounter(counter);
        }

        // Unobserve after reveal if not set to repeat
        if (el.getAttribute('data-repeat') !== 'true') {
          revealObserver.unobserve(el);
        }
      } else {
        // Re-trigger for elements with data-repeat="true"
        if (entry.target.getAttribute('data-repeat') === 'true') {
          entry.target.classList.remove('revealed');
          var children = entry.target.children;
          Array.from(children).forEach(function (child) {
            child.classList.remove('revealed');
            child.style.transitionDelay = '';
          });
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all reveal elements
  var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .animate-on-scroll');
  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ===== COUNTER ANIMATION =====
  function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    var duration = parseInt(element.getAttribute('data-duration'), 10) || 2000;
    var suffix = element.getAttribute('data-suffix') || '';
    var prefix = element.getAttribute('data-prefix') || '';
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(easeOut * target);
      element.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // Observe counters that are not inside reveal elements
  document.querySelectorAll('.counter:not(.reveal .counter, .reveal-left .counter, .reveal-right .counter, .reveal-scale .counter)').forEach(function (counter) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(counter);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(counter);
  });

  // ===== PARALLAX EFFECT =====
  var parallaxElements = document.querySelectorAll('.parallax');
  if (parallaxElements.length) {
    window.addEventListener('scroll', function () {
      parallaxElements.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.3;
        var rect = el.getBoundingClientRect();
        var centerPoint = window.innerHeight / 2;
        var offset = (rect.top + rect.height / 2) - centerPoint;
        var yPos = -(offset * speed * 0.1);
        el.style.transform = 'translateY(' + yPos + 'px)';
      });
    }, { passive: true });
  }

  // ===== FLOAT ANIMATION =====
  var floatElements = document.querySelectorAll('.float-anim');
  floatElements.forEach(function (el) {
    var duration = parseFloat(el.getAttribute('data-float-duration')) || 3;
    var distance = parseFloat(el.getAttribute('data-float-distance')) || 15;
    el.style.animation = 'float ' + duration + 's ease-in-out infinite';
    el.style.setProperty('--float-distance', distance + 'px');
  });

  // ===== STAGGER ANIMATION FOR CONTAINERS =====
  var staggerContainers = document.querySelectorAll('[data-stagger]');
  staggerContainers.forEach(function (container) {
    var children = container.children;
    var delay = parseFloat(container.getAttribute('data-stagger-delay')) || 0.1;
    var staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Array.from(children).forEach(function (child, index) {
            child.style.transitionDelay = (index * delay) + 's';
            child.classList.add('revealed');
          });
          if (container.getAttribute('data-repeat') !== 'true') {
            staggerObserver.unobserve(container);
          }
        } else if (container.getAttribute('data-repeat') === 'true') {
          Array.from(children).forEach(function (child) {
            child.classList.remove('revealed');
            child.style.transitionDelay = '';
          });
        }
      });
    }, { threshold: 0.15 });

    staggerObserver.observe(container);
  });

  // ===== DYNAMIC REVEAL =====
  // Allow adding reveal animations to dynamically loaded elements
  window.observeReveal = function (el) {
    if (el) revealObserver.observe(el);
  };

  // Re-run for any elements added after initial load with class 'reveal-later'
  var laterReveals = document.querySelectorAll('.reveal-later');
  laterReveals.forEach(function (el) {
    revealObserver.observe(el);
  });

});
