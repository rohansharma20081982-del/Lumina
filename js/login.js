document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.auth-social-buttons button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var provider = this.querySelector('span')?.textContent || 'social';
      console.log('Login with ' + provider);
    });
  });

  var loginForm = document.querySelector('.auth-card form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('login-email');
      var password = document.getElementById('login-password');
      var btn = loginForm.querySelector('.auth-btn');
      if (!email || !password || !btn) return;

      var originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
      btn.disabled = true;

      apiFetch('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email: email.value, password: password.value })
      }).then(function (data) {
        btn.innerHTML = '<i class="fas fa-check"></i> Welcome Back!';
        btn.style.background = 'var(--color-success)';
        btn.style.color = '#fff';
        setTimeout(function () {
          window.location.href = 'index.html';
        }, 1000);
      }).catch(function (err) {
        btn.innerHTML = '<i class="fas fa-times"></i> Invalid Credentials';
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
