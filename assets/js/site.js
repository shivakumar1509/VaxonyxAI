(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // click outside to close
  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('nav-open')) return;
    if (!e.target.closest('.site-header')) {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
/* === Fix LinkedIn hover visibility === */
.btn-social.linkedin {
  color: #1B427A;               /* normal text */
  background: #fff;
  border-color: #e6ebf4;
  transition: all 0.2s ease;
}

.btn-social.linkedin:hover {
  background: #1B427A;          /* dark blue background */
  color: #fff;                  /* white text on hover */
  border-color: #1B427A;
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(27, 66, 122, 0.25);
}
