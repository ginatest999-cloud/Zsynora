/**
 * ZSynora Technologies — Form Validation & Handler
 * Robust client-side validation and Section 32 compliant feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  setupFormHandler('contact-form', 'contact-success-state');
  setupFormHandler('modal-consultation-form', 'modal-success-state');
});

function setupFormHandler(formId, successCardId) {
  const form = document.getElementById(formId);
  const successCard = document.getElementById(successCardId);
  if (!form || !successCard) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        isValid = false;
        if (group) group.classList.add('has-error');
      } else {
        if (input.type === 'email') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value.trim())) {
            isValid = false;
            if (group) group.classList.add('has-error');
            return;
          }
        }
        if (group) group.classList.remove('has-error');
      }

      // Clear error on input
      input.addEventListener('input', () => {
        if (group) group.classList.remove('has-error');
      }, { once: true });
    });

    if (!isValid) {
      const firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Submit state simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display: inline-block; margin-right: 6px;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Submitting...
    `;

    setTimeout(() => {
      form.reset();
      form.style.display = 'none';
      successCard.classList.add('active');
      if (window.triggerCelebration) window.triggerCelebration();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 600);
  });
}
