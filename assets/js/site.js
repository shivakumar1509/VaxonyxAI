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
  function openMenu(){ BODY.classList.add('nav-open'); BODY.style.overflow='hidden'; setAria(true); }
  function closeMenu(){ BODY.classList.remove('nav-open'); BODY.style.overflow=''; setAria(false);
    document.querySelectorAll('.dropdown.open, .has-sub.open').forEach(el=>el.classList.remove('open'));
    document.querySelectorAll('.dropdown-link[aria-expanded="true"], .submenu-link[aria-expanded="true"]').forEach(a=>a.setAttribute('aria-expanded','false'));
  }
  function toggleMenu(){ BODY.classList.contains('nav-open') ? closeMenu() : openMenu(); }

  toggle.addEventListener('click', toggleMenu);

  document.addEventListener('click', (e) => {
    if (!BODY.classList.contains('nav-open')) return;
    if (!e.target.closest('.site-header')) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && BODY.classList.contains('nav-open')) closeMenu();
  });

  window.addEventListener('resize', () => { if (!MQ.matches) closeMenu(); });

  // Prevent duplicates (belt & suspenders)
  document.querySelectorAll('.menu-toggle').forEach((btn, i) => { if (i > 0) btn.remove(); });

  // Mobile dropdown tap toggles
  const isMobile = () => MQ.matches;

  document.querySelectorAll('.dropdown > .dropdown-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      const li = link.closest('.dropdown');
      const open = li.classList.toggle('open');
      link.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  document.querySelectorAll('.has-sub > .submenu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      const li = link.closest('.has-sub');
      const open = li.classList.toggle('open');
      link.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
