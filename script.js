/* =========================================================
   PROTOCOLO CSS · Módulo 02 — comportamiento de la página
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- resaltado de código ---------- */
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function hlCss(src) {
    var out = '', buf = '', i = 0, n = src.length;
    function decl(b) {
      var m = b.match(/^(\s*)([\w-]+)(\s*:\s*)([\s\S]*?)(\s*)$/);
      if (!m) return esc(b);
      return esc(m[1]) + '<span class="k">' + esc(m[2]) + '</span>' + esc(m[3]) + '<span class="v">' + esc(m[4]) + '</span>' + esc(m[5]);
    }
    while (i < n) {
      var c = src.charAt(i);
      if (c === '/' && src.charAt(i + 1) === '*') {
        var e = src.indexOf('*/', i + 2);
        if (e < 0) e = n - 2;
        out += esc(buf) + '<span class="c">' + esc(src.slice(i, e + 2)) + '</span>';
        buf = ''; i = e + 2; continue;
      }
      if (c === '{') { out += '<span class="s">' + esc(buf) + '</span>{'; buf = ''; }
      else if (c === '}') { out += (buf.trim() ? decl(buf) : esc(buf)) + '}'; buf = ''; }
      else if (c === ';') { out += decl(buf) + ';'; buf = ''; }
      else { buf += c; }
      i++;
    }
    return out + esc(buf);
  }

  function tagSpan(t) { return '<span class="t">' + esc(t) + '</span>'; }

  function hlHtml(src) {
    return src.split(/(<style[^>]*>[\s\S]*?<\/style>)/).map(function (p) {
      var m = p.match(/^(<style[^>]*>)([\s\S]*?)(<\/style>)$/);
      if (m) return tagSpan(m[1]) + hlCss(m[2]) + tagSpan(m[3]);
      return p.replace(/(<[^>]+>)|([^<]+)/g, function (_, t, x) { return t ? tagSpan(t) : esc(x); });
    }).join('');
  }

  function setCode(el, text, lang) {
    el.innerHTML = (lang || el.getAttribute('data-lang')) === 'html' ? hlHtml(text) : hlCss(text);
  }

  $$('pre.code').forEach(function (el) {
    if (el.textContent.trim()) setCode(el, el.textContent);
  });

  /* ---------- secuencia de arranque ---------- */
  var boot = $('#boot');
  var finished = false;

  function finishBoot() {
    if (finished) return;
    finished = true;
    boot.classList.add('done');
    document.body.classList.add('ready');
    setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 1200);
  }

  (function runBoot() {
    var lines = [
      '> INICIANDO PROTOCOLO CSS ...',
      '> CARGANDO SELECTORES ........ OK',
      '> CALIBRANDO ESPECIFICIDAD ... OK',
      '> SINCRONIZANDO CAPAS Z ...... OK',
      '> NÚCLEO DE ESTILOS EN LÍNEA',
      '> SISTEMA LISTO'
    ];
    if (reduce) { finishBoot(); return; }
    var log = $('#bootLog'), fill = $('#bootFill'), pctEl = $('#bootPct');
    var pct = 0, shown = 0;
    var timer = setInterval(function () {
      pct = Math.min(100, pct + 3 + Math.random() * 5);
      fill.style.width = pct + '%';
      pctEl.textContent = Math.floor(pct);
      var want = Math.floor(pct / 100 * lines.length);
      while (shown < want && shown < lines.length) { log.textContent += lines[shown++] + '\n'; }
      if (pct >= 100) {
        clearInterval(timer);
        while (shown < lines.length) { log.textContent += lines[shown++] + '\n'; }
        setTimeout(finishBoot, 380);
      }
    }, 60);
    setTimeout(finishBoot, 6000);
  })();

  /* ---------- partículas de la portada ---------- */
  (function particles() {
    var box = $('#particles');
    var colors = ['#ffc43d', '#ff4b3e', '#ffe9a6'];
    for (var i = 0; i < 46; i++) {
      var s = document.createElement('span');
      s.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      s.style.setProperty('--s', (2 + Math.random() * 4).toFixed(1) + 'px');
      s.style.setProperty('--t', (7 + Math.random() * 9).toFixed(1) + 's');
      s.style.setProperty('--d', (-Math.random() * 16).toFixed(1) + 's');
      s.style.setProperty('--dx', ((Math.random() - 0.5) * 160).toFixed(0) + 'px');
      s.style.setProperty('--c', colors[i % colors.length]);
      box.appendChild(s);
    }
  })();

  /* ---------- scroll: parallax, medidor y HUD ---------- */
  var hero = $('.hero');
  var heroText = $('.h-text');
  var depthEls = $$('.hero [data-depth]');
  var speedEls = $$('[data-speed]');
  var gauge = $('#gauge'), gaugeNum = $('#gaugeNum'), hs = $('#hs');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    var pct = max > 0 ? Math.round(y / max * 100) : 0;
    gauge.style.setProperty('--p', pct);
    gaugeNum.textContent = pct;
    hs.textContent = pct;

    var heroH = hero.offsetHeight;
    if (y < heroH + 100) {
      depthEls.forEach(function (el) {
        el.style.translate = '0 ' + (y * parseFloat(el.getAttribute('data-depth'))).toFixed(1) + 'px';
      });
      heroText.style.opacity = Math.max(0, 1 - y / (heroH * 0.6)).toFixed(3);
    }

    speedEls.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) return;
      var off = (vh / 2 - (r.top + r.height / 2)) * parseFloat(el.getAttribute('data-speed'));
      el.style.translate = '0 ' + off.toFixed(1) + 'px';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- aparición por secciones y riel ---------- */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(function (el, i) {
    el.style.setProperty('--d', String(i % 3));
    revealObs.observe(el);
  });

  var railLinks = $$('.rail a');
  var modObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        railLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-m') === e.target.id); });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('.mod').forEach(function (s) { modObs.observe(s); });

  /* ---------- retícula del cursor ---------- */
  var reticle = $('.reticle');
  var hx = $('#hx'), hy = $('#hy');
  var mx = -100, my = -100, rx = -100, ry = -100;
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      hx.textContent = ('0000' + mx).slice(-4);
      hy.textContent = ('0000' + my).slice(-4);
    });
    document.addEventListener('mouseover', function (e) {
      var hot = e.target.closest('a, button, label, input, .cline, .tk, .card, .tab');
      reticle.classList.toggle('lock', !!hot);
    });
    (function loop() {
      rx += (mx - rx) * 0.28; ry += (my - ry) * 0.28;
      reticle.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* =======================================================
     2.1 ESTRUCTURA Y SINTAXIS
     ======================================================= */
  var anatInfo = {
    sel: ['Selector', 'Elige <em>a qué elementos</em> afecta la regla. <code>.panel</code> apunta a todo lo que tenga class="panel".'],
    brace: ['Llaves', 'Abren y cierran el bloque. Todo lo que hay dentro pertenece a esta regla.'],
    prop: ['Propiedad', 'La característica que quieres cambiar: color, tamaño, margen, fuente…'],
    colon: ['Dos puntos', 'Separan la propiedad de su valor.'],
    val: ['Valor', 'Cómo debe quedar esa propiedad. Puede ser una palabra, un número con unidad o un color.'],
    semi: ['Punto y coma', 'Cierra la declaración. Si falta, la siguiente puede dejar de funcionar.'],
    comment: ['Comentario', 'El navegador lo ignora por completo. Sirve para dejar notas en el código.']
  };
  var anatBox = $('#anatInfo');
  var anatDefault = anatBox.innerHTML;
  var toks = $$('#anat .tk');
  toks.forEach(function (t) {
    function on() {
      var k = t.getAttribute('data-i');
      toks.forEach(function (o) { o.classList.toggle('hot', o.getAttribute('data-i') === k); });
      anatBox.innerHTML = '<strong>' + anatInfo[k][0] + '</strong><span>' + anatInfo[k][1] + '</span>';
    }
    function off() {
      toks.forEach(function (o) { o.classList.remove('hot'); });
      anatBox.innerHTML = anatDefault;
    }
    t.addEventListener('mouseenter', on);
    t.addEventListener('mouseleave', off);
  });

  var syn = { c: '#ffc43d', size: 24, rad: 6, ls: 2 };
  var synT = $('#synTarget');
  function updateSyn() {
    synT.style.color = syn.c;
    synT.style.fontSize = syn.size + 'px';
    synT.style.borderRadius = syn.rad + 'px';
    synT.style.letterSpacing = syn.ls + 'px';
    $('#oSize').textContent = syn.size + 'px';
    $('#oRad').textContent = syn.rad + 'px';
    $('#oLs').textContent = syn.ls + 'px';
    setCode($('#synCode'),
      '.nucleo {\n' +
      '  color: ' + syn.c + ';\n' +
      '  font-size: ' + syn.size + 'px;\n' +
      '  border-radius: ' + syn.rad + 'px;\n' +
      '  letter-spacing: ' + syn.ls + 'px;\n' +
      '}', 'css');
  }
  $$('#synColors .chip').forEach(function (ch) {
    ch.addEventListener('click', function () {
      $$('#synColors .chip').forEach(function (o) { o.classList.remove('on'); });
      ch.classList.add('on'); syn.c = ch.getAttribute('data-c'); updateSyn();
    });
  });
  $('#rSize').addEventListener('input', function (e) { syn.size = +e.target.value; updateSyn(); });
  $('#rRad').addEventListener('input', function (e) { syn.rad = +e.target.value; updateSyn(); });
  $('#rLs').addEventListener('input', function (e) { syn.ls = +e.target.value; updateSyn(); });
  updateSyn();

  /* =======================================================
     2.2 TIPOS DE INCORPORACIÓN
     ======================================================= */
  var srcText = { interno: '&lt;style&gt; interno', externo: 'styles.css externo', linea: 'atributo style=""' };
  $$('#incTabs .tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('#incTabs .tab').forEach(function (o) { o.classList.remove('on'); });
      tab.classList.add('on');
      $$('.pane').forEach(function (p) { p.classList.remove('on'); });
      $('#' + tab.getAttribute('data-pane')).classList.add('on');
      var s = tab.getAttribute('data-src');
      $('#incTarget').setAttribute('data-src', s);
      $('#incLabel').innerHTML = srcText[s];
    });
  });

  /* =======================================================
     2.3 HERENCIA Y COMENTARIOS
     ======================================================= */
  var inh = { c: '#ffc43d', size: 18, border: false };
  var inhP = $('#inhP');
  function updateInh() {
    inhP.style.setProperty('--c', inh.c);
    inhP.style.fontSize = inh.size + 'px';
    inhP.classList.toggle('border', inh.border);
    $('#oInh').textContent = inh.size + 'px';
    $('#inhList').innerHTML =
      '<li class="y">✓ color → el hijo y el nieto lo heredan</li>' +
      '<li class="y">✓ font-size → también se hereda</li>' +
      '<li class="n">✗ border → NO se hereda' + (inh.border ? ' (solo el padre lo tiene)' : '') + '</li>';
    setCode($('#inhCode'),
      '.padre {\n' +
      '  color: ' + inh.c + ';\n' +
      '  font-size: ' + inh.size + 'px;\n' +
      (inh.border ? '  border: 2px solid ' + inh.c + ';\n' : '') +
      '}\n' +
      '/* .hijo y .nieto no definen nada */', 'css');
  }
  $$('#inhColors .chip').forEach(function (ch) {
    ch.addEventListener('click', function () {
      $$('#inhColors .chip').forEach(function (o) { o.classList.remove('on'); });
      ch.classList.add('on'); inh.c = ch.getAttribute('data-c'); updateInh();
    });
  });
  $('#rInh').addEventListener('input', function (e) { inh.size = +e.target.value; updateInh(); });
  $('#inhBorder').addEventListener('change', function (e) { inh.border = e.target.checked; updateInh(); });
  updateInh();

  var nucleo = $('#nucleo');
  var clines = $$('#clines .cline');
  function updateNucleo() {
    var css = '';
    clines.forEach(function (l) { if (!l.classList.contains('off')) css += l.getAttribute('data-css') + ';'; });
    nucleo.style.cssText = css;
  }
  clines.forEach(function (l) {
    function toggle() { l.classList.toggle('off'); updateNucleo(); }
    l.addEventListener('click', toggle);
    l.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  updateNucleo();

  /* =======================================================
     2.4 ESPECIFICIDAD
     ======================================================= */
  function specificity(sel) {
    var b = 0, c = 0, d = 0;
    var s = sel.replace(/"[^"]*"|'[^']*'/g, '');
    s = s.replace(/:where\([^)]*\)/g, '');
    s = s.replace(/:(is|not|has|matches)\(/g, '(');
    s = s.replace(/\[[^\]]*\]/g, function () { c++; return ' '; });
    s = s.replace(/::[\w-]+/g, function () { d++; return ' '; });
    s = s.replace(/:(before|after|first-line|first-letter)\b/g, function () { d++; return ' '; });
    s = s.replace(/#[\w-]+/g, function () { b++; return ' '; });
    s = s.replace(/\.[\w-]+/g, function () { c++; return ' '; });
    s = s.replace(/:[\w-]+(\([^)]*\))?/g, function () { c++; return ' '; });
    s = s.replace(/(^|[\s>+~(,])([a-zA-Z][\w-]*)/g, function (m, p) { d++; return p + ' '; });
    return [0, b, c, d];
  }

  var wcells = $$('#wcells .wcell');
  var lastW = [-1, -1, -1, -1];
  function updateSpec() {
    var w = specificity($('#specIn').value);
    w.forEach(function (v, i) {
      if (v !== lastW[i]) {
        var cell = wcells[i];
        cell.querySelector('b').textContent = v;
        cell.classList.remove('pop');
        void cell.offsetWidth;
        cell.classList.add('pop');
      }
    });
    lastW = w;
    $('#specNote').innerHTML = 'Peso <code>' + w.join(' · ') + '</code>. La primera columna es siempre 0 en un selector: solo el atributo <code>style=""</code> suma ahí.';
  }
  $('#specIn').addEventListener('input', updateSpec);
  $$('#specPresets .chip').forEach(function (ch) {
    ch.addEventListener('click', function () { $('#specIn').value = ch.getAttribute('data-s'); updateSpec(); });
  });
  updateSpec();

  /* batalla de reglas */
  var rules = [
    { id: 'tag', label: 'p { color: … }', sel: 'arena-p', w: '0 · 0 · 0 · 1', color: '#58e6ff' },
    { id: 'cls', label: '.armor { color: … }', sel: '.b-armor', w: '0 · 0 · 1 · 0', color: '#ffc43d' },
    { id: 'tagcls', label: 'p.armor { color: … }', sel: 'arena-p.b-armor', w: '0 · 0 · 1 · 1', color: '#9dff7a' },
    { id: 'id', label: '#reactor { color: … }', sel: '#b-reactor', w: '0 · 1 · 0 · 0', color: '#ff6a3d' },
    { id: 'inline', label: '<p style="color: …">', inline: true, w: '1 · 0 · 0 · 0', color: '#ff4fd8' },
    { id: 'imp', label: '.armor { color: … !important }', sel: '.b-armor', imp: true, w: 'importante', color: '#ffffff' }
  ];
  var battleEl = $('#b-reactor');
  var battleStyle = document.createElement('style');
  document.head.appendChild(battleStyle);
  var ruleBox = $('#ruleList');

  function hexToRgb(h) {
    var n = parseInt(h.slice(1), 16);
    return 'rgb(' + (n >> 16) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ')';
  }

  rules.forEach(function (r) {
    var l = document.createElement('label');
    l.className = 'rule';
    l.style.setProperty('--c', r.color);
    l.innerHTML = '<input type="checkbox" data-id="' + r.id + '"><i></i><span>' + esc(r.label) + '</span><em>' + r.w + '</em>';
    ruleBox.appendChild(l);
  });

  function updateBattle() {
    var on = {};
    $$('#ruleList input').forEach(function (i) { on[i.getAttribute('data-id')] = i.checked; });
    var css = '';
    var inlineRule = null;
    rules.forEach(function (r) {
      if (!on[r.id]) return;
      if (r.inline) { inlineRule = r; return; }
      css += r.sel + ' { color: ' + r.color + (r.imp ? ' !important' : '') + '; }\n';
    });
    battleStyle.textContent = css;
    battleEl.style.color = inlineRule ? inlineRule.color : '';
    var v = $('#verdict');
    var active = rules.filter(function (r) { return on[r.id]; });
    if (!active.length) { v.textContent = 'Sin reglas activas: el texto usa el color heredado por defecto.'; return; }
    var got = getComputedStyle(battleEl).color;
    var win = null;
    active.forEach(function (r) { if (hexToRgb(r.color) === got) win = r; });
    v.innerHTML = win ? 'GANA → <b>' + esc(win.label) + '</b> <span style="color:' + win.color + '">■</span> (peso ' + win.w + ')' : '';
  }
  $$('#ruleList input').forEach(function (i) { i.addEventListener('change', updateBattle); });
  updateBattle();

  /* =======================================================
     2.5 FLEXBOX · GRID · BREAKPOINTS
     ======================================================= */
  var bpScreen = $('#bpScreen'), bpCards = $('#bpCards'), bpBadge = $('#bpBadge');
  var bpMode = 'flex';
  var bpMin = 320, bpMax = 1100;

  $$('#bpRuler i').forEach(function (m) {
    var v = +m.getAttribute('data-bp');
    m.style.left = ((v - bpMin) / (bpMax - bpMin) * 100).toFixed(2) + '%';
  });

  function updateBpCode() {
    var code = bpMode === 'flex' ?
      '.cards { display: flex; flex-wrap: wrap; gap: 10px; }\n' +
      '.card  { flex: 1 1 100%; }\n\n' +
      '@media (min-width: 520px) { .card { flex-basis: calc(50% - 5px); } }\n' +
      '@media (min-width: 800px) { .card { flex-basis: calc(33.3% - 7px); } }' :
      '.cards { display: grid; grid-template-columns: 1fr; gap: 10px; }\n\n' +
      '@media (min-width: 520px) { .cards { grid-template-columns: repeat(2, 1fr); } }\n' +
      '@media (min-width: 800px) { .cards { grid-template-columns: repeat(3, 1fr); } }';
    setCode($('#bpCode'), code, 'css');
  }
  function updateBpWidth() {
    var w = +$('#rBp').value;
    bpScreen.style.width = w + 'px';
    $('#oBp').textContent = w + 'px';
  }
  function updateBadge(w) {
    bpBadge.className = 'bp-badge' + (w < 520 ? ' m' : (w < 800 ? ' t' : ''));
    bpBadge.textContent = w < 520 ? 'móvil · 1 columna' : (w < 800 ? 'tablet · 2 columnas' : 'escritorio · 3 columnas');
  }
  if (window.ResizeObserver) {
    new ResizeObserver(function (entries) {
      updateBadge(entries[0].contentRect.width);
    }).observe(bpScreen);
  }
  $$('#bpMode .chip').forEach(function (ch) {
    ch.addEventListener('click', function () {
      $$('#bpMode .chip').forEach(function (o) { o.classList.remove('on'); });
      ch.classList.add('on');
      bpMode = ch.getAttribute('data-m');
      bpCards.classList.toggle('is-grid', bpMode === 'grid');
      updateBpCode();
    });
  });
  $('#rBp').addEventListener('input', updateBpWidth);
  updateBpWidth(); updateBpCode(); updateBadge(bpScreen.clientWidth);

  /* =======================================================
     2.6 MEDIA QUERIES
     ======================================================= */
  var queries = [
    '(max-width: 600px)',
    '(min-width: 601px) and (max-width: 1024px)',
    '(min-width: 1025px)',
    '(orientation: landscape)',
    '(prefers-color-scheme: dark)',
    '(prefers-reduced-motion: reduce)',
    '(hover: hover)'
  ];
  var radar = $('#radar');
  var mqs = queries.map(function (q) {
    var li = document.createElement('li');
    li.innerHTML = '<i></i><span>@media ' + esc(q) + '</span>';
    radar.appendChild(li);
    return { li: li, mql: window.matchMedia(q) };
  });
  function updateRadar() {
    $('#mqW').textContent = window.innerWidth;
    $('#mqH').textContent = window.innerHeight;
    mqs.forEach(function (m) { m.li.classList.toggle('on', m.mql.matches); });
  }
  window.addEventListener('resize', updateRadar);
  mqs.forEach(function (m) {
    if (m.mql.addEventListener) m.mql.addEventListener('change', updateRadar);
    else if (m.mql.addListener) m.mql.addListener(updateRadar);
  });
  updateRadar();

  /* =======================================================
     2.8 PSEUDO-CLASES: nth-child
     ======================================================= */
  var nthItems = $$('#nthList li');
  function updateNth(suffix) {
    nthItems.forEach(function (li) { li.classList.remove('hit'); });
    $$('#nthList li' + suffix).forEach(function (li) { li.classList.add('hit'); });
    setCode($('#nthCode'), '.lista li' + suffix + ' {\n  background: gold;\n}', 'css');
  }
  $$('#nthChips .chip').forEach(function (ch) {
    ch.addEventListener('click', function () {
      $$('#nthChips .chip').forEach(function (o) { o.classList.remove('on'); });
      ch.classList.add('on');
      updateNth(ch.getAttribute('data-s'));
    });
  });
  updateNth(':nth-child(odd)');

  /* =======================================================
     2.9 Z-INDEX
     ======================================================= */
  var zStage = $('#zStage'), zWrap = $('#zWrap');
  function updateZ() {
    var a = $('#rZa').value, c = $('#rZc').value, ctx = $('#zCtx').checked;
    zStage.style.setProperty('--za', a);
    zStage.style.setProperty('--zc', c);
    zWrap.classList.toggle('ctx', ctx);
    $('#oZa').textContent = a;
    $('#oZc').textContent = c;
    $('#zAl').textContent = 'z-index: ' + a;
    $('#zCl').textContent = 'z-index: ' + c;
    setCode($('#zCode'),
      '.a { position: absolute; z-index: ' + a + '; }\n' +
      '.c { position: absolute; z-index: ' + c + '; }\n' +
      '.contenedor-b {\n' +
      '  position: absolute;\n' +
      (ctx ? '  z-index: 1; /* crea un contexto */\n' : '  /* sin z-index: no crea contexto */\n') +
      '}\n' +
      '.b { position: absolute; z-index: 99; }', 'css');
    $('#zNote').innerHTML = ctx ?
      'El contenedor de B forma su propio contexto: su <code>99</code> solo cuenta <b>dentro</b> del contenedor. Para A y C, todo el bloque de B vale <code>1</code>.' :
      'El contenedor de B no crea contexto, así que el <code>99</code> compite directamente con A y C y B queda encima de todo.';
  }
  ['#rZa', '#rZc'].forEach(function (s) { $(s).addEventListener('input', updateZ); });
  $('#zCtx').addEventListener('change', updateZ);
  updateZ();
})();
