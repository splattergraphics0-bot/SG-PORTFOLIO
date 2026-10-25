(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
    }));
  }

  // Lightweight reveal animation; content remains visible if JS is unavailable.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Prefill the enquiry form when a package CTA is selected.
  const serviceSelect = document.querySelector('select[name="service"]');
  document.querySelectorAll('[data-package]').forEach(link => {
    link.addEventListener('click', () => {
      if (!serviceSelect) return;
      const packageName = link.dataset.package;
      const option = Array.from(serviceSelect.options).find(item => item.textContent.trim() === packageName);
      if (option) serviceSelect.value = option.value;
    });
  });

  // Formspree handles the submission. Show a clear status and avoid falsely claiming success.
  const form = document.querySelector('.contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('.submit-btn');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const original = submit.innerHTML;
      submit.disabled = true;
      submit.innerHTML = 'Sending enquiry…';
      status.textContent = '';
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('The form service did not accept the submission.');
        const data = new FormData(form);
        const details = [
          'Hello Splatter Graphics! I would like to discuss a project.',
          '',
          `Name: ${data.get('name')}`,
          `Email: ${data.get('email')}`,
          `Phone: ${data.get('phone')}`,
          `Service: ${data.get('service')}`,
          '',
          'Project details:',
          data.get('message')
        ].join('\n');
        status.textContent = 'Enquiry submitted successfully. Opening WhatsApp so you can also send the details directly.';
        form.reset();
        const waUrl = `https://wa.me/919847594021?text=${encodeURIComponent(details)}`;
        const waWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');
        if (!waWindow) status.textContent += ' If WhatsApp did not open, use the Chat on WhatsApp link on this page.';
      } catch (error) {
        status.textContent = 'We could not submit the form just now. Please try again or contact us directly on WhatsApp.';
      } finally {
        submit.disabled = false;
        submit.innerHTML = original;
      }
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
