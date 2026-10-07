/* ============================================
   LUMINA - Support Ticket System
   API integration + form validation + UX logic
   ============================================ */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  //  CONFIGURATION
  //  Change SUPPORT_API_URL to your CRM endpoint
  // ──────────────────────────────────────────────
  var SUPPORT_API_URL = 'https://your-crm.example/api/support/capture';

  // ──────────────────────────────────────────────
  //  DOM REFERENCES
  // ──────────────────────────────────────────────
  var form         = document.getElementById('support-form');
  var nameInput    = document.getElementById('support-name');
  var emailInput   = document.getElementById('support-email');
  var phoneInput   = document.getElementById('support-phone');
  var subjectInput = document.getElementById('support-subject');
  var prioritySel  = document.getElementById('support-priority');
  var categorySel  = document.getElementById('support-category');
  var messageInput = document.getElementById('support-message');
  var charCounter  = document.getElementById('char-counter');
  var submitBtn    = document.getElementById('btn-submit');
  var btnContent   = submitBtn.querySelector('.btn-content');
  var btnLoader    = submitBtn.querySelector('.btn-loader');

  // Success modal
  var successOverlay = document.getElementById('success-overlay');
  var refNumber      = document.getElementById('ref-number');
  var copyRefBtn     = document.getElementById('copy-ref');
  var newTicketBtn   = document.getElementById('btn-new-ticket');

  // Toast
  var toast        = document.getElementById('toast');
  var toastMessage = document.getElementById('toast-message');

  // Error spans
  var errors = {
    name:    document.getElementById('error-name'),
    email:   document.getElementById('error-email'),
    phone:   document.getElementById('error-phone'),
    subject: document.getElementById('error-subject'),
    message: document.getElementById('error-message')
  };

  // ──────────────────────────────────────────────
  //  URL PARAMETER & RECENT ORDER AUTO-FILL
  // ──────────────────────────────────────────────
  function initAutoFillAndOrders() {
    var urlParams = new URLSearchParams(window.location.search);
    var orderIdParam = urlParams.get('order_id');
    var nameParam = urlParams.get('name');
    var emailParam = urlParams.get('email');
    var phoneParam = urlParams.get('phone');
    var subjectParam = urlParams.get('subject');

    var savedOrders = JSON.parse(localStorage.getItem('luminaOrders')) || [];

    var formHeader = document.querySelector('.form-header');

    if (savedOrders.length > 0 && formHeader) {
      var recentBar = document.createElement('div');
      recentBar.className = 'recent-orders-bar';
      recentBar.style.cssText = 'background: #fafaf8; border: 1px solid #e2b659; border-radius: 14px; padding: 16px 20px; margin-bottom: 24px; text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.04);';

      var barTitle = document.createElement('div');
      barTitle.style.cssText = 'font-size: 13px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px;';
      barTitle.innerHTML = '<i class="fas fa-shopping-bag" style="color:#c9a84c;"></i> Select a Recent Order to Raise Ticket:';
      recentBar.appendChild(barTitle);

      var chipWrap = document.createElement('div');
      chipWrap.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap;';

      savedOrders.slice(0, 4).forEach(function (ord) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'order-chip';
        chip.style.cssText = 'background: #ffffff; border: 1.5px solid #c9a84c; color: #0d0d0d; border-radius: 20px; padding: 8px 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.06);';
        chip.innerHTML = '<i class="fas fa-box-open" style="color:#c9a84c;"></i> Order #' + ord.orderId + ' (' + (ord.total || '₹0') + ')';

        chip.addEventListener('click', function () {
          fillFormWithOrder(ord);
        });
        chipWrap.appendChild(chip);
      });

      recentBar.appendChild(chipWrap);
      formHeader.parentNode.insertBefore(recentBar, formHeader.nextSibling);
    }

    if (orderIdParam) {
      if (nameInput && nameParam) nameInput.value = nameParam;
      if (emailInput && emailParam) emailInput.value = emailParam;
      if (phoneInput && phoneParam) phoneInput.value = phoneParam;
      if (subjectInput) {
        subjectInput.value = subjectParam || ('Order Support Request for Order #' + orderIdParam);
      }
      if (messageInput) {
        messageInput.value = 'Hi LUMINA Support,\n\nI recently purchased an item under Order #' + orderIdParam + ' and I have a question regarding...';
      }

      showOrderBanner(orderIdParam);
      setTimeout(checkSubmitReady, 300);
    }
  }

  function fillFormWithOrder(ord) {
    if (nameInput && ord.fullName) nameInput.value = ord.fullName;
    if (emailInput && ord.email) emailInput.value = ord.email;
    if (phoneInput && ord.phone) phoneInput.value = ord.phone;
    if (subjectInput) subjectInput.value = 'Support Request for Order #' + ord.orderId;
    if (messageInput) {
      messageInput.value = 'Hi Support Team,\n\nI am reaching out regarding my purchase Order #' + ord.orderId + ' placed on ' + ord.date + ' (Total: ' + ord.total + ').\n\nPlease assist me with: ';
    }
    showOrderBanner(ord.orderId);
    checkSubmitReady();
    document.getElementById('support-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showOrderBanner(orderId) {
    var existingBanner = document.getElementById('order-autofill-banner');
    if (existingBanner) existingBanner.remove();

    var banner = document.createElement('div');
    banner.id = 'order-autofill-banner';
    banner.className = 'order-autofill-banner';
    banner.style.cssText = 'background: rgba(226, 182, 89, 0.15); border: 1px solid rgba(226, 182, 89, 0.5); color: #7d5e1a; border-radius: 10px; padding: 12px 18px; font-size: 13px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; font-weight: 600;';
    banner.innerHTML = '<div><i class="fas fa-ticket-alt" style="color:#c9a84c; margin-right:8px;"></i> Pre-filled for <strong>Order #' + orderId + '</strong></div><button type="button" style="background:none; border:none; color:#7d5e1a; cursor:pointer; font-size:14px;" title="Clear order info"><i class="fas fa-times"></i></button>';

    banner.querySelector('button').addEventListener('click', function () {
      banner.remove();
      if (subjectInput) subjectInput.value = '';
      if (messageInput) messageInput.value = '';
      checkSubmitReady();
    });

    var formTag = document.getElementById('support-form');
    if (formTag) formTag.parentNode.insertBefore(banner, formTag);
  }

  setTimeout(initAutoFillAndOrders, 100);

  // ──────────────────────────────────────────────
  //  AUTO-FOCUS on first input
  // ──────────────────────────────────────────────
  if (nameInput) {
    setTimeout(function () { nameInput.focus(); }, 600);
  }

  // ──────────────────────────────────────────────
  //  CHARACTER COUNTER for message
  // ──────────────────────────────────────────────
  messageInput.addEventListener('input', function () {
    var len = messageInput.value.length;
    var max = 2000;
    charCounter.textContent = len + ' / ' + max;

    charCounter.classList.remove('near-limit', 'at-limit');
    if (len >= max) {
      charCounter.classList.add('at-limit');
    } else if (len >= max * 0.85) {
      charCounter.classList.add('near-limit');
    }
  });

  // ──────────────────────────────────────────────
  //  VALIDATION HELPERS
  // ──────────────────────────────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    // Allow empty (optional), or basic phone pattern
    if (!phone) return true;
    return /^[+]?[\d\s\-()]{7,20}$/.test(phone);
  }

  function setFieldError(field, wrapper, errorEl, message) {
    if (message) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
      if (wrapper) wrapper.classList.add('has-error');
      if (wrapper) wrapper.classList.remove('is-valid');
    } else {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
      if (wrapper) wrapper.classList.remove('has-error');
    }
  }

  function setFieldValid(wrapper) {
    if (wrapper) {
      wrapper.classList.remove('has-error');
      wrapper.classList.add('is-valid');
    }
  }

  function validateField(field) {
    var val = field.value.trim();
    var id = field.id.replace('support-', '');
    var wrapper = field.closest('.input-wrap') || field.closest('.textarea-wrap');
    var errorEl = errors[id];

    if (!errorEl) return true;

    switch (id) {
      case 'name':
        if (!val) {
          setFieldError(field, wrapper, errorEl, 'Full name is required');
          return false;
        }
        if (val.length < 2) {
          setFieldError(field, wrapper, errorEl, 'Name must be at least 2 characters');
          return false;
        }
        setFieldError(field, wrapper, errorEl, '');
        setFieldValid(wrapper);
        return true;

      case 'email':
        if (!val) {
          setFieldError(field, wrapper, errorEl, 'Email address is required');
          return false;
        }
        if (!isValidEmail(val)) {
          setFieldError(field, wrapper, errorEl, 'Please enter a valid email address');
          return false;
        }
        setFieldError(field, wrapper, errorEl, '');
        setFieldValid(wrapper);
        return true;

      case 'phone':
        if (val && !isValidPhone(val)) {
          setFieldError(field, wrapper, errorEl, 'Please enter a valid phone number');
          return false;
        }
        setFieldError(field, wrapper, errorEl, '');
        if (val) setFieldValid(wrapper);
        return true;

      case 'subject':
        if (!val) {
          setFieldError(field, wrapper, errorEl, 'Subject is required');
          return false;
        }
        if (val.length < 3) {
          setFieldError(field, wrapper, errorEl, 'Subject must be at least 3 characters');
          return false;
        }
        setFieldError(field, wrapper, errorEl, '');
        setFieldValid(wrapper);
        return true;

      case 'message':
        if (!val) {
          setFieldError(field, wrapper, errorEl, 'Message is required');
          return false;
        }
        if (val.length < 10) {
          setFieldError(field, wrapper, errorEl, 'Please provide at least 10 characters');
          return false;
        }
        setFieldError(field, wrapper, errorEl, '');
        setFieldValid(wrapper);
        return true;

      default:
        return true;
    }
  }

  // ──────────────────────────────────────────────
  //  REAL-TIME VALIDATION on blur + input
  // ──────────────────────────────────────────────
  var requiredFields = [nameInput, emailInput, subjectInput, messageInput];
  var allFields = [nameInput, emailInput, phoneInput, subjectInput, messageInput];

  allFields.forEach(function (field) {
    // Validate on blur
    field.addEventListener('blur', function () {
      validateField(field);
      checkSubmitReady();
    });

    // Clear error on input (but don't re-validate until blur)
    field.addEventListener('input', function () {
      var id = field.id.replace('support-', '');
      var wrapper = field.closest('.input-wrap') || field.closest('.textarea-wrap');
      var errorEl = errors[id];
      if (errorEl && errorEl.classList.contains('visible')) {
        // Re-validate on each keystroke if error is showing
        validateField(field);
      }
      checkSubmitReady();
    });
  });

  // ──────────────────────────────────────────────
  //  SUBMIT BUTTON READY STATE
  // ──────────────────────────────────────────────
  function checkSubmitReady() {
    var ready = requiredFields.every(function (f) {
      return f.value.trim().length > 0;
    });
    submitBtn.disabled = !ready;
  }

  // ──────────────────────────────────────────────
  //  API SUBMISSION
  // ──────────────────────────────────────────────

  /**
   * Submit a support ticket to the CRM API.
   * @param {Object} data - Ticket payload
   * @returns {Promise<Object>} - API response
   */
  function submitTicket(data) {
    return fetch(SUPPORT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.json().then(function (body) {
        if (response.ok) {
          return body;
        }

        // Map HTTP status codes to user-friendly messages
        var errorMessage;
        switch (response.status) {
          case 400:
            errorMessage = body.message || 'Invalid input. Please check your details and try again.';
            break;
          case 403:
            errorMessage = 'Access denied. This origin is not allowed to submit tickets.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            break;
          default:
            errorMessage = body.message || 'Something went wrong. Please try again later.';
        }

        var error = new Error(errorMessage);
        error.status = response.status;
        error.body = body;
        throw error;
      });
    });
  }

  // ──────────────────────────────────────────────
  //  FORM SUBMIT HANDLER
  // ──────────────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Run full validation
    var isValid = true;
    allFields.forEach(function (field) {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Build payload
    var payload = {
      name:     nameInput.value.trim(),
      email:    emailInput.value.trim(),
      phone:    phoneInput.value.trim() || '',
      subject:  subjectInput.value.trim(),
      message:  messageInput.value.trim(),
      priority: prioritySel.value,
      category: categorySel.value,
      source:   'E-commerce Website'
    };

    // Show loading state
    setSubmitting(true);

    submitTicket(payload)
      .then(function (result) {
        // Success! Show the modal
        setSubmitting(false);
        showSuccessModal(result.reference || result.id || 'TKT-' + Date.now());
        form.reset();
        charCounter.textContent = '0 / 2000';
        charCounter.classList.remove('near-limit', 'at-limit');
        clearAllValidation();
        checkSubmitReady();
      })
      .catch(function (err) {
        setSubmitting(false);
        showToast(err.message || 'Failed to submit ticket. Please try again.', 'error');
      });
  });

  // ──────────────────────────────────────────────
  //  UI STATE HELPERS
  // ──────────────────────────────────────────────
  function setSubmitting(loading) {
    if (loading) {
      btnContent.style.display = 'none';
      btnLoader.style.display = 'flex';
      submitBtn.disabled = true;
    } else {
      btnContent.style.display = 'flex';
      btnLoader.style.display = 'none';
    }
  }

  function clearAllValidation() {
    allFields.forEach(function (field) {
      var id = field.id.replace('support-', '');
      var wrapper = field.closest('.input-wrap') || field.closest('.textarea-wrap');
      var errorEl = errors[id];
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      if (wrapper) {
        wrapper.classList.remove('has-error', 'is-valid');
      }
    });
  }

  // ──────────────────────────────────────────────
  //  SUCCESS MODAL
  // ──────────────────────────────────────────────
  function showSuccessModal(reference) {
    refNumber.textContent = reference;
    successOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hideSuccessModal() {
    successOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close modal on overlay click
  successOverlay.addEventListener('click', function (e) {
    if (e.target === successOverlay) {
      hideSuccessModal();
    }
  });

  // "Raise Another Ticket" button
  newTicketBtn.addEventListener('click', function () {
    hideSuccessModal();
    setTimeout(function () {
      nameInput.focus();
      // Scroll to form
      document.getElementById('support-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  });

  // Copy reference number
  copyRefBtn.addEventListener('click', function () {
    var ref = refNumber.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ref).then(function () {
        showToast('Reference number copied!', 'success');
      });
    } else {
      // Fallback
      var tempInput = document.createElement('input');
      tempInput.value = ref;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('Reference number copied!', 'success');
    }
  });

  // Close modal on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && successOverlay.classList.contains('active')) {
      hideSuccessModal();
    }
  });

  // ──────────────────────────────────────────────
  //  TOAST NOTIFICATIONS
  // ──────────────────────────────────────────────
  var toastTimeout;

  function showToast(message, type) {
    var icon = toast.querySelector('.toast-icon i');

    toastMessage.textContent = message;

    if (type === 'error') {
      icon.className = 'fas fa-exclamation-circle';
      icon.style.color = 'var(--color-error)';
    } else {
      icon.className = 'fas fa-check-circle';
      icon.style.color = 'var(--color-success)';
    }

    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 4000);
  }

})();
