const glow = document.querySelector('.cursor-glow');

window.addEventListener('mousemove', (e) => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
  menuBtn.textContent = navLinks.classList.contains('mobile-open') ? '×' : '☰';
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('mobile-open');
    menuBtn.textContent = '☰';
  });
});

// Slightly more alive on pointer movement — intentionally subtle.
document.querySelectorAll('.skill-card, .project, .hero-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (window.innerWidth > 850 && card.classList.contains('hero-card')) {
      card.style.transform = `rotate(1.4deg) perspective(900px) rotateY(${x * 2}deg) rotateX(${-y * 2}deg)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('hero-card')) card.style.transform = 'rotate(1.4deg)';
  });
});

/* ===== CHARVY USER CONTROLS ===== */
(() => {
  const body = document.body;
  const modeBtn = document.querySelector('.theme-toggle');
  const paletteBtn = document.querySelector('.palette-toggle');
  const palette = document.querySelector('.palette-menu');

  const savedMode = localStorage.getItem('charvy-mode');
  const savedTheme = localStorage.getItem('charvy-theme');
  if (savedMode === 'dark') body.classList.add('dark');
  if (savedTheme) body.dataset.theme = savedTheme;

  function updateModeIcon(){
    if(modeBtn) modeBtn.textContent = body.classList.contains('dark') ? '☀' : '☾';
  }
  updateModeIcon();

  modeBtn?.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('charvy-mode', body.classList.contains('dark') ? 'dark' : 'light');
    updateModeIcon();
  });

  paletteBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    palette?.classList.toggle('open');
    palette?.setAttribute('aria-hidden', palette?.classList.contains('open') ? 'false' : 'true');
  });

  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      body.dataset.theme = btn.dataset.theme;
      localStorage.setItem('charvy-theme', btn.dataset.theme);
      palette?.classList.remove('open');
      palette?.setAttribute('aria-hidden','true');
    });
  });
  document.addEventListener('click', (e) => {
    if(!palette?.contains(e.target) && e.target !== paletteBtn) palette?.classList.remove('open');
  });
})();
