<script>
(function(){
  function resolve(url){
    // Absolute URL (http/https) → use as-is
    if (/^https?:\/\//i.test(url)) return url;
    // Root-relative (/path) → prepend origin (works when served over http)
    if (url.startsWith('/')) return window.location.origin + url;
    // Relative (e.g. ../../partials/footer.html) → let the browser resolve it
    return url;
  }

  document.querySelectorAll('[data-include]').forEach(function(el){
    var src = el.getAttribute('data-include');
    var url = resolve(src);
    fetch(url)
      .then(function(r){
        if(!r.ok) throw new Error('HTTP '+r.status);
        return r.text();
      })
      .then(function(html){ el.outerHTML = html; })
      .catch(function(err){
        console.error('Include failed:', src, err);
      });
  });
})();
</script>
