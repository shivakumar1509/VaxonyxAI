// /oncosynex/assets/osx_widget.js
(function () {
  // -------- Sizing knobs --------
  const PANEL_WIDTH_PX   = 436;  // + ~1/2 inch wider
  const PANEL_HEIGHT_PX  = 516;  // + ~1/2 inch taller
  const LOG_MAX_HEIGHT_PX = 300; // scrollable chat area height
  const TYPE_SPEED_MS     = 15;  // typewriter speed (ms per character)

  // Popular question IDs (must exist in OSX_QA)
  const POPULAR_IDS = ['gen-01', 'supp-01', 'pr-01'];

  // Cartoon asset
  const CARTOON_URL = "/oncosynex/assets/assistant-lady.svg";

  // -------- CSS (with safe fallbacks) --------
  const CSS = `
    #osx-widget {
      position: fixed;
      bottom: 16px;
      /* Align with container right edge; fall back to 16px if CSS vars missing */
      right: max(16px, calc((100vw - min(var(--max,1180px), 100% - 2*var(--edge,16px)))/2));
      z-index: 9999;
    }

    /* FAB */
    .osx-fab {
      border: 0; border-radius: 999px; padding: 10px 14px;
      background: var(--btn, #1e64ff); color: var(--btn-ink, #fff);
      box-shadow: var(--shadow-soft, 0 6px 16px rgba(0,0,0,.25));
      font-weight: 800; cursor: pointer; font-size: 0.95rem;
    }
    .osx-fab:hover { transform: translateY(-1px); }

    /* PANEL (fixed size, no expand animation) */
    .osx-panel {
      position: fixed; bottom: 70px; right: 16px;
      width: ${PANEL_WIDTH_PX}px; height: ${PANEL_HEIGHT_PX}px;
      max-width: calc(100vw - 32px); max-height: calc(100vh - 120px);
      background: var(--panel, #fff); color: #0b1b3a;
      border: 1px solid #e6ebf4; border-radius: 16px;
      box-shadow: var(--shadow, 0 10px 28px rgba(0,0,0,.35));
      display: none; overflow: hidden;
    }
    .osx-panel.open { display: block; }

    .osx-panel-head {
      display:flex; align-items:center; justify-content:space-between;
      padding: 12px 14px; background: var(--bg, #0f2d6b); color:#fff;
    }
    .osx-close { background: transparent; border: 0; color: #fff; font-size: 20px; cursor: pointer; }

    /* Cartoon + welcome */
    .osx-panel-hero{
      display:flex; align-items:center; gap:14px;
      padding:12px 14px; background:#f6f9ff; border-bottom:1px solid #e6ebf4;
    }
    .osx-illustration{
      width:72px; height:72px; border-radius:999px; flex:0 0 72px;
      background:#fff center/80% no-repeat;
      background-image:url("${CARTOON_URL}");
      border:1px solid #e6ebf4; box-shadow:0 4px 10px rgba(0,0,0,.08);
    }
    .osx-welcome .osx-w1{ font-weight:800; font-size:1rem; color:#0b1b3a; }
    .osx-welcome .osx-w2{ font-size:.9rem; color:#395084; }

    /* Body: log + input */
    .osx-panel-body{
      display:grid; grid-template-rows: 1fr auto;
      height: calc(100% - 120px); /* subtract head+hero approx */
      padding: 10px 12px 12px;
      gap: 10px;
    }

    .osx-log {
      max-height: ${LOG_MAX_HEIGHT_PX}px;
      overflow-y: auto;
      display: grid;
      gap: 8px;
      padding-right: 4px;
    }

    .osx-exchange { display: grid; gap: 4px; }

    .osx-q {
      font-weight: 700;
      font-size: 0.85rem;  /* match popular question font size */
    }

    .osx-a {
      background: #f8fbff;
      border: 1px solid #e6ebf4;
      border-radius: 8px;
      padding: 8px;
      white-space: pre-wrap;
      font-size: 0.85rem;  /* match popular question font size */
    }

    .osx-bottom {
      border-top:1px solid #e6ebf4; background:#fbfdff;
      display:grid; gap:6px; padding:8px 12px;
    }
    .osx-popular-title { font-size: 0.8rem; font-weight:800; color:#314579; }
    .osx-popular-buttons { display:flex; flex-wrap:wrap; gap:6px; }
    .osx-sugg {
      border: 1px solid #d7e0f7; border-radius:999px; padding:6px 10px;
      background:#f6f9ff; cursor:pointer; font-size:0.85rem;
    }

    .osx-input-row { display:flex; align-items:center; gap:6px; }
    .osx-input {
      flex:1; min-width:0; padding:8px 10px;
      border:1px solid #d7e0f7; border-radius:8px; font-size:0.9rem;
    }
    .osx-send {
      flex:0 0 auto; border:0; border-radius:8px; padding:8px 10px;
      background: var(--btn, #1e64ff); color: var(--btn-ink, #fff); font-weight:800; cursor:pointer;
    }
    .osx-send:hover { filter: brightness(1.05); }
  `;

  const ready = (fn) =>
    (document.readyState === "loading")
      ? document.addEventListener("DOMContentLoaded", fn)
      : fn();

  ready(init);

  function init() {
    // inject CSS (once)
    if (!document.getElementById('osx-widget-css')) {
      const s = document.createElement('style');
      s.id = 'osx-widget-css';
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    // mount target
    let mount = document.getElementById("osx-widget");
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'osx-widget';
      document.body.appendChild(mount);
    }

    // Q&A data
    let QA;
    try {
      // eslint-disable-next-line no-undef
      QA = (typeof OSX_QA !== "undefined") ? OSX_QA : (window.OSX_QA || []);
    } catch { QA = window.OSX_QA || []; }
    if (!Array.isArray(QA)) QA = [];

    // UI
    const btn = document.createElement("button");
    btn.className = "osx-fab";
    btn.type = "button";
    btn.textContent = "Ask OncoSyNex AI";

    const panel = document.createElement("div");
    panel.className = "osx-panel";
    panel.innerHTML = `
      <div class="osx-panel-head">
        <strong>OncoSyNex AI</strong>
        <button class="osx-close" aria-label="Close">×</button>
      </div>

      <div class="osx-panel-hero">
        <div class="osx-illustration" aria-hidden="true"></div>
        <div class="osx-welcome">
          <div class="osx-w1">Hi! How can I help you?</div>
          <div class="osx-w2">Ask about ImmunoAI, bioinformatics, pricing, or antigens.</div>
        </div>
      </div>

      <div class="osx-panel-body">
        <div class="osx-log"></div>
        <div class="osx-bottom">
          <div class="osx-popular-title">Popular questions</div>
          <div class="osx-popular-buttons"></div>
          <div class="osx-input-row">
            <input class="osx-input" placeholder="Type your question…" aria-label="Type your question" />
            <button class="osx-send" type="button" aria-label="Send">Send</button>
          </div>
        </div>
      </div>
    `;

    mount.appendChild(btn);
    mount.appendChild(panel);

    const closeBtn   = panel.querySelector(".osx-close");
    const input      = panel.querySelector(".osx-input");
    const sendBtn    = panel.querySelector(".osx-send");
    const log        = panel.querySelector(".osx-log");
    const popularWrap= panel.querySelector(".osx-popular-buttons");

    // 3 popular buttons
    const popular = pickPopular(QA, POPULAR_IDS, 3);
    popularWrap.innerHTML = popular.map(x =>
      `<button class="osx-sugg" type="button" data-q="${escapeAttr(x.q)}">${escapeHtml(x.q)}</button>`
    ).join("");

    let greeted = false;

    // events
    btn.addEventListener("click", () => {
      panel.classList.add("open");
      if (!greeted) { greeted = true; typeAssistant("How can I help you?"); }
      input.focus();
    });
    closeBtn.addEventListener("click", () => panel.classList.remove("open"));

    panel.addEventListener("click", (e) => {
      const b = e.target.closest(".osx-sugg");
      if (!b) return;
      const q = b.getAttribute('data-q') || b.textContent;
      input.value = q;
      answer(q);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); answer(input.value.trim()); }
    });
    sendBtn.addEventListener("click", () => answer(input.value.trim()));

    // answer with typewriter
    function answer(qtext) {
      if (!qtext) return;

      const wrap = document.createElement("div");
      wrap.className = "osx-exchange";
      wrap.innerHTML = `<div class="osx-q">${escapeHtml(qtext)}</div><div class="osx-a"></div>`;
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;

      const qlow = qtext.toLowerCase();
      const found = QA.find(x => (x.q || '').toLowerCase() === qlow)
                 || QA.find(x => (x.keywords || []).join(' ').toLowerCase().includes(qlow))
                 || null;

      const answerEl = wrap.querySelector(".osx-a");
      const text = found ? String(found.a) : "I don’t have a preset answer for that yet.";
      typewriter(answerEl, text, TYPE_SPEED_MS);
    }

    function typeAssistant(text) {
      const wrap = document.createElement("div");
      wrap.className = "osx-exchange";
      wrap.innerHTML = `<div class="osx-a"></div>`;
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
      typewriter(wrap.querySelector(".osx-a"), text, TYPE_SPEED_MS);
    }
  }

  // -------- Helpers --------
  function typewriter(el, text, speed) {
    el.textContent = "";
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text.charAt(i++);
      if (i >= text.length) clearInterval(timer);
      const scroller = el.closest('.osx-log');
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }, speed);
  }

  function pickPopular(QA, ids, max) {
    const map = new Map(QA.map(x => [x.id, x]));
    const out = [];
    ids.forEach(id => { if (map.has(id) && out.length < max) out.push(map.get(id)); });
    for (let i = 0; i < QA.length && out.length < max; i++) {
      if (!ids.includes(QA[i].id)) out.push(QA[i]);
    }
    return out.slice(0, max);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
  }
  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
