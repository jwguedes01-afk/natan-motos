/* ============================================================
   NATAN MOTOS – script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. HEADER – scroll effect + active nav link
     ============================================================ */
  const header    = document.getElementById('header');
  const navLinks  = document.querySelectorAll('.nav__link');
  const sections  = document.querySelectorAll('section[id], div[id]');

  function onScroll() {
    // Scrolled class
    header.classList.toggle('scrolled', window.scrollY > 40);

    // Active nav link based on section in view
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ============================================================
     2. MOBILE MENU
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  const overlay   = createOverlay();

  function createOverlay() {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:998;opacity:0;pointer-events:none;transition:opacity .3s';
    document.body.appendChild(el);
    return el;
  }

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    overlay.style.opacity       = open ? '1' : '0';
    overlay.style.pointerEvents = open ? 'all' : 'none';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
  overlay.addEventListener('click', () => toggleMenu(false));

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });


  /* ============================================================
     3. SMOOTH SCROLL
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // header height
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });


  /* ============================================================
     4. REVEAL ON SCROLL (IntersectionObserver)
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children inside grids
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  // Stagger cards inside grids
  document.querySelectorAll('.services__grid, .differentials__grid, .gallery__grid').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((card, i) => {
      card.dataset.delay = i * 80;
    });
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ============================================================
     5. ANIMATED STATS COUNTER
     ============================================================ */
  const statNumbers = document.querySelectorAll('.stat__number');
  let statsAnimated = false;

  function animateCount(el) {
    const target   = +el.dataset.target;
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString('pt-BR');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString('pt-BR');
      }
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(el => animateCount(el));
    }
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);


  /* ============================================================
     6. GALLERY LIGHTBOX
     ============================================================ */
  const galleryItems  = Array.from(document.querySelectorAll('.gallery__item'));
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  const lightboxCount = document.getElementById('lightboxCounter');
  let currentIndex    = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img    = galleryItems[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCount.textContent = `${index + 1} / ${galleryItems.length}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Touch swipe support for lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
  });


  /* ============================================================
     7. TESTIMONIALS CAROUSEL
     ============================================================ */
  const track    = document.getElementById('testimonialsTrack');
  const inner    = document.getElementById('testimonialsInner');
  const dotsWrap = document.getElementById('testimonialsDots');

  if (inner && track) {
    const cards   = inner.querySelectorAll('.testimonial-card');
    const GAP     = 24;
    let autoTimer = null;
    let current   = 0;

    function getVisible() {
      const w = window.innerWidth;
      if (w > 1024) return 3;
      if (w > 640)  return 2;
      return 1;
    }

    // Calcula e aplica a largura correta de cada card com base na faixa visível
    function getCardWidth() {
      const visible  = getVisible();
      const trackW   = track.offsetWidth;
      const cardW    = (trackW - (visible - 1) * GAP) / visible;
      cards.forEach(c => { c.style.minWidth = cardW + 'px'; c.style.maxWidth = cardW + 'px'; });
      return cardW;
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const total = Math.ceil(cards.length / getVisible());
      for (let i = 0; i < total; i++) {
        const btn = document.createElement('button');
        btn.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', `Depoimento ${i + 1}`);
        btn.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsWrap.appendChild(btn);
      }
    }

    function goTo(index) {
      const visible  = getVisible();
      const maxIndex = Math.ceil(cards.length / visible) - 1;
      current = Math.max(0, Math.min(index, maxIndex));

      const cardW = getCardWidth();
      inner.style.transform = `translateX(-${current * visible * (cardW + GAP)}px)`;

      dotsWrap.querySelectorAll('.testimonials__dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoTimer = setInterval(() => {
        const maxIndex = Math.ceil(cards.length / getVisible()) - 1;
        goTo(current >= maxIndex ? 0 : current + 1);
      }, 5000);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    // Touch swipe para depoimentos
    let tStartX = 0;
    inner.addEventListener('touchstart', e => { tStartX = e.touches[0].clientX; }, { passive: true });
    inner.addEventListener('touchend',   e => {
      const diff = tStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        const maxIndex = Math.ceil(cards.length / getVisible()) - 1;
        diff > 0
          ? goTo(current >= maxIndex ? 0 : current + 1)
          : goTo(current <= 0 ? maxIndex : current - 1);
        resetAuto();
      }
    });

    getCardWidth();
    buildDots();
    goTo(0);
    startAuto();
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
  }


  /* ============================================================
     8. CONTACT FORM – sends via WhatsApp
     ============================================================ */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name    = form.name.value.trim();
      const phone   = form.phone.value.trim();
      const moto    = form.moto.value.trim();
      const service = form.service.value;
      const message = form.message.value.trim();

      if (!name || !phone) {
        alert('Por favor, preencha seu nome e telefone.');
        return;
      }

      const text = [
        `Olá! Vim pelo site da Natan Motos.`,
        ``,
        `*Nome:* ${name}`,
        `*Telefone:* ${phone}`,
        moto    ? `*Moto:* ${moto}`       : '',
        service ? `*Serviço:* ${service}` : '',
        message ? `*Mensagem:* ${message}` : '',
      ].filter(Boolean).join('\n');

      const url = `https://wa.me/5585987413758?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }


  /* ============================================================
     9. FOOTER – current year
     ============================================================ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ============================================================
     10. WHATSAPP FLOAT – hide while over footer
     ============================================================ */
  const waFloat = document.querySelector('.whatsapp-float');
  const footer  = document.querySelector('.footer');

  if (waFloat && footer) {
    const waObserver = new IntersectionObserver(([entry]) => {
      waFloat.style.opacity = entry.isIntersecting ? '0' : '1';
    }, { threshold: 0.1 });
    waObserver.observe(footer);
  }

});
