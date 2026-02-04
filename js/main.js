/* js file for login, sign up and forget password*/

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. PASSWORD VISIBILITY TOGGLE  (login & signup)
     ────────────────────────────────────────────── */
  const toggleButtons = document.querySelectorAll('.toggle-password');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const inputWrap = button.closest('.input-wrap');
      const input = inputWrap.querySelector('input');

      if (input.type === 'password') {
        // Show password
        input.type = 'text';
        input.classList.add('password-visible');
        button.classList.add('showing');
        button.setAttribute('aria-label', 'Hide password');
      } else {
        // Hide password
        input.type = 'password';
        input.classList.remove('password-visible');
        button.classList.remove('showing');
        button.setAttribute('aria-label', 'Show password');
      }
    });
  });

  /* ──────────────────────────────────────────────
     2. PASSWORD MATCH  (signup only)
     ────────────────────────────────────────────── */
  const pwInput      = document.getElementById('password');
  const confirmInput = document.getElementById('confirm-password');
  const confirmError = document.getElementById('confirm-error');

  if (pwInput && confirmInput && confirmError) {

    const checkMatch = () => {
      /* Stay silent until the user has started typing in confirm */
      if (!confirmInput.value) {
        confirmInput.classList.remove('input-error');
        confirmError.classList.remove('visible');
        return;
      }

      const mismatch = pwInput.value !== confirmInput.value;
      confirmInput.classList.toggle('input-error', mismatch);
      confirmError.classList.toggle('visible',    mismatch);
    };

    pwInput.addEventListener('input',      checkMatch);
    confirmInput.addEventListener('input', checkMatch);
  }

  /* ──────────────────────────────────────────────
     3 & 4. SUBMIT HANDLER  (login & signup)
     ────────────────────────────────────────────── */
  const submitBtn = document.querySelector('.btn-primary:not(#reset-btn)');

  if (submitBtn) {

    submitBtn.addEventListener('click', () => {
      let valid = true;

      /* -- highlight every empty text / email / password input -- */
      document.querySelectorAll('.input-wrap input').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('input-error');
          valid = false;
        } else {
          input.classList.remove('input-error');
        }
      });

      /* -- re-run password-match check on signup -- */
      if (pwInput && confirmInput && confirmError) {
        if (pwInput.value && confirmInput.value && pwInput.value !== confirmInput.value) {
          confirmInput.classList.add('input-error');
          confirmError.classList.add('visible');
          valid = false;
        }
      }

      /* stop here if any field is invalid */
      if (!valid) return;

      /* -- demo: brief "processing" state -- */
      const originalLabel      = submitBtn.textContent;
      submitBtn.textContent    = 'Processing…';
      submitBtn.style.opacity  = '0.7';
      submitBtn.disabled       = true;

      setTimeout(() => {
        submitBtn.textContent  = originalLabel;
        submitBtn.style.opacity = '';
        submitBtn.disabled     = false;
      }, 1800);
    });
  }

  /* ──────────────────────────────────────────────
     5. FORGOT PASSWORD HANDLER  (forgot-password only)
     ────────────────────────────────────────────── */
  const resetBtn     = document.getElementById('reset-btn');
  const resetForm    = document.getElementById('reset-form');
  const resetSuccess = document.getElementById('reset-success');
  const sentEmailEl  = document.getElementById('sent-email');
  const resendBtn    = document.getElementById('resend-btn');

  if (resetBtn && resetForm && resetSuccess) {
    const emailInput = resetForm.querySelector('#email');

    resetBtn.addEventListener('click', () => {
      let valid = true;

      /* -- validate email field -- */
      if (!emailInput.value.trim()) {
        emailInput.classList.add('input-error');
        valid = false;
      } else {
        emailInput.classList.remove('input-error');
      }

      /* -- basic email format check -- */
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('input-error');
        valid = false;
      }

      if (!valid) return;

      /* -- demo: brief "processing" state -- */
      const originalLabel    = resetBtn.textContent;
      resetBtn.textContent   = 'Sending…';
      resetBtn.style.opacity = '0.7';
      resetBtn.disabled      = true;

      setTimeout(() => {
        /* -- show success state -- */
        resetForm.style.display    = 'none';
        resetSuccess.style.display = 'block';
        
        /* -- display the email address -- */
        if (sentEmailEl) {
          sentEmailEl.textContent = emailInput.value.trim();
        }

        /* -- reset button state (in case user goes back) -- */
        resetBtn.textContent   = originalLabel;
        resetBtn.style.opacity = '';
        resetBtn.disabled      = false;
      }, 1500);
    });

    /* -- resend link handler -- */
    if (resendBtn) {
      resendBtn.addEventListener('click', () => {
        resendBtn.textContent = 'Sending…';
        resendBtn.disabled    = true;

        setTimeout(() => {
          resendBtn.textContent = 'Link sent!';
          
          setTimeout(() => {
            resendBtn.textContent = 'resend the link';
            resendBtn.disabled    = false;
          }, 2000);
        }, 1200);
      });
    }
  }

});
