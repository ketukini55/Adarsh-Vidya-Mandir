/* ==========================================
   ADARSH VIDYA MANDIR — PREMIUM JAVASCRIPT
   Loader · Cursor · Hero Slider · Canvas
   Lightbox · Scroll FX · Counter · Navbar
   ========================================== */

'use strict';

/* ──────────────────────────────────────────
   1. LOADER
   ────────────────────────────────────────── */
const loader   = document.getElementById('loader');
const progress = document.getElementById('loader-progress');
let loadVal = 0;

const loadTimer = setInterval(() => {
  loadVal += Math.random() * 18 + 5;
  if (loadVal >= 100) {
    loadVal = 100;
    clearInterval(loadTimer);
    setTimeout(() => {
      loader.classList.add('done');
      // trigger hero animations after load
      document.querySelectorAll('.hero-content > *').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.7s ${0.1 + i * 0.12}s ease, transform 0.7s ${0.1 + i * 0.12}s ease`;
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
      initScrollAnimations();
    }, 400);
  }
  if (progress) progress.style.width = loadVal + '%';
}, 80);

/* ──────────────────────────────────────────
   2. CUSTOM CURSOR
   ────────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  }
});

function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  if (cursor) {
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect
document.querySelectorAll('a, button, .gallery-item, .feature-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('cursor-hover'));
});

/* ──────────────────────────────────────────
   3. HERO CANVAS — PARTICLE NETWORK
   ────────────────────────────────────────── */
const heroCanvas = document.getElementById('hero-canvas');

function initParticles() {
  if (!heroCanvas) return;
  const ctx = heroCanvas.getContext('2d');
  let W = heroCanvas.width  = heroCanvas.offsetWidth;
  let H = heroCanvas.height = heroCanvas.offsetHeight;

  const PARTICLES = Math.min(60, Math.floor(W * H / 18000));
  const particles = [];

  for (let i = 0; i < PARTICLES; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = heroCanvas.width  = heroCanvas.offsetWidth;
    H = heroCanvas.height = heroCanvas.offsetHeight;
  });
}

initParticles();

/* ──────────────────────────────────────────
   4. HERO SLIDESHOW
   ────────────────────────────────────────── */
const slides  = document.querySelectorAll('.hero-slide');
const dots    = document.querySelectorAll('.hero-dot');
let currentSlide = 0;
let slideTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }

function startSlider() {
  slideTimer = setInterval(nextSlide, 5000);
}

startSlider();

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(slideTimer);
    goToSlide(i);
    startSlider();
  });
});

// Pause on hover
const heroSection = document.getElementById('home');
if (heroSection) {
  heroSection.addEventListener('mouseenter', () => clearInterval(slideTimer));
  heroSection.addEventListener('mouseleave', startSlider);
}

/* ──────────────────────────────────────────
   5. NAVBAR — Scroll + Active Links
   ────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Scroll-to-top button
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });

  // Scroll animations
  checkAnimations();
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ──────────────────────────────────────────
   6. HAMBURGER MENU
   ────────────────────────────────────────── */
const hamburger    = document.getElementById('hamburger');
const navLinksEl   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  }
});

/* ──────────────────────────────────────────
   7. SCROLL-TO-TOP BUTTON
   ────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────
   8. SCROLL REVEAL ANIMATIONS
   ────────────────────────────────────────── */
function initScrollAnimations() {
  // Add animate classes to cards
  document.querySelectorAll('.feature-card').forEach((el, i) => {
    el.classList.add('animate-up');
    el.style.transitionDelay = `${i * 0.08}s`;
  });
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.classList.add('animate-up');
    el.style.transitionDelay = `${i * 0.04}s`;
  });
  document.querySelectorAll('.contact-card').forEach((el, i) => {
    el.classList.add('animate-up');
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  checkAnimations();
}

function checkAnimations() {
  const els = document.querySelectorAll('.animate-up, .animate-left, .animate-right');
  const vh  = window.innerHeight;
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh - 60 && rect.bottom > 0) {
      el.classList.add('in-view');
    }
  });
}

/* ──────────────────────────────────────────
   9. STAT COUNTER ANIMATION
   ────────────────────────────────────────── */
let statsTriggered = false;

function animateStats() {
  if (statsTriggered) return;
  const statPanel = document.querySelector('.hero-stats-panel');
  if (!statPanel) return;
  const rect = statPanel.getBoundingClientRect();
  if (rect.top < window.innerHeight + 100) {
    statsTriggered = true;
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count;
        if (count >= target) clearInterval(timer);
      }, 25);
    });
  }
}

window.addEventListener('scroll', animateStats, { passive: true });
setTimeout(animateStats, 800);

/* ──────────────────────────────────────────
   10. GALLERY FILTER
   ────────────────────────────────────────── */
const tabBtns = document.querySelectorAll('.tab-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    galleryItems.forEach((item, i) => {
      const cat  = item.dataset.category;
      const show = filter === 'all' || cat === filter;

      if (show) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9) translateY(10px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity    = '1';
          item.style.transform  = 'scale(1) translateY(0)';
        }, i * 40);
      } else {
        item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        item.style.opacity    = '0';
        item.style.transform  = 'scale(0.92)';
        setTimeout(() => { item.style.display = 'none'; }, 280);
      }
    });
  });
});

/* ──────────────────────────────────────────
   11. GALLERY LIGHTBOX
   ────────────────────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxBg    = document.getElementById('lightbox-bg');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxCap   = document.getElementById('lightbox-caption');
const lightboxTag   = document.getElementById('lightbox-tag');
const lightboxCount = document.getElementById('lightbox-counter');
const lbClose       = document.getElementById('lightbox-close');
const lbPrev        = document.getElementById('lightbox-prev');
const lbNext        = document.getElementById('lightbox-next');

let lbIndex    = 0;
let lbVisible  = [];

function getVisible() {
  return [...galleryItems].filter(el => el.style.display !== 'none');
}

function openLightbox(idx) {
  lbVisible = getVisible();
  lbIndex   = idx;
  showLbImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showLbImage() {
  const item  = lbVisible[lbIndex];
  if (!item) return;
  const img   = item.querySelector('img');
  const tag   = item.querySelector('.go-tag');
  const title = item.querySelector('.go-title');

  // Fade effect
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.style.transition = 'opacity 0.35s';
    lightboxImg.style.opacity = '1';
  }, 100);

  if (lightboxTag) lightboxTag.textContent = tag ? tag.textContent : '';
  if (lightboxCap) lightboxCap.textContent = title ? title.textContent : img.alt;
  if (lightboxCount) lightboxCount.textContent = `${lbIndex + 1} / ${lbVisible.length}`;
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    lbVisible = getVisible();
    const idx = lbVisible.indexOf(item);
    openLightbox(idx >= 0 ? idx : 0);
  });
});

lbClose.addEventListener('click', closeLightbox);
lightboxBg.addEventListener('click', closeLightbox);

lbPrev.addEventListener('click', e => {
  e.stopPropagation();
  lbIndex = (lbIndex - 1 + lbVisible.length) % lbVisible.length;
  showLbImage();
});

lbNext.addEventListener('click', e => {
  e.stopPropagation();
  lbIndex = (lbIndex + 1) % lbVisible.length;
  showLbImage();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lbPrev.click();
  if (e.key === 'ArrowRight')  lbNext.click();
});

// Touch swipe
let touchSX = 0;
lightbox.addEventListener('touchstart', e => { touchSX = e.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchSX;
  if (Math.abs(dx) > 50) { if (dx < 0) lbNext.click(); else lbPrev.click(); }
});

/* ──────────────────────────────────────────
   12. TILT EFFECT on Gallery Items
   ────────────────────────────────────────── */
galleryItems.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
  });
});

/* ──────────────────────────────────────────
   13. FEATURE CARD TILT
   ────────────────────────────────────────── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-10px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.5s ease';
  });
});

/* ──────────────────────────────────────────
   14. SMOOTH ACTIVE-NAV MARKER
   ────────────────────────────────────────── */
// Highlight nav link on click for instant feel
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

/* ──────────────────────────────────────────
   15. TIMELINE ITEMS — staggered reveal
   ────────────────────────────────────────── */
document.querySelectorAll('.tl-content').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});
