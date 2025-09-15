// /assets/osx_widget.js  — Vaxonyx-only widget, NO floating FAB
(function () {
  const PANEL_W = 420, PANEL_H = 520, LOG_MAX = 300, TYPE_MS = 15;
  const CSS = `
    .vx-panel { position: fixed; bottom: 70px; right: 16px;
      width:${PANEL_W}px; height:${PANEL_H}px; max-width:calc(100vw - 32px); max-height:calc(100vh - 120px);
      background:#fff; color:#0b1b3a; border:1px solid #e6ebf4; border-radius:16px; box-shadow:0 10px 28px rgba(0,0,0,.35);
      display:none; overflow:hidden; z-index: 9999; }
    .vx-panel.open { display:block; }
    .vx-head { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#1B427A; color:#fff; }
    .vx-close { background:transparent; border:0; color:#fff; font-size:20px; cursor:pointer; }
    .vx-hero { display:flex; align-items:center; gap:14px; padding:12px 14px; background:#f6f9ff; border-bottom:1px solid #e6ebf4; }
    .vx-illus { width:72px; height:72px; border-radius:999px; flex:0 0 72px; background:#fff center/80% no-repeat;
      background-image:url("assets/assistant-lady.svg"); border:1px solid #e6ebf4; box-shadow:0 4px 10px rgba(0,0,0,.08); }
    .vx-w1{ font-weight:800; font-size:1rem; color:#0b1b3a; } .vx-w2{ font-size:.9rem; color:#395084; }
    .vx-body{ display:grid; grid-template-rows:1fr auto; height:calc(100% - 120px); padding:10px 12px 12px; gap:10px; }
    .vx-log{ max-height:${LOG_MAX}px; overflow:auto; display:grid; gap:8px; padding-right:4px; }
    .vx-x{ display:grid; gap:4px; } .vx-q{ font-weight:700; font-size:.85rem } .vx-a{ background:#f8fbff; border:1px solid #e6ebf4; border-radius:8px; padding:8px; white-space:pre-wrap; font-size:.85rem }
    .vx-bottom{ border-top:1px solid #e6ebf4; background:#fbfdff; display:grid; gap:6px; padding:8px 12px; }
    .vx-pop{ font-size:.8rem; font-weight:800; color:#314579; } .vx-buttons{ display:flex; flex-wrap:wrap; gap:6px }
    .vx-sugg{ border:1px solid #d7e0f7; border-radius:999px; padding:6px 10px; background:#f6f9ff; cursor:pointer; font-size:.85rem }
    .vx-row{ display:flex; align-items:center; gap:6px } .vx-input{ flex:1; min-width:0; padding:8px 10px; border:1px solid #d7e0f7; border-radius:8px; font-size:.9rem }
    .vx-send{ border:0; border-radius:8px; padding:8px 10px; background:#1B427A; color:#fff; font-weight:800; cursor:pointer }
  `;

  const QA = window.VX_QA || [
    {id:'hello',  q:'What does Vaxonyx AI do?', a:'We build bioinformatics platforms for neoantigen discovery, vaccine design, and translational immunology.'},
    {id:'contact',q:'How do I contact you?', a:'info@vaxonyxai.com (general) • investorrelations@vaxonyxai.com (IR) • bd@vaxonyxai.com (BD).'}
  ];

  function ready(fn){ document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',fn) : fn(); }
  ready(() => {
    // inject CSS
    if (!document.getElementById('vx-widget-css')) {
      const s=document.createElement('style'); s.id='vx-widget-css'; s.textContent=CSS; document.head.appendChild(s);
    }

    // create panel once
    let panel=document.querySelector('.vx-panel');
    if (!panel) {
      panel=document.createElement('div');
      panel.className='vx-panel';
      panel.innerHTML=`
        <div class="vx-head"><strong>Vaxonyx AI</strong><button class="vx-close" aria-label="Close">×</button></div>
        <div class="vx-hero"><div class="vx-illus" aria-hidden="true"></div>
          <div><div class="vx-w1">Hi! How can I help you?</div><div class="vx-w2">Ask about our platform, pipelines, or partnerships.</div></div>
        </div>
        <div class="vx-body"><div class="vx-log"></div>
          <div class="vx-bottom">
            <div class="vx-pop">Popular questions</div><div class="vx-buttons"></div>
            <div class="vx-row"><input class="vx-input" placeholder="Type your question…" aria-label="Type your question">
              <button class="vx-send" type="button">Send</button></div>
          </div>
        </div>`;
      document.body.appendChild(panel);

      const closeBtn=panel.querySelector('.vx-close'), input=panel.querySelector('.vx-input'),
            send=panel.querySelector('.vx-send'), log=panel.querySelector('.vx-log'),
            suggs=panel.querySelector('.vx-buttons');

      suggs.innerHTML = QA.slice(0,3).map(x => `<button class="vx-sugg" type="button" data-q="${escAttr(x.q)}">${esc(x.q)}</button>`).join('');

      closeBtn.addEventListener('click', ()=> panel.classList.remove('open'));
      panel.addEventListener('click', e => { const b=e.target.closest('.vx-sugg'); if(!b) return; input.value=b.getAttribute('data-q'); answer(input.value); });
      input.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); answer(input.value.trim()); }});
      send.addEventListener('click', ()=> answer(input.value.trim()));

      function answer(q){
        if(!q) return;
        const wrap=document.createElement('div'); wrap.className='vx-x';
        wrap.innerHTML=`<div class="vx-q">${esc(q)}</div><div class="vx-a"></div>`; log.appendChild(wrap); log.scrollTop=log.scrollHeight;
        const found = QA.find(x => (x.q||'').toLowerCase()===q.toLowerCase()) || null;
        type(wrap.querySelector('.vx-a'), found ? String(found.a) : 'Thanks! A specialist will follow up soon.');
      }
    }
  });

  function type(el, text){ el.textContent=''; let i=0; const t=setInterval(()=>{ el.textContent+=text.charAt(i++); if(i>=text.length) clearInterval(t); const sc=el.closest('.vx-log'); if(sc) sc.scrollTop=sc.scrollHeight; }, TYPE_MS); }
  const esc = s => String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const escAttr = s => esc(s).replace(/'/g,'&#39;');

  // Public API used by the **orange** page button
  window.VX_WIDGET = {
    open(){ const p=document.querySelector('.vx-panel'); if(p) p.classList.add('open'); },
    close(){ const p=document.querySelector('.vx-panel'); if(p) p.classList.remove('open'); }
  };

  // Hard-remove any leftover OncoSyNex FAB/panel if present
  ready(() => {
    const old = document.getElementById('osx-widget'); if (old) old.remove();
    [...document.querySelectorAll('button')].forEach(b=>{
      const t=(b.textContent||'').trim().toLowerCase();
      if (t.includes('oncosynex')) b.remove();
    });
    if (window.OSX_WIDGET) try { delete window.OSX_WIDGET; } catch {}
  });
})();
