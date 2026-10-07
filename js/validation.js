/**
 * validation.js - Form validation for LUMINA Sunglasses
 */

document.addEventListener('DOMContentLoaded', function () {

  // ===== EMAIL VALIDATION =====
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ===== SHOW / CLEAR ERROR =====
  function showError(input, message) {
    var group = input.closest('.form-group') || input.parentElement;
    group.classList.add('error');
    var errorEl = group.querySelector('.error-text');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-text';
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearError(input) {
    var group = input.closest('.form-group') || input.parentElement;
    group.classList.remove('error');
    var errorEl = group.querySelector('.error-text');
    if (errorEl) errorEl.textContent = '';
  }

  function showSuccess(input) {
    var group = input.closest('.form-group') || input.parentElement;
    group.classList.add('success');
    group.classList.remove('error');
  }

  function clearGroupState(input) {
    var group = input.closest('.form-group') || input.parentElement;
    group.classList.remove('error', 'success');
    var errorEl = group.querySelector('.error-text');
    if (errorEl) errorEl.textContent = '';
  }

  // ===== PASSWORD STRENGTH INDICATOR =====
  function updatePasswordStrength(password) {
    var indicator = document.getElementById('password-strength');
    if (!indicator) return;

    if (!password) {
      indicator.style.width = '0%';
      indicator.className = 'strength-bar';
      return;
    }

    var score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    var percent = (score / 6) * 100;
    indicator.style.width = percent + '%';

    if (score < 2) {
      indicator.className = 'strength-bar weak';
    } else if (score < 4) {
      indicator.className = 'strength-bar medium';
    } else {
      indicator.className = 'strength-bar strong';
    }
  }

  // ===== PASSWORD TOGGLE =====
  document.querySelectorAll('.password-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var input = this.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        this.classList.add('visible');
      } else {
        input.type = 'password';
        this.classList.remove('visible');
      }
    });
  });

  // ===== LOGIN FORM =====
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    var loginEmail = loginForm.querySelector('#login-email');
    var loginPassword = loginForm.querySelector('#login-password');

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (!loginEmail.value.trim() || !isValidEmail(loginEmail.value.trim())) {
        showError(loginEmail, 'Please enter a valid email address');
        valid = false;
      } else {
        clearError(loginEmail);
      }

      if (!loginPassword.value.trim()) {
        showError(loginPassword, 'Password is required');
        valid = false;
      } else {
        clearError(loginPassword);
      }

      if (valid) {
        loginForm.classList.add('submitted');
        showFormSuccess(loginForm, 'Login successful! Redirecting...');
        setTimeout(function () {
          window.location.href = 'index.html';
        }, 1500);
      }
    });

    if (loginEmail) loginEmail.addEventListener('input', function () { clearGroupState(this); });
    if (loginPassword) loginPassword.addEventListener('input', function () { clearGroupState(this); });
  }

  // ===== REGISTER FORM =====
  var registerForm = document.getElementById('register-form');
  if (registerForm) {
    var regName = registerForm.querySelector('#reg-name');
    var regEmail = registerForm.querySelector('#reg-email');
    var regPassword = registerForm.querySelector('#reg-password');
    var regConfirm = registerForm.querySelector('#reg-confirm');
    var regTerms = registerForm.querySelector('#reg-terms');

    if (regPassword) {
      regPassword.addEventListener('input', function () {
        updatePasswordStrength(this.value);
        if (regConfirm && regConfirm.value) {
          validatePasswordMatch(regPassword, regConfirm);
        }
      });
    }

    if (regConfirm) {
      regConfirm.addEventListener('input', function () {
        validatePasswordMatch(regPassword, this);
      });
    }

    function validatePasswordMatch(pw, confirm) {
      if (pw.value !== confirm.value) {
        showError(confirm, 'Passwords do not match');
        return false;
      } else {
        clearError(confirm);
        return true;
      }
    }

    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (!regName.value.trim()) {
        showError(regName, 'Please enter your name');
        valid = false;
      } else {
        clearError(regName);
      }

      if (!regEmail.value.trim() || !isValidEmail(regEmail.value.trim())) {
        showError(regEmail, 'Please enter a valid email address');
        valid = false;
      } else {
        clearError(regEmail);
      }

      if (!regPassword.value) {
        showError(regPassword, 'Password is required');
        valid = false;
      } else if (regPassword.value.length < 8) {
        showError(regPassword, 'Password must be at least 8 characters');
        valid = false;
      } else if (!/[0-9]/.test(regPassword.value)) {
        showError(regPassword, 'Password must contain at least one number');
        valid = false;
      } else {
        clearError(regPassword);
      }

      if (!regConfirm.value) {
        showError(regConfirm, 'Please confirm your password');
        valid = false;
      } else if (regPassword && regPassword.value !== regConfirm.value) {
        showError(regConfirm, 'Passwords do not match');
        valid = false;
      } else {
        clearError(regConfirm);
      }

      if (regTerms && !regTerms.checked) {
        showError(regTerms, 'You must agree to the terms and conditions');
        valid = false;
      } else if (regTerms) {
        clearError(regTerms);
      }

      if (valid) {
        registerForm.classList.add('submitted');
        showFormSuccess(registerForm, 'Account created successfully!');
        regName.value = ''; regEmail.value = ''; regPassword.value = ''; regConfirm.value = '';
        if (regTerms) regTerms.checked = false;
        updatePasswordStrength('');
      }
    });

    if (regName) regName.addEventListener('input', function () { clearGroupState(this); });
    if (regEmail) regEmail.addEventListener('input', function () { clearGroupState(this); });
    if (regPassword) regPassword.addEventListener('input', function () { clearGroupState(this); });
    if (regConfirm) regConfirm.addEventListener('input', function () { clearGroupState(this); });
    if (regTerms) regTerms.addEventListener('change', function () { clearGroupState(this); });
  }

  // ===== CONTACT FORM =====
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var contactName = contactForm.querySelector('#contact-name');
    var contactEmail = contactForm.querySelector('#contact-email');
    var contactSubject = contactForm.querySelector('#contact-subject');
    var contactMessage = contactForm.querySelector('#contact-message');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (!contactName.value.trim()) {
        showError(contactName, 'Please enter your name');
        valid = false;
      } else {
        clearError(contactName);
      }

      if (!contactEmail.value.trim() || !isValidEmail(contactEmail.value.trim())) {
        showError(contactEmail, 'Please enter a valid email');
        valid = false;
      } else {
        clearError(contactEmail);
      }

      if (!contactSubject.value.trim()) {
        showError(contactSubject, 'Please enter a subject');
        valid = false;
      } else {
        clearError(contactSubject);
      }

      if (!contactMessage.value.trim()) {
        showError(contactMessage, 'Please enter your message');
        valid = false;
      } else {
        clearError(contactMessage);
      }

      if (valid) {
        contactForm.classList.add('submitted');
        showFormSuccess(contactForm, 'Message sent! We\'ll get back to you soon.');
        contactName.value = ''; contactEmail.value = ''; contactSubject.value = ''; contactMessage.value = '';
      }
    });

    if (contactName) contactName.addEventListener('input', function () { clearGroupState(this); });
    if (contactEmail) contactEmail.addEventListener('input', function () { clearGroupState(this); });
    if (contactSubject) contactSubject.addEventListener('input', function () { clearGroupState(this); });
    if (contactMessage) contactMessage.addEventListener('input', function () { clearGroupState(this); });
  }

  // ===== GENERAL FORM SUCCESS =====
  function showFormSuccess(form, message) {
    var existing = form.querySelector('.form-success');
    if (existing) existing.remove();

    var success = document.createElement('div');
    success.className = 'form-success';
    success.textContent = message;
    form.appendChild(success);

    setTimeout(function () {
      if (success.parentNode) success.remove();
      form.classList.remove('submitted');
    }, 4000);
  }

  // ===== REAL-TIME VALIDATION HELPERS (EXPORTED) =====
  window.formValidators = {
    isValidEmail: isValidEmail,
    showError: showError,
    clearError: clearError,
    showSuccess: showSuccess
  };

});
