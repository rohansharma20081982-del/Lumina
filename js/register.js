document.addEventListener('DOMContentLoaded', function () {

  var passwordInput = document.querySelector('#reg-password');
  var confirmInput = document.querySelector('#reg-confirm');
  if (passwordInput && confirmInput) {
    confirmInput.addEventListener('input', function () {
      if (confirmInput.value && confirmInput.value !== passwordInput.value) {
        confirmInput.style.borderColor = 'var(--color-error)';
      } else {
        confirmInput.style.borderColor = '';
      }
    });
    passwordInput.addEventListener('input', function () {
      if (confirmInput.value && confirmInput.value !== passwordInput.value) {
        confirmInput.style.borderColor = 'var(--color-error)';
      } else if (confirmInput.value) {
        confirmInput.style.borderColor = 'var(--color-success)';
      }
    });
  }

  document.querySelectorAll('.auth-social-buttons button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var provider = this.querySelector('span')?.textContent || 'social';
      console.log('Register with ' + provider);
    });
  });

  var registerForm = document.querySelector('.auth-card form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = document.getElementById('reg-name');
      var emailInput = document.getElementById('reg-email');
      var password = document.getElementById('reg-password');
      var btn = registerForm.querySelector('.auth-btn');
      if (!nameInput || !emailInput || !password || !btn) return;

      var originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      btn.disabled = true;

      apiFetch('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({
          username: emailInput.value.split('@')[0],
          email: emailInput.value,
          password: password.value,
          password2: password.value,
          first_name: nameInput.value.split(' ')[0] || '',
          last_name: nameInput.value.split(' ').slice(1).join(' ') || ''
        })
      }).then(function (data) {
        btn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
        btn.style.background = 'var(--color-success)';
        btn.style.color = '#fff';
        setTimeout(function () {
          window.location.href = 'login.html';
        }, 1000);
      }).catch(function (err) {
        var keys = err && typeof err === 'object' ? Object.keys(err) : [];
        var msg = 'Registration failed';
        if (keys.length) {
          var val = err[keys[0]];
          msg = Array.isArray(val) ? val[0] : val;
        }
        btn.innerHTML = '<i class="fas fa-times"></i> ' + msg;
        btn.style.background = 'var(--color-error)';
        btn.style.color = '#fff';
        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      });
    });
  }
});
