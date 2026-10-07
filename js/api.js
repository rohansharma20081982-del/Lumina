var API_BASE = 'http://127.0.0.1:8000/api';

function fmtPrice(n) {
  var num = parseFloat(n) || 0;
  return '\u20B9' + Math.round(num).toLocaleString('en-IN');
}

function getCSRFToken() {
  var name = 'csrftoken';
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

function apiFetch(endpoint, options) {
  var opts = options || {};
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  opts.headers['X-CSRFToken'] = getCSRFToken();
  opts.credentials = 'include';
  return fetch(API_BASE + endpoint, opts).then(function (r) {
    return r.json().then(function (data) {
      if (!r.ok) throw data;
      return data;
    });
  });
}
