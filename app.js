// IntelliTax on its own web address: shows the app full-window and passes the link's details (?…) through to it.
(function () {
  var cfg = window.INTELLITAX || {}, app = String(cfg.app || '');
  var frame = document.getElementById('app'), loader = document.getElementById('loader');
  // Friendly paths → app pages. Anything after ? is passed through unchanged (sign-in links, password resets, payments).
  var ROUTES = {
    '/itp': { product: 'ITP' }, '/planner': { product: 'ITP' }, '/plan': { product: 'ITP' },
    '/demo': { demo: 'taxpayer' }, '/demo/preparer': { demo: 'preparer' },
    '/card': { view: 'launcher' }
  };
  function target(loc) {
    var path = String(loc.pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
    var q = new URLSearchParams(loc.search || ''), extra = ROUTES[path] || {};
    Object.keys(extra).forEach(function (k) { if (!q.has(k)) q.set(k, extra[k]); });
    if (q.get('view') !== 'launcher') q.set('shell', '1');
    var s = q.toString();
    return app + (s ? '?' + s : '');
  }
  window.ITX_TARGET = target;   // used by the site's self-test
  if (!frame) return;
  // Never run inside another site's frame (clickjacking): GitHub Pages cannot send X-Frame-Options, so the page checks itself.
  var framed = true; try { framed = window.top !== window.self; } catch (e) { framed = true; }
  if (framed) { document.getElementById('loadMsg').innerHTML = ''; var a = document.createElement('a'); a.href = location.href; a.target = '_top'; a.rel = 'noopener'; a.textContent = 'Open IntelliTax in its own window'; document.getElementById('loadMsg').appendChild(a); document.querySelector('.bar').hidden = true; return; }
  var isItp = /^\/(itp|planner|plan)\/?$/i.test(location.pathname) || /^(itp|cta)$/i.test(new URLSearchParams(location.search).get('product') || '');
  if (isItp) { document.title = 'IntelliITP™ — Income Tax Planner'; document.getElementById('brandName').textContent = 'IntelliITP™'; document.getElementById('loadMsg').textContent = 'Opening your tax plan…'; frame.title = 'IntelliITP'; }
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(app)) {
    document.getElementById('loadMsg').textContent = 'This site is not connected to the app yet. Run github/publish.sh (see github/README.md).';
    document.querySelector('.bar').hidden = true; return;
  }
  var shown = false;
  function done() { if (shown) return; shown = true; loader.className = 'done'; setTimeout(function () { loader.hidden = true; }, 400); }
  frame.addEventListener('load', function () { setTimeout(done, 250); });   // the app draws its own first screen right after
  setTimeout(function () { if (!shown) document.getElementById('slow').hidden = false; }, 15000);
  document.getElementById('retry').addEventListener('click', function (e) { e.preventDefault(); location.reload(); });
  frame.src = target(location);
})();
