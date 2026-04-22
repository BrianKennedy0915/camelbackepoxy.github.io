/* ============================================================
   CAMELBACK EPOXY CO. — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Sticky Nav ─────────────────────────────────────────
  const nav = document.querySelector('.nav');
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── 2. Mobile Hamburger ───────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');

  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.nav__mobile a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ── Active nav link ────────────────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html'))
      a.classList.add('active');
  });

  // ── 3. Scroll Reveal ──────────────────────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── 5. Counter Animation ──────────────────────────────────
  const animateCount = el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const start  = performance.now();
    const tick   = now => {
      const p = Math.min((now - start) / 2000, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.floor(e * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item__number[data-target]').forEach(el => countObs.observe(el));

  // ── 4. FAQ Accordion ──────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-question.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling?.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        btn.nextElementSibling?.classList.add('open');
      }
    });
  });

  // ── Gallery Filter (gallery.html) ─────────────────────────
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        galleryCards.forEach(card => {
          const show = f === 'all' || card.dataset.category === f;
          card.style.transition = 'opacity 0.3s';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = show ? '' : 'none';
            if (show) requestAnimationFrame(() => { card.style.opacity = '1'; });
          }, 200);
        });
      });
    });
  }

  // ── Lead Form ─────────────────────────────────────────────
  document.querySelectorAll('.lead-form form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('[type="submit"]');
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

  // ── Phone tracking ────────────────────────────────────────
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => {
      if (typeof gtag !== 'undefined')
        gtag('event', 'phone_call_click', { event_category: 'lead' });
    });
  });

  // ── Smooth scroll ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── Gallery Lightbox ──────────────────────────────────────
  const items = document.querySelectorAll('.gallery-item');
  if (items.length) {
    const ov = document.createElement('div');
    ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(15,32,64,0.96);z-index:9999;align-items:center;justify-content:center;cursor:pointer;padding:24px';
    ov.innerHTML = `
      <div style="position:relative;max-width:900px;width:90vw">
        <div id="lb-content" style="width:100%;height:60vh;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-size:20px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:rgba(245,240,232,0.4);border:1px solid rgba(200,169,110,0.25)"></div>
        <button aria-label="Close" style="position:absolute;top:-44px;right:0;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;line-height:1">✕</button>
      </div>`;
    document.body.appendChild(ov);
    items.forEach(item => {
      item.addEventListener('click', () => {
        document.getElementById('lb-content').textContent = item.querySelector('.gallery-item__label')?.textContent || '';
        document.getElementById('lb-content').style.background = getComputedStyle(item).background;
        ov.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
    ov.addEventListener('click', () => { ov.style.display = 'none'; document.body.style.overflow = ''; });
  }

});
