document.addEventListener('DOMContentLoaded', function () {

  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = contactForm.querySelector('[name="name"], #contact-name');
      var emailInput = contactForm.querySelector('[name="email"], #contact-email');
      var phoneInput = contactForm.querySelector('[name="phone"], #contact-phone');
      var subjectInput = contactForm.querySelector('[name="subject"], #contact-subject');
      var messageInput = contactForm.querySelector('[name="message"], #contact-message');
      var submitBtn = contactForm.querySelector('.btn-primary');

      if (!submitBtn) return;
      var originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      apiFetch('/contact/', {
        method: 'POST',
        body: JSON.stringify({
          name: nameInput ? nameInput.value : '',
          email: emailInput ? emailInput.value : '',
          phone: phoneInput ? phoneInput.value : '',
          subject: subjectInput ? subjectInput.value : '',
          message: messageInput ? messageInput.value : ''
        })
      }).then(function () {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2500);
      }).catch(function () {
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
      });
    });
  }
});
