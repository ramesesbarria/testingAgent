/* =========================================================
   TestingAgent — Main JavaScript
   ========================================================= */

'use strict';

// ----- Sticky header -----
(function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ----- Mobile nav toggle -----
(function initMobileNav() {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close menu when a link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (header && !header.contains(e.target)) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ----- Scroll-reveal -----
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .step, .stat, .pricing-card, .testimonial, .section-header, .hero__text, .hero__visual, .contact__text, .contact-form'
  );
  targets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger siblings
            const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
            const delay = siblings.indexOf(entry.target) * 80;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    targets.forEach(el => el.classList.add('visible'));
  }
})();

// ----- Animated counters -----
(function initCounters() {
  const counters = document.querySelectorAll('.stat__number[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const DURATION = 1800;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => observer.observe(el));
  } else {
    counters.forEach(el => (el.textContent = el.dataset.target));
  }
})();

// ----- Contact form -----
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  const nameInput  = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const nameError  = form.querySelector('#name-error');
  const emailError = form.querySelector('#email-error');

  const validate = () => {
    let valid = true;

    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      nameInput.classList.add('invalid');
      valid = false;
    } else {
      nameError.textContent = '';
      nameInput.classList.remove('invalid');
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('invalid');
      valid = false;
    } else {
      emailError.textContent = '';
      emailInput.classList.remove('invalid');
    }

    return valid;
  };

  // Live validation on blur
  nameInput.addEventListener('blur',  validate);
  emailInput.addEventListener('blur', validate);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const btn     = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn__text');
    const spinner = btn.querySelector('.btn__spinner');

    btn.disabled    = true;
    btnText.hidden  = true;
    spinner.hidden  = false;

    // Simulate async submission
    setTimeout(() => {
      btn.hidden      = true;
      success.hidden  = false;
      form.reset();
    }, 1200);
  });
})();

// ----- Footer year -----
(function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// ----- Active nav link on scroll -----
(function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');
  if (!sections.length || !links.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY + 100;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    links.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
