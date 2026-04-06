/* Porcinet — main.js */
(function () {
  'use strict';

  /* ── Age Gate ─────────────────────────────────────────────── */
  const AGE_KEY = 'porcinet_age_verified';

  function initAgeGate() {
    const gate = document.getElementById('ageGate');
    if (!gate) return;

    const verified = sessionStorage.getItem(AGE_KEY);
    if (verified === '1') {
      gate.style.display = 'none';
      return;
    }

    gate.style.display = 'flex';

    document.getElementById('ageConfirm').addEventListener('click', function () {
      sessionStorage.setItem(AGE_KEY, '1');
      gate.classList.add('fade-out');
      setTimeout(function () { gate.style.display = 'none'; }, 500);
    });

    document.getElementById('ageDeny').addEventListener('click', function () {
      window.location.href = 'https://www.google.com';
    });
  }

  /* ── Carousel ──────────────────────────────────────────────── */
  function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dotsContainer = document.querySelector('.carousel-controls');
    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');

    if (!slides.length) return;

    let current = 0;
    let timer = null;
    const INTERVAL = 6000;

    /* Build dots */
    const dots = slides.map(function (_, i) {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      btn.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(btn);
      return btn;
    });

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      resetTimer();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, INTERVAL);
    }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    /* Touch / swipe */
    let touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    /* Start */
    slides[0].classList.add('active');
    resetTimer();
  }

  /* ── Sticky Nav highlight ──────────────────────────────────── */
  function initNav() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ── Fade-in on scroll ─────────────────────────────────────── */
  function initFadeIn() {
    const targets = document.querySelectorAll('.movie-card, .about-content, .about-image');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.style.opacity = '1'; });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    /* Inject .visible rule dynamically */
    const style = document.createElement('style');
    style.textContent = '.movie-card.visible, .about-content.visible, .about-image.visible { opacity: 1 !important; transform: none !important; }';
    document.head.appendChild(style);
  }

  /* ── Age-gate fade-out animation ───────────────────────────── */
  const fadeStyle = document.createElement('style');
  fadeStyle.textContent = '.age-gate.fade-out { animation: ageFadeOut 0.5s ease forwards; } @keyframes ageFadeOut { to { opacity: 0; } }';
  document.head.appendChild(fadeStyle);

  /* ── Init ──────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initAgeGate();
    initCarousel();
    initNav();
    initFadeIn();
  });
}());
