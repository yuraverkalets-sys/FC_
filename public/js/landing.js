(function () {
  // Nav hide on scroll down, show on scroll up
  const nav = document.getElementById('mainNav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 80) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }
    lastY = y;
  }, { passive: true });

  // Nav color: white on dark sections, dark on light sections
  const darkSections = document.querySelectorAll('.l-hero-scene, .l-cta-dark, .l-footer');
  function updateNavColor() {
    const navRect = nav.getBoundingClientRect();
    let onDark = false;
    darkSections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.top < navRect.bottom && r.bottom > navRect.top) onDark = true;
    });
    nav.classList.toggle('nav--on-light', !onDark);
  }
  window.addEventListener('scroll', updateNavColor, { passive: true });
  updateNavColor();

  // Wrap arrows in span for hover animation
  document.querySelectorAll('.nav-cta, .btn-primary, .l-case-link').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/(→)(?![^<]*<\/span>)/, '<span class="btn-arrow">$1</span>');
  });

  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  // Testimonial rows: play video on hover (desktop) or tap (touch)
  document.querySelectorAll('.l-test-row').forEach(row => {
    const video = row.querySelector('.l-test-video');
    if (!video) return;

    const btn = document.createElement('button');
    btn.className = 'l-test-sound-btn';
    btn.setAttribute('aria-label', 'Toggle sound');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15" class="mute-x1"/><line x1="17" y1="9" x2="23" y2="15" class="mute-x2"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" class="sound-wave"/></svg>';
    row.querySelector('.l-test-media').appendChild(btn);

    let muted = true;
    let playing = false;

    const updateBtn = () => { btn.classList.toggle('is-muted', muted); };
    updateBtn();

    btn.addEventListener('click', e => {
      e.stopPropagation();
      muted = !muted;
      video.muted = muted;
      updateBtn();
    });

    if (isTouch) {
      row.addEventListener('click', () => {
        if (playing) {
          video.pause();
          video.currentTime = 0;
          row.classList.remove('is-playing');
          playing = false;
        } else {
          document.querySelectorAll('.l-test-video').forEach(v => v.pause());
          document.querySelectorAll('.l-test-row').forEach(r => r.classList.remove('is-playing'));
          video.currentTime = 0;
          video.muted = muted;
          video.play().catch(() => {});
          row.classList.add('is-playing');
          playing = true;
        }
      });
    } else {
      row.addEventListener('mouseenter', () => {
        video.currentTime = 0;
        video.muted = muted;
        video.play().catch(() => {});
      });
      row.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });

  // Portfolio cards: play on hover (desktop) or tap (touch)
  document.querySelectorAll('.l-case-card').forEach(card => {
    const video = card.querySelector('.l-case-video');
    if (!video) return;

    if (isTouch) {
      let playing = false;
      card.addEventListener('click', () => {
        if (playing) {
          video.pause();
          video.currentTime = 0;
          card.classList.remove('is-playing');
          playing = false;
        } else {
          document.querySelectorAll('.l-case-video').forEach(v => v.pause());
          document.querySelectorAll('.l-case-card').forEach(c => c.classList.remove('is-playing'));
          video.currentTime = 0;
          video.play().catch(() => {});
          card.classList.add('is-playing');
          playing = true;
        }
      });
    } else {
      card.addEventListener('mouseenter', () => {
        video.currentTime = 0;
        video.play();
      });
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });

  // Equalize testimonial card heights across all rows
  function equalizeTestRows() {
    const rows = document.querySelectorAll('.l-test-row');
    rows.forEach(r => r.style.minHeight = '');
    const maxH = Math.max(...[...rows].map(r => r.offsetHeight));
    rows.forEach(r => r.style.minHeight = maxH + 'px');
  }
  equalizeTestRows();
  window.addEventListener('resize', equalizeTestRows);

  // FAQ accordion
  document.querySelectorAll('.l-faq-item').forEach(item => {
    const q = item.querySelector('.l-faq-q');
    const icon = item.querySelector('.l-faq-icon');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.l-faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.l-faq-icon').textContent = '+';
      });
      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        icon.textContent = '+'; // rotation via CSS handles the visual
      }
    });
  });

  // Footer logo spotlight on hover
  const footerLogo = document.querySelector('.l-footer-logo');
  if (footerLogo) {
    footerLogo.addEventListener('mousemove', e => {
      const rect = footerLogo.getBoundingClientRect();
      footerLogo.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      footerLogo.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  }

  // ── TIMELINE ──────────────────────────────────────────────

  const timelineItems  = document.querySelectorAll('.l-timeline-item');
  const processScroll  = document.querySelector('.l-process-scroll');

  if (timelineItems.length && processScroll) {
    const PER_CARD   = 500;  // px of scroll to bring in each card
    const PAUSE      = 500;  // px held at full-stack before section exits
    const scrollRoom = timelineItems.length * PER_CARD + PAUSE;

    const MAX_H = 860;

    function isMobile() { return window.innerWidth <= 900; }
    function sectionH()  { return Math.min(window.innerHeight, MAX_H); }

    function initHeight() {
      if (isMobile()) { processScroll.style.height = ''; return; }
      processScroll.style.height = (sectionH() + scrollRoom) + 'px';
    }

    function updateCards() {
      if (isMobile()) {
        timelineItems.forEach(item => {
          item.style.transform = 'none';
          const card = item.querySelector('.l-timeline-card');
          if (card) card.classList.remove('is-reached');
        });
        return;
      }
      const scrolled = -processScroll.getBoundingClientRect().top;
      timelineItems.forEach((item, i) => {
        const card = item.querySelector('.l-timeline-card');
        if (i === 0) {
          item.style.transform = 'translateY(0)';
          if (card) card.classList.toggle('is-reached', scrolled > 80);
        } else {
          let p = Math.min(Math.max((scrolled - i * PER_CARD) / PER_CARD, 0), 1);
          p = 1 - Math.pow(1 - p, 3);
          item.style.transform = `translateY(${sectionH() * (1 - p)}px)`;
          if (card) card.classList.toggle('is-reached', p > 0.85);
        }
      });
    }

    initHeight();
    updateCards();
    window.addEventListener('resize', () => { initHeight(); updateCards(); });
    window.addEventListener('scroll', updateCards, { passive: true });
  }


  // CTA background scroll-driven image fade
  document.querySelectorAll('.l-cta-dark').forEach(section => {
    function updateCtaBg() {
      const rect     = section.getBoundingClientRect();
      const vh       = window.innerHeight;
      const start    = vh;
      const end      = vh * 0.3;
      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
      section.style.setProperty('--cta-img-opacity', progress.toFixed(3));
    }
    window.addEventListener('scroll', updateCtaBg, { passive: true });
    updateCtaBg();
  });

})();
