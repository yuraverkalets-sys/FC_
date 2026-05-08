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

  // Pain section accordion (mobile only — CSS hides body by default at ≤760px)
  document.querySelectorAll('.l-pain-pair').forEach(pair => {
    const quote = pair.querySelector('.l-pain-quote');
    const body  = pair.querySelector('.l-pain-body');
    if (!quote || !body) return;
    const icon = document.createElement('span');
    icon.className = 'l-pain-toggle';
    icon.textContent = '+';
    quote.appendChild(icon);
    quote.addEventListener('click', () => {
      const isOpen = pair.classList.contains('open');
      document.querySelectorAll('.l-pain-pair.open').forEach(p => {
        p.classList.remove('open');
        p.querySelector('.l-pain-toggle').textContent = '+';
      });
      if (!isOpen) {
        pair.classList.add('open');
        icon.textContent = '+';
      }
    });
  });

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

})();
