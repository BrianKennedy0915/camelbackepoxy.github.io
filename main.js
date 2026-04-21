/* ============================================================
   CAMELBACK EPOXY CO. — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Sticky Nav ──────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  const scrollThreshold = 80;
  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile Nav ──────────────────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.nav__mobile a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Active Nav Link ──────────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Scroll Reveal ────────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Counter Animation ────────────────────────────────────────
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''));
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item__number[data-target]').forEach(el => counterObserver.observe(el));

  // ── FAQ Accordion ────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-question.open').forEach(openBtn => {
        openBtn.classList.remove('open');
        openBtn.nextElementSibling?.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        btn.classList.add('open');
        answer?.classList.add('open');
      }
    });
  });

  // ── Lead Form Handling ───────────────────────────────────────
  document.querySelectorAll('.lead-form form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate submission (replace with Formspree / Netlify Forms / EmailJS)
      setTimeout(() => {
        btn.textContent = '✓ Request Sent!';
        btn.style.background = '#4CAF50';
        setTimeout(() => {
          btn.textContent = originalText;
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
        gtag('event', 'phone_call_click', { event_category: 'lead', event_label: 'phone_cta' });
      }
    });
  });

  // ── Smooth scroll for anchor links ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Gallery lightbox (simple) ────────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      display:none; position:fixed; inset:0; background:rgba(0,0,0,0.95);
      z-index:9999; align-items:center; justify-content:center; cursor:pointer;
    `;
    overlay.innerHTML = `
      <div style="max-width:90vw;max-height:90vh;position:relative;">
        <div id="lb-content" style="width:80vw;max-width:900px;height:60vh;background:var(--iron);border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:48px;letter-spacing:4px;color:rgba(245,240,232,0.1);"></div>
        <button style="position:absolute;top:-40px;right:0;background:none;border:none;color:white;font-size:32px;cursor:pointer;line-height:1;">✕</button>
      </div>
    `;
    document.body.appendChild(overlay);

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const label = item.querySelector('.gallery-item__label')?.textContent || '';
        document.getElementById('lb-content').textContent = label;
        document.getElementById('lb-content').style.background = item.style.background || getComputedStyle(item).background;
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
