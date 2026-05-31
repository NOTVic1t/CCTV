/* ═══════════════════════════════════════════════
   ATI CCTV — main.js
   Production JavaScript
   ═══════════════════════════════════════════════ */

'use strict';

// ─── NAVBAR SCROLL ──────────────────────────────
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ─── MOBILE NAV TOGGLE ──────────────────────────
(function () {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ─── SCROLL REVEAL ──────────────────────────────
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
})();

// ─── COUNTER ANIMATION ──────────────────────────
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCount = (el, target) => {
    const duration = 1800;
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          animateCount(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

// ─── FAQ ACCORDION ──────────────────────────────
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ─── LIGHTBOX ───────────────────────────────────
(function () {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (!portfolioItems.length) return;

  // Create lightbox element
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Tutup">✕</button>
    <img src="" alt="ATI CCTV Portfolio" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg   = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'ATI CCTV';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  };

  portfolioItems.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    item.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── WHATSAPP FLOAT PULSE ───────────────────────
(function () {
  const waFloat = document.querySelector('.wa-float');
  if (!waFloat) return;

  // Pulse animation on page load after 3s
  setTimeout(() => {
    waFloat.style.animation = 'waPulse 0.6s ease-in-out 3';
    waFloat.addEventListener('animationend', () => {
      waFloat.style.animation = '';
    });
  }, 3000);

  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes waPulse {
      0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(37,211,102,0.45); }
      50% { transform: scale(1.08); box-shadow: 0 16px 48px rgba(37,211,102,0.7); }
    }
  `;
  document.head.appendChild(style);
})();

// ─── ACTIVE NAV LINK ON SCROLL ──────────────────
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    let current = '';
    const offset = 100;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= offset) current = section.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) {
        link.style.color = '#ffffff';
      } else {
        link.style.color = '';
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ─── LAZY IMAGE LOAD FALLBACK ───────────────────
(function () {
  if ('loading' in HTMLImageElement.prototype) return; // Native lazy load supported

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImages.forEach(img => observer.observe(img));
})();
