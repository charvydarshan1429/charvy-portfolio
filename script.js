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

/* ===== CHARVY ADDITIVE INTERACTIONS ===== */
(() => {
  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const paletteToggle = document.getElementById('paletteToggle');
  const palettePanel = document.getElementById('palettePanel');

  const themes = {
    cherry: '#a12b2b',
    blue: '#1677b8',
    green: '#2b7a58',
    violet: '#7850a8'
  };

  function applyAccent(name) {
    const color = themes[name] || themes.cherry;
    const rgb = color.replace('#','').match(/.{2}/g).map(v => parseInt(v,16)).join(',');
    root.style.setProperty('--accent', color);
    root.style.setProperty('--accent-rgb', rgb);
    localStorage.setItem('charvy-accent', name);
  }

  function applyMode(dark) {
    body.classList.toggle('dark-mode', dark);
    if (themeToggle) {
      themeToggle.textContent = dark ? '☀' : '☾';
      themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    localStorage.setItem('charvy-dark', dark ? '1' : '0');
  }

  applyAccent(localStorage.getItem('charvy-accent') || 'cherry');
  applyMode(localStorage.getItem('charvy-dark') === '1');

  themeToggle?.addEventListener('click', () => applyMode(!body.classList.contains('dark-mode')));
  paletteToggle?.addEventListener('click', () => {
    const open = palettePanel.classList.toggle('open');
    palettePanel.setAttribute('aria-hidden', String(!open));
  });

  palettePanel?.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyAccent(btn.dataset.theme);
      palettePanel.classList.remove('open');
      palettePanel.setAttribute('aria-hidden', 'true');
    });
  });

  document.addEventListener('click', e => {
    if (palettePanel?.classList.contains('open') &&
        !palettePanel.contains(e.target) && !paletteToggle?.contains(e.target)) {
      palettePanel.classList.remove('open');
      palettePanel.setAttribute('aria-hidden', 'true');
    }
  });

  // RC car: one real car, short drive, then exact return.
  const rc = document.querySelector('[data-rc-card]');
  if (rc) {
    const runCar = () => {
      if (rc.classList.contains('drive')) return;
      rc.classList.add('drive');
      setTimeout(() => rc.classList.remove('drive'), 2100);
    };
    rc.addEventListener('click', e => {
      if (!e.target.closest('button')) runCar();
    });
    rc.querySelector('.bay-action')?.addEventListener('click', e => {
      e.stopPropagation(); runCar();
    });
    rc.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); runCar(); }
    });
  }

  const printer = document.querySelector('[data-printer-card]');
  if (printer) {
    const print = () => {
      printer.classList.remove('printing');
      void printer.offsetWidth;
      printer.classList.add('printing');
      setTimeout(() => printer.classList.remove('printing'), 1500);
    };
    printer.addEventListener('click', e => { if (!e.target.closest('button')) print(); });
    printer.querySelector('.bay-action')?.addEventListener('click', e => { e.stopPropagation(); print(); });
    printer.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); print(); }
    });
  }

  const factory = document.querySelector('[data-factory-card]');
  if (factory) {
    const runFactory = () => {
      factory.classList.remove('running');
      void factory.offsetWidth;
      factory.classList.add('running');
      setTimeout(() => factory.classList.remove('running'), 1500);
    };
    factory.addEventListener('click', e => { if (!e.target.closest('button')) runFactory(); });
    factory.querySelector('.bay-action')?.addEventListener('click', e => { e.stopPropagation(); runFactory(); });
    factory.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); runFactory(); }
    });
  }
})();
