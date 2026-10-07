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
