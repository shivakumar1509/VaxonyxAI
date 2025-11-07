(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  const BODY = document.body;
  if (!toggle || !nav) return;

  const MQ = window.matchMedia('(max-width: 920px)');

  function setAria(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  function openMenu() {
    BODY.classList.add('nav-open');
    BODY.style.overflow = 'hidden';       // lock scroll
    setAria(true);
  }
  function closeMenu() {
    BODY.classList.remove('nav-open');
    BODY.style.overflow = '';
    setAria(false);
    // collapse any opened mobile dropdowns
    document.querySelectorAll('.dropdown.open, .has-sub.open').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.dropdown-link[aria-expanded="true"], .submenu-link[aria-expanded="true"]').forEach(a => a.setAttribute('aria-expanded','false'));
  }
  function toggleMenu() {
    if (BODY.classList.contains('nav-open')) closeMenu(); else openMenu();
  }

  // Toggle button
  toggle.addEventListener('click', toggleMenu);

  // Click outside header to close
  document.addEventListener('click', (e) => {
    if (!BODY.classList.contains('nav-open')) return;
    if (!e.target.closest('.site-header')) {
      closeMenu();
    }
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && BODY.classList.contains('nav-open')) {
      closeMenu();
    }
  });

  // Resize: when we leave mobile, force-close
  function onResize() {
    if (!MQ.matches) closeMenu();
  }
  window.addEventListener('resize', onResize);

  // Prevent accidental duplicate toggles (just in case)
  document.querySelectorAll('.menu-toggle').forEach((btn, i) => { if (i > 0) btn.remove(); });

  // --- Mobile dropdown behavior (tap to expand) ---
  function isMobile() { return MQ.matches; }

  // Primary dropdowns
  document.querySelectorAll('.dropdown > .dropdown-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!isMobile()) return; // desktop uses CSS :hover
      e.preventDefault();
      const li = link.closest('.dropdown');
      const isOpen = li.classList.toggle('open');
      link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Submenus
  document.querySelectorAll('.has-sub > .submenu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      const li = link.closest('.has-sub');
      const isOpen = li.classList.toggle('open');
      link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
})();
