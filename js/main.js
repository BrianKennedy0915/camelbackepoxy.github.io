/* ============================================================
   CAMELBACK EPOXY CO. — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Sticky Nav ──────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  const handleScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 80);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile Nav Toggle ────────────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.nav__mobile a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ── Active Nav Link ──────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Scroll Reveal ────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Counter Animation ────────────────────────────────────────
  const animateCounter = el => {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 2000;
    const start    = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('.stat-item__number[data-target]')
    .forEach(el => counterObserver.observe(el));

  // ── FAQ Accordion ────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-question.open').forEach(open => {
        open.classList.remove('open');
        open.nextElementSibling?.classList.remove('open');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        btn.classList.add('open');
        btn.nextElementSibling?.classList.add('open');
      }
    });
  });

  // ── Gallery Filter (gallery.html) ───────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        galleryCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.opacity    = '0';
          card.style.transition = 'opacity 0.3s ease';
          setTimeout(() => {
            card.style.display  = show ? '' : 'none';
            if (show) requestAnimationFrame(() => { card.style.opacity = '1'; });
          }, 150);
        });
      });
    });
  }

  // ── Lead Form Handling ───────────────────────────────────────
  document.querySelectorAll('.lead-form form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Request Sent!';
        btn.style.background = '#3a7d44';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1000);
    });
  });

  // ── Phone Link Tracking ──────────────────────────────────────
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_call_click', {
          event_category: 'lead',
          event_label: 'phone_cta'
        });
      }
    });
  });

  // ── Smooth Scroll ────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Gallery Lightbox ─────────────────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'display:none',
      'position:fixed',
      'inset:0',
      'background:rgba(13,27,42,0.96)',
      'z-index:9999',
      'align-items:center',
      'justify-content:center',
      'cursor:pointer',
      'padding:24px'
    ].join(';');

    overlay.innerHTML = `
      <div style="position:relative;max-width:900px;width:90vw;">
        <div id="lb-content"
          style="width:100%;height:60vh;border-radius:10px;display:flex;
                 align-items:center;justify-content:center;
                 font-family:'Montserrat',sans-serif;font-size:22px;
                 font-weight:800;letter-spacing:3px;text-transform:uppercase;
                 color:rgba(245,240,232,0.5);border:1px solid rgba(200,169,110,0.2);">
        </div>
        <button aria-label="Close"
          style="position:absolute;top:-44px;right:0;background:none;border:none;
                 color:white;font-size:28px;cursor:pointer;line-height:1;
                 font-family:sans-serif;">✕</button>
      </div>`;
    document.body.appendChild(overlay);

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const label = item.querySelector('.gallery-item__label')?.textContent || '';
        const lb = document.getElementById('lb-content');
        lb.textContent = label;
        lb.style.background = getComputedStyle(item).background;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    overlay.addEventListener('click', () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

});
