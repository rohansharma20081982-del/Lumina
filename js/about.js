// ============================================
// LUMINA - About Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // Counter animation is handled in animation.js

  // --- Timeline hover effect ---
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.setProperty('--item-order', index);
  });
});
