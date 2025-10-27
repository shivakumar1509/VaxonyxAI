<!-- /assets/include.js -->
<script>
(function(){
  // If your site is hosted under a subpath (e.g., /vaxonyx/), set SITE_BASE to that path.
  var SITE_BASE = document.currentScript.getAttribute('data-site-base') || '';
  document.querySelectorAll('[data-include]').forEach(function(el){
    var url = SITE_BASE + el.getAttribute('data-include');
    fetch(url).then(function(r){ return r.text(); })
      .then(function(html){ el.outerHTML = html; })
      .catch(function(e){ console.error('Include failed:', url, e); });
  });
})();
</script>
