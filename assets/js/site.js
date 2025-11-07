// assets/js/site.js
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('nav-open')) return;
    if (!e.target.closest('.site-header')) {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
