/* Portfolio · Juan Felipe Olivar Londoño */
(function () {
  'use strict';

  var reducido = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Año del pie */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* Aparición al hacer scroll */
  var objetivos = document.querySelectorAll('.head,.intro,.car-bar,.car-track,.car-comun,.tray,.proy,.tools>div,.contacto .wrap>*');
  if ('IntersectionObserver' in window && !reducido) {
    var rev = new IntersectionObserver(function (es, o) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('vis'); o.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    objetivos.forEach(function (el) {
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(i, 4) * 70 + 'ms';
      el.classList.add('rev');
      rev.observe(el);
    });
  }

  /* Botón flotante: volver arriba */
  var flot = document.getElementById('flot'), subir = document.getElementById('subir');
  function pinta() { flot.classList.toggle('on', window.scrollY > 400); }
  window.addEventListener('scroll', pinta, { passive: true });
  pinta();
  subir.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' }); });

  /* Vista de currículums: carrusel de dos fichas (turismo y territorio) */
  var dlg = document.getElementById('cv'), cvC = null;
  function abrirCV(k) {
    if (dlg.showModal) { if (!dlg.open) dlg.showModal(); }
    else dlg.setAttribute('open', '');
    /* El foco va a la propia ventana (sin marcar el botón «Cerrar»);
       con el teclado, Tab lleva a los controles de dentro */
    dlg.focus({ preventScroll: true });
    dlg.scrollTop = 0;
    if (cvC) cvC.salta(k === 'ter' ? 1 : 0);
  }
  document.querySelectorAll('[data-cv]').forEach(function (b) { b.addEventListener('click', function () { abrirCV(b.dataset.cv); }); });
  function cerrarCV() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  document.getElementById('cvx').addEventListener('click', cerrarCV);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) cerrarCV(); });
  /* Al volver a la página con Atrás/Adelante, la ventana empieza cerrada */
  window.addEventListener('pageshow', function (e) { if (e.persisted && dlg.open) cerrarCV(); });

  /* Carrusel con scroll-snap, compartido por «Dos mundos», «Formación y experiencia»
     y la ventana de currículums.
     op.tabs: botones con data-i · op.flechas: botones con data-d (-1 / 1)
     op.auto: milisegundos entre pasos automáticos; se para en cuanto el usuario lo toca
     op.cambio: se llama al cambiar de diapositiva
     El carrusel toma siempre la altura de la diapositiva visible. */
  function carrusel(track, op) {
    var tabs = op.tabs || [], flechas = op.flechas || [], slides = track.children, n = slides.length;
    var idx = 0, raf = 0, timer = 0, pausa = false, parado = !op.auto || reducido;
    function ir(i) {
      i = Math.max(0, Math.min(n - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: reducido ? 'auto' : 'smooth' });
    }
    function ajusta() { if (track.clientWidth) track.style.height = slides[idx].offsetHeight + 'px'; }
    function marca() {
      if (!track.clientWidth) return;   /* oculto: no hay nada que medir */
      var nuevo = Math.round(track.scrollLeft / (track.clientWidth || 1)), cambia = nuevo !== idx;
      idx = nuevo;
      ajusta();
      tabs.forEach(function (t, k) { t.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
      flechas.forEach(function (f) { var d = +f.dataset.d; f.disabled = (idx + d < 0 || idx + d > n - 1); });
      if (cambia && op.cambio) op.cambio(idx);
    }
    function aVista() { var r = track.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; }
    function para() { parado = true; clearInterval(timer); }
    if (!parado) {
      timer = setInterval(function () {
        if (!pausa && !document.hidden && aVista() && (!op.puedeAvanzar || op.puedeAvanzar())) ir((idx + 1) % n);
      }, op.auto);
      ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(function (ev) { track.addEventListener(ev, para, { passive: true }); });
      track.addEventListener('mouseenter', function () { pausa = true; });
      track.addEventListener('mouseleave', function () { pausa = false; });
    }
    track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(marca); }, { passive: true });
    tabs.forEach(function (t) { t.addEventListener('click', function () { para(); ir(+t.dataset.i); }); });
    flechas.forEach(function (f) { f.addEventListener('click', function () { para(); ir(idx + (+f.dataset.d)); }); });
    track.addEventListener('keydown', function (e) {
      if (e.target !== track) return;   /* no robar las flechas a los elementos de dentro */
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(idx - 1); }
    });
    window.addEventListener('resize', function () { track.scrollTo({ left: idx * track.clientWidth, behavior: 'auto' }); ajusta(); });
    /* Reajusta la altura cuando cambia el contenido (fuentes, desplegables…) */
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { ajusta(); });
      Array.prototype.forEach.call(slides, function (sl) { ro.observe(sl); });
    } else window.addEventListener('load', ajusta);
    marca();
    return {
      ir: function (i) { para(); ir(i); },
      salta: function (i) { track.scrollTo({ left: i * track.clientWidth, behavior: 'auto' }); marca(); },
      indice: function () { return idx; }, para: para
    };
  }

  var cvTrack = document.getElementById('cv-track');
  if (cvTrack) cvC = carrusel(cvTrack, { tabs: document.querySelectorAll('#cv .punto') });

  var areas = document.getElementById('car-track'), areasC = null;
  if (areas) areasC = carrusel(areas, { tabs: document.querySelectorAll('.car-tab'), flechas: document.querySelectorAll('.car-arrow') });

  /* Portada: cada círculo lleva a su área de «Lo que aporto».
     Sin JavaScript, el enlace #acerca sigue funcionando. */
  document.querySelectorAll('.hecho[data-slide]').forEach(function (h) {
    h.addEventListener('click', function (e) {
      if (!areasC) return;
      e.preventDefault();
      areasC.ir(+h.dataset.slide);
      document.getElementById('acerca').scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' });
    });
  });

  /* Formación y experiencia: carrusel de dos fichas desplegables.
     Avanza solo mientras ninguna está abierta; al abrir una se cierra la otra
     y la ficha abierta se centra en pantalla (o se alinea arriba si es más alta). */
  var trayTrack = document.getElementById('tray-track'), tarjetas = document.querySelectorAll('.tray .acc'), trayC = null;
  function hayAbierta() { return !!document.querySelector('.tray .acc[open]'); }
  function centra(el) {
    var r = el.getBoundingClientRect(), nav = document.querySelector('header.nav');
    var navH = nav && getComputedStyle(nav).position === 'sticky' ? nav.offsetHeight : 0;
    var top = r.top + window.scrollY - navH - Math.max(12, (window.innerHeight - navH - r.height) / 2);
    window.scrollTo({ top: Math.max(0, top), behavior: reducido ? 'auto' : 'smooth' });
  }
  if (trayTrack) {
    trayC = carrusel(trayTrack, {
      tabs: document.querySelectorAll('.tray .punto'), auto: 6000,
      puedeAvanzar: function () { return !hayAbierta(); },
      cambio: function () { resalta(); }
    });
    tarjetas.forEach(function (t) {
      t.addEventListener('toggle', function () {
        if (t.open) {
          trayC.para();
          tarjetas.forEach(function (o) { if (o !== t) o.open = false; }); /* por si el navegador no admite name="" */
          requestAnimationFrame(function () { centra(t); });
        }
        resalta();
      });
    });
  }

  /* Abre la ficha de formación (0) o de experiencia (1) y la centra.
     Si ya estaba abierta, solo la centra. */
  function abreFicha(ficha, inmediato) {
    if (!trayC) return;
    if (inmediato) trayC.salta(ficha); else trayC.ir(ficha);
    trayC.para();
    var t = tarjetas[ficha];
    if (t.open) centra(t); else t.open = true;   /* el evento «toggle» la centra */
  }
  var FICHAS = { '#formacion': 0, '#experiencia': 1 };
  function esFicha(h) { return Object.prototype.hasOwnProperty.call(FICHAS, h); }

  /* Menú: resalta la sección visible.
     «Formación» y «Experiencia» comparten sección: se resalta la ficha que se ve. */
  var enlaces = document.querySelectorAll('#mn a[href^="#"]');
  var seccionTray = document.getElementById('formacion');
  var zonas = Array.prototype.map.call(enlaces, function (a) {
    var h = a.getAttribute('href'), z = { a: a, el: document.querySelector(h), si: null };
    if (trayC && seccionTray && esFicha(h)) {
      var ficha = FICHAS[h];
      z.el = seccionTray;
      z.si = function () { return trayC.indice() === ficha; };
      /* Desde el menú: se guarda en el historial (Atrás funciona) y se abre la ficha */
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (location.hash !== h) history.pushState(null, '', h);
        abreFicha(ficha);
      });
    }
    return z;
  }).filter(function (z) { return z.el; });

  /* Enlaces directos (…/#experiencia) y navegación con Atrás/Adelante */
  function sigueHash(inmediato) { if (esFicha(location.hash)) abreFicha(FICHAS[location.hash], inmediato); }
  window.addEventListener('hashchange', function () { sigueHash(false); });
  if (esFicha(location.hash)) window.addEventListener('load', function () { sigueHash(true); });
  var rafMenu = 0;
  function resalta() {
    var linea = window.innerHeight * 0.4;
    var final = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    zonas.forEach(function (z, i) {
      var r = z.el.getBoundingClientRect();
      var on = final ? i === zonas.length - 1 : r.top <= linea && r.bottom > linea && (!z.si || z.si());
      z.a.classList.toggle('on', on);
      if (on) z.a.setAttribute('aria-current', 'location'); else z.a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () { cancelAnimationFrame(rafMenu); rafMenu = requestAnimationFrame(resalta); }, { passive: true });
  window.addEventListener('resize', resalta);
  resalta();

  /* Proyectos: filtrar por área.
     Al empezar está activo «Todos», con los grupos cerrados. Pulsar un área
     deja solo esa y la abre; volver a pulsarla, o pulsar «Todos», muestra
     todas otra vez, cerradas. Cada grupo se puede abrir y cerrar a mano. */
  var botones = document.querySelectorAll('.filtros button'), grupos = document.querySelectorAll('.grupo'), filtro = null;
  function filtra() {
    botones.forEach(function (x) {
      var on = x.dataset.f === 'todos' ? !filtro : x.dataset.f === filtro;
      x.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    grupos.forEach(function (g) {
      var ver = !filtro || g.dataset.g === filtro;
      g.hidden = !ver;
      g.open = !!filtro && ver; /* «Todos»: todo cerrado; un área: abierta */
    });
  }
  botones.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.f;
      filtro = f === 'todos' || f === filtro ? null : f;
      filtra();
    });
  });
})();
