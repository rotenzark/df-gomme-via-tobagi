/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'df-gomme-via-tobagi',
    /* niente WhatsApp: c'è solo il fisso (Google, l'insegna, i portali) */
    whatsapp: {
      number: '',
      message: '',
      ids: [],
    },
    /* Google (29/9/2026): lunedì–giovedì 8:15–12:15 e 14–18, venerdì 8:15–12:30 e 14–18, sabato 8:15–12:15, domenica chiuso */
    hours: {
      0: [],
      1: [['08:15', '12:15'], ['14:00', '18:00']],
      2: [['08:15', '12:15'], ['14:00', '18:00']],
      3: [['08:15', '12:15'], ['14:00', '18:00']],
      4: [['08:15', '12:15'], ['14:00', '18:00']],
      5: [['08:15', '12:30'], ['14:00', '18:00']],
      6: [['08:15', '12:15']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "D.F. Gomme: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.lavori": "What they do",
      "n.officina": "The workshop",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Tyre shop · Via Walter Tobagi 13 · Barona · since 1994",
      "h.titolo": "<span class=\"insegna__riga\">Fast.</span> <span class=\"insegna__riga\">Effective.</span> <span class=\"insegna__riga\">Honest.</span>",
      "h.chi": "Bruce Fan, in a review on Google (our translation)",
      "h.ditta": "of Fabio Di Berardino",
      "h.testo": "Fitting and balancing, wheel alignment, punctures repaired even without an appointment, for cars and motorbikes. Their sign also says sports suspension, brakes and exhausts. And tyres bought online can be delivered here.",
      "h.voto": "72 reviews on Google",
      "g.invito": "Turn the tyre, or pick a code.",
      "g.rileggi": "Read it again",
      "g.esempio": "The size is an example: yours is written on your own tyre.",
      "g.titolo": "The sidewall of a tyre: 205/55 R16 91V",
      "g.desc": "A tyre seen from the side, on an alloy wheel. The sidewall reads 205/55 R16 91V and, further down, the date: DOT 2124. An arrow at the top points at the code being read.",
      "g.lista": "The codes on the sidewall, one by one",
      "g.l205": "the width, in millimetres",
      "g.l55": "the profile: the sidewall is 55% as tall as the tyre is wide",
      "g.lR": "radial: how it is built inside",
      "g.l16": "the rim, in inches",
      "g.l91": "the load index: 615 kg per tyre",
      "g.lV": "the speed rating: up to 240 km/h",
      "g.l2124": "the date: week 21 of 2024",
      "l.etichetta": "What they do",
      "l.titolo": "Tyres, and everything that turns around them",
      "l.1": "Tyre service",
      "l.1t": "Fitting and balancing, wheel alignment, puncture repairs, tyre changes, all four too. For cars and motorbikes, up to a 21-inch rim: for motorbikes, better call first.",
      "l.2": "Sports suspension · Brakes · Exhausts",
      "l.2t": "That’s what the other sign says, above the left-hand door: suspension, brake pads, exhausts. To find out whether it’s the job you need, just call.",
      "l.3": "Tyres bought online",
      "l.3t": "D.F. Gomme is a fitting centre on the websites that sell tyres: have them delivered straight here, and they are fitted here. Nothing to carry from home.",
      "o2.etichetta": "The workshop",
      "o2.titolo": "A shutter open onto the street",
      "a.fuori": "The D.F. Gomme workshop at Via Walter Tobagi 13 with its shutters up: above the left-hand door the yellow sign ASSETTI SPORTIVI, FRENI, MARMITTE, D.F. GOMME; above the right-hand one ASSISTENZA PNEUMATICI; a roofless racing car in front.",
      "c.fuori": "Via Walter Tobagi 13: the two yellow signs, the two doors.",
      "o2.t1": "D.F. Gomme is Fabio Di Berardino’s firm, registered in 1994: a single workshop in Barona, with racks full of tyres and the shutter open onto the street.",
      "o2.t2": "The same words keep coming back in the reviews: fast, kind, honest. People who stop by with a flat tyre say they were back on the road within minutes, even without an appointment; and some have been bringing the family cars here for twenty years.",
      "a.dentro": "Inside the workshop: red racks full of tyres, the red tyre changer, motorbike stands hanging on the wall.",
      "c.dentro": "Inside: the racks and the tyre changer.",
      "d.etichetta": "Reviews",
      "d.titolo": "The word that keeps coming back: honest",
      "d.voto": "on Google, 72 reviews",
      "d.a3": "Google, 3 years ago",
      "d.m8": "Google, 8 months ago",
      "d.a6": "Google, 6 years ago",
      "d.m11": "Google, 11 months ago",
      "d.a10": "Google, 10 years ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […]. The line at the top comes from another review.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "At Via Tobagi 13, in Barona",
      "o.testa": "Opening hours",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.nota": "Closed at lunchtime, until 2 pm.",
      "o.mappa": "Map: D.F. Gomme, Via Walter Tobagi 13, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Walter Tobagi 13, 20143 Milan",
      "o.bus": "By bus",
      "o.busv": "The “Via Tobagi – Via Olgiati” stop is 40 metres away",
      "o.tel": "Phone",
      "q.etichetta": "Questions",
      "q.titolo": "Before you stop by",
      "q.1": "Do I need an appointment for a puncture?",
      "q.1r": "Many reviews tell of a puncture repaired without an appointment. To find out whether there’s a wait, just call +39 02 8912 1798.",
      "q.2": "Can I have tyres bought online delivered here?",
      "q.2r": "Yes: D.F. Gomme is a fitting centre on the websites that sell tyres. When you buy, choose the workshop at Via Walter Tobagi 13 as the delivery address.",
      "q.3": "Do you work on motorbikes too?",
      "q.3r": "Yes, up to a 21-inch rim. For motorbikes, it’s best to call first.",
      "q.4": "What are the opening hours?",
      "q.4r": "Monday to Thursday 8:15 am–12:15 pm and 2–6 pm, Friday 8:15 am–12:30 pm and 2–6 pm, Saturday 8:15 am–12:15 pm. Closed on Sundays.",
      "q.5": "How do I read a tyre size?",
      "q.5r": "As on the tyre above: in 205/55 R16 91V, 205 is the width in millimetres, 55 the sidewall height as a percentage of the width, R the radial construction, 16 the rim diameter in inches, 91 and V the load and speed ratings. The four digits after DOT are the week and year the tyre was made.",
      "f.orario": "Monday–Thursday 8:15 am–12:15 pm and 2–6 pm · Friday 8:15 am–12:30 pm and 2–6 pm · Saturday 8:15 am–12:15 pm",
      "f.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are theirs, from their Google listing, with brand names covered; hours and reviews from Google, the services from the reviews, their shop sign and the tyre websites (September 2026). We drew the tyre ourselves: the size is an example.",
      "f.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ D.F. GOMME — «Veloce. Efficace. Onesto.» ══════════
     La pagina ha la loro facciata: l'insegna gialla con le lettere rosse e blu, il muro di piastrelle, il nero delle gomme.
     la FIRMA — la gomma da leggere: una gomma di lato, e sul fianco la misura «205/55 R16 91V» e la data DOT «2124». In alto la freccia
     gialla: la sigla che le si ferma sotto si accende, e la legenda accende la sua riga. L'intro: la gomma arriva girando, si ferma su
     «205», poi legge una sigla alla volta (205 → 55 → R → 16 → 91 → V → la data) e torna dritta, nessuna sigla accesa. Poi la gomma si
     gira col mouse o col dito, intorno al centro (col dito: di traverso; in verticale la pagina scorre); lasciata, si ferma sulla sigla
     più vicina alla freccia con una molla breve. Le righe della legenda (e le sigle sulla gomma) la girano fino a sé per la via più
     corta; «Rileggi» rifà la lettura. Stato finale = l'SVG (gomma dritta, nessuna sigla accesa). Senza JS: lo stato finale, freccia,
     invito e bottone nascosti col loro posto, la legenda è una lista che si legge. Con reduced-motion: lo stato finale subito; la gomma
     si gira ma si ferma senza molla; le righe la spostano subito. L'attesa è la classe firma-attesa dell'head (la gomma nella posizione
     d'ingresso, via CSS), tolta dall'head dopo 2,5 s se il codice non arriva. Un rAF a tempo: la firma non dipende da GSAP. I dati
     vengono da _dfg_firma.mjs. */
  var DATI = {"centro":[220,246],"raggio":200,"phi0":563.88,"finale":0,"sigle":{"16":{"theta":12.15,"w":9.3},"55":{"theta":-6.38,"w":9.57},"91":{"theta":24.57,"w":9.13},"205":{"theta":-23.88,"w":14.62},"2124":{"theta":134,"w":17.71},"R":{"theta":4.3,"w":5.4},"V":{"theta":32.19,"w":5.1}},"ordine":["205","55","R","16","91","V","2124"],"tempi":{"inizio":300,"giro":1400,"pausa":460,"passo":330,"passoLungo":620,"pausaLunga":560,"ritorno":760,"molla":380,"vaiBase":300,"vaiPerGrado":2.2,"vaiMax":900,"fine":8050},"intro":[{"da":300,"a":1700,"phiDa":563.88,"phiA":23.88,"curva":"giro","sigla":"205"},{"da":2160,"a":2490,"phiDa":23.88,"phiA":6.38,"curva":"passo","sigla":"55"},{"da":2950,"a":3280,"phiDa":6.38,"phiA":-4.3,"curva":"passo","sigla":"R"},{"da":3740,"a":4070,"phiDa":-4.3,"phiA":-12.15,"curva":"passo","sigla":"16"},{"da":4530,"a":4860,"phiDa":-12.15,"phiA":-24.57,"curva":"passo","sigla":"91"},{"da":5320,"a":5650,"phiDa":-24.57,"phiA":-32.19,"curva":"passo","sigla":"V"},{"da":6110,"a":6730,"phiDa":-32.19,"phiA":-134,"curva":"passo","sigla":"2124"},{"da":7290,"a":8050,"phiDa":-134,"phiA":0,"curva":"passo","sigla":null}],"deco":[{"k":"DOT","theta":111,"w":12.34},{"k":"RADIAL","theta":72,"w":22.24},{"k":"TUBELESS","theta":-118,"w":29.94}],"segno":{"theta":-13.87,"w":4.41}};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraG = prendi('gomma'), svgG = prendi('gommaSvg'), ruota = prendi('gommaRuota');
  var rileggiB = prendi('gommaRileggi'), leggiG = prendi('gommaLeggi');
  var TG = DATI.tempi, SIGLE = DATI.sigle, ORDINE = DATI.ordine, CX = DATI.centro[0], CY = DATI.centro[1];
  var VOCI = [].slice.call(document.querySelectorAll('#gommaLegenda .voce'));
  var TESTI = {};
  [].slice.call(document.querySelectorAll('#gommaRuota .sigla[data-sigla]')).forEach(function (t) { TESTI[t.getAttribute('data-sigla')] = t; });
  var faseG = 'fatta', modoG = '', rafG = 0, guardiaG = 0, larghezzaAvvioG = 0, corseG = 0, presaG = null, pianoG = null, giroFatto = false;
  var phiG = DATI.finale, lettaG = null;
  var finaleG = { phi: DATI.finale, sigla: null }, destinazioneG = finaleG;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    giro: function (u) { return 1 - Math.pow(1 - u, 3); },
    passo: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    molla: function (u) { var k = 1.2, v = u - 1; return v * v * ((k + 1) * v + k) + 1; }
  };
  function norm180(a) { return ((a + 180) % 360 + 360) % 360 - 180; }
  /* il disegno: la rotazione della gomma (attributo transform, come nell'HTML) e la sigla accesa */
  function metti(phi) { phiG = phi; if (ruota) ruota.setAttribute('transform', 'rotate(' + r3(phi) + ' ' + CX + ' ' + CY + ')'); }
  function accendi(k) {
    lettaG = k || null;
    Object.keys(TESTI).forEach(function (s) { TESTI[s].classList.toggle('is-letta', s === lettaG); });
    VOCI.forEach(function (li) {
      var on = li.getAttribute('data-sigla') === lettaG;
      li.classList.toggle('is-letta', on);
      var c = li.querySelector('.voce__corpo');
      if (c && c.getAttribute('role') === 'button') c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  /* l'annuncio per il lettore di schermo: la sigla e la sua riga, nella lingua della pagina (dal DOM della legenda) */
  function annuncia(k) {
    if (!leggiG) return;
    var li = null;
    VOCI.forEach(function (v) { if (v.getAttribute('data-sigla') === k) li = v; });
    var t = li ? li.querySelector('.voce__testo') : null;
    leggiG.textContent = k && t ? k + ': ' + t.textContent + '.' : '';
  }
  /* la sigla sotto la freccia (mentre si gira) e quella più vicina (dove si ferma la gomma lasciata) */
  function sottoFreccia(phi) {
    for (var i = 0; i < ORDINE.length; i++) { var g = SIGLE[ORDINE[i]]; if (Math.abs(norm180(phi + g.theta)) <= g.w / 2 + 0.6) return ORDINE[i]; }
    return null;
  }
  function versoSigla(phi, k) { return phi - norm180(phi + SIGLE[k].theta); }
  function piuVicina(phi) {
    var best = ORDINE[0], bd = 1e9;
    ORDINE.forEach(function (k) { var d = Math.abs(norm180(phi + SIGLE[k].theta)); if (d < bd) { bd = d; best = k; } });
    return { sigla: best, phi: versoSigla(phi, best) };
  }
  function durataVai(delta) { return Math.min(TG.vaiMax, TG.vaiBase + TG.vaiPerGrado * Math.abs(delta)); }
  /* la lettura da capo, da dove si è: a «205» per la via più corta, poi le sigle una alla volta coi tempi dell'intro (gli stessi passi
     di _dfg_firma.mjs), e alla fine la data torna al suo posto: la gomma è di nuovo dritta */
  function pianoRileggi(phi) {
    var P = [], t = 0, p = phi, q = versoSigla(p, ORDINE[0]), d = durataVai(q - p);
    P.push({ da: t, a: t + d, phiDa: p, phiA: q, curva: 'passo', sigla: ORDINE[0] });
    t += d + TG.pausa; p = q;
    for (var i = 1; i < ORDINE.length; i++) {
      var k = ORDINE[i], lungo = k === '2124', dd = lungo ? TG.passoLungo : TG.passo;
      q = p - (SIGLE[k].theta - SIGLE[ORDINE[i - 1]].theta);
      P.push({ da: t, a: t + dd, phiDa: p, phiA: q, curva: 'passo', sigla: k });
      t += dd + (lungo ? TG.pausaLunga : TG.pausa); p = q;
    }
    q = p + SIGLE[ORDINE[ORDINE.length - 1]].theta;
    P.push({ da: t, a: t + TG.ritorno, phiDa: p, phiA: q, curva: 'passo', sigla: null });
    return { piano: P, fine: t + TG.ritorno, dest: { phi: q, sigla: null } };
  }
  function fotogrammaPiano(t) {
    var P = pianoG.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    if (t < cur.a) {
      metti(cur.phiDa + (cur.phiA - cur.phiDa) * CURVE[cur.curva](c01((t - cur.da) / (cur.a - cur.da))));
      /* mentre gira, la sigla di prima si spegne */
      if (lettaG) accendi(null);
      return;
    }
    metti(cur.phiA);
    if (cur.sigla && lettaG !== cur.sigla) accendi(cur.sigla);
  }
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) la gomma va dove stava andando; si riarma a
     ogni fotogramma (#229) */
  function sorvegliaG() { clearTimeout(guardiaG); guardiaG = setTimeout(chiudiG, 1500); }
  function chiudiG() {
    cancelAnimationFrame(rafG); rafG = 0;
    clearTimeout(guardiaG);
    var d = destinazioneG || finaleG;
    metti(norm180(d.phi)); accendi(d.sigla);
    if (figuraG) figuraG.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseG = 'fatta';
  }
  /* un gesto (la presa, una riga, «Rileggi») durante un'animazione o nell'attesa: la gomma si ferma DOV'È (niente salto allo stato
     finale, che su una gomma vuol dire mezzo giro in un fotogramma); dall'attesa la posa è quella d'ingresso, già a schermo via CSS */
  function fermaG() {
    cancelAnimationFrame(rafG); rafG = 0;
    clearTimeout(guardiaG);
    if (root.classList.contains('firma-attesa')) { metti(DATI.phi0); root.classList.remove('firma-attesa'); }
    if (figuraG) figuraG.setAttribute('data-firma', 'fatta');
    faseG = 'fatta';
  }
  function avviaG(modo, piano) {
    cancelAnimationFrame(rafG); rafG = 0;
    modoG = modo; pianoG = piano;
    root.classList.remove('firma-attesa');
    faseG = 'corre'; if (figuraG) figuraG.setAttribute('data-firma', 'corre');
    larghezzaAvvioG = window.innerWidth;
    var t0 = null, corsa = ++corseG;
    function fotogramma(ts) {
      rafG = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseG !== 'corre' || corsa !== corseG) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaPiano(t);
      if (t >= pianoG.fine) { chiudiG(); return; }
      sorvegliaG();
      rafG = requestAnimationFrame(fotogramma);
    }
    sorvegliaG();
    rafG = requestAnimationFrame(fotogramma);
  }
  function avviaIntro() {
    /* dalla classe d'attesa all'attributo senza cambiare un pixel: la gomma nella posizione d'ingresso, nessuna sigla accesa */
    metti(DATI.phi0); accendi(null);
    destinazioneG = finaleG;
    avviaG('intro', { piano: DATI.intro, fine: TG.fine });
  }
  /* girare: l'angolo del puntatore intorno al centro della gomma; la gomma si prende solo dopo 4 px di movimento (un tocco non la
     prende, e col dito la pagina che scorre annulla il gesto senza toccare niente) */
  function puntoSvg(e) {
    var m = svgG.getScreenCTM();
    if (!m) return null;
    var p = svgG.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    var q = p.matrixTransform(m.inverse());
    return [q.x, q.y];
  }
  function angolo(q) { return Math.atan2(q[1] - CY, q[0] - CX) * 180 / Math.PI; }
  function prendiGomma(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (presaG) return;
    var q = puntoSvg(e);
    if (!q || Math.hypot(q[0] - CX, q[1] - CY) > DATI.raggio + 4) return;
    presaG = { id: e.pointerId, x: e.clientX, y: e.clientY, a: angolo(q), attiva: false };
    /* col mouse, niente selezione delle scritte trascinando */
    if (e.pointerType === 'mouse') e.preventDefault();
  }
  function giraGomma(e) {
    if (!presaG || e.pointerId !== presaG.id) return;
    var q = puntoSvg(e);
    if (!q) return;
    if (!presaG.attiva) {
      var dx = e.clientX - presaG.x, dy = e.clientY - presaG.y;
      if (Math.hypot(dx, dy) < 4) return;
      /* col dito la gomma si prende solo di traverso: in verticale è la pagina che scorre (touch-action pan-y), e il browser
         annullerà il gesto; così scorrendo sopra la gomma l'intro non si ferma */
      if (e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) return;
      /* presa: un'animazione in corso (o l'attesa) si ferma dov'è */
      if (faseG === 'corre' || root.classList.contains('firma-attesa')) fermaG();
      presaG.attiva = true;
      try { ruota.setPointerCapture(e.pointerId); } catch (err) {}
      ruota.classList.add('preso');
    }
    e.preventDefault();
    /* vicino al centro l'angolo non vuol dire niente */
    if (Math.hypot(q[0] - CX, q[1] - CY) < 16) return;
    var a = angolo(q), d = norm180(a - presaG.a);
    presaG.a = a;
    metti(phiG + d);
    var k = sottoFreccia(phiG);
    if (k !== lettaG) accendi(k);
  }
  function lasciaGomma(e) {
    if (!presaG || (e && e.pointerId !== presaG.id)) return;
    var attiva = presaG.attiva;
    presaG = null;
    ruota.classList.remove('preso');
    if (!attiva) return;
    giroFatto = true; setTimeout(function () { giroFatto = false; }, 0);
    var v = piuVicina(phiG);
    annuncia(v.sigla);
    destinazioneG = { phi: v.phi, sigla: v.sigla };
    if (reducedMotion) { chiudiG(); return; }
    avviaG('molla', { piano: [{ da: 0, a: TG.molla, phiDa: phiG, phiA: v.phi, curva: 'molla', sigla: v.sigla }], fine: TG.molla });
  }
  /* una riga della legenda (o una sigla sulla gomma): la gomma gira fino a lei per la via più corta */
  function scegli(k) {
    if (presaG && presaG.attiva) return;
    if (faseG === 'corre' || root.classList.contains('firma-attesa')) fermaG();
    annuncia(k);
    var q = versoSigla(phiG, k);
    destinazioneG = { phi: q, sigla: k };
    if (reducedMotion) { chiudiG(); return; }
    var d = durataVai(q - phiG);
    avviaG('vai', { piano: [{ da: 0, a: d, phiDa: phiG, phiA: q, curva: 'passo', sigla: k }], fine: d });
  }
  function rileggi() {
    if (presaG && presaG.attiva) return;
    if (faseG === 'corre' || root.classList.contains('firma-attesa')) fermaG();
    var pr = pianoRileggi(phiG);
    destinazioneG = pr.dest;
    if (reducedMotion) { chiudiG(); return; }
    avviaG('rileggi', pr);
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sul cartello dell'orario */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la gomma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaG() { var r = svgG.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraG && svgG && ruota && rileggiB && VOCI.length === ORDINE.length && ORDINE.every(function (k) { return TESTI[k]; })) {
    try { clearTimeout(window.__attesaGomma); } catch (e) {}
    window.__gomma = {
      stato: function () {
        return { fase: faseG, modo: modoG, corse: corseG, phi: phiG, letta: lettaG, presa: !!(presaG && presaG.attiva) };
      },
      tempi: TG,
    };
    /* la legenda: da lista a comandi, senza cambiare di un pixel l'impaginazione */
    VOCI.forEach(function (li) {
      var c = li.querySelector('.voce__corpo'), k = li.getAttribute('data-sigla');
      if (!c) return;
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.setAttribute('aria-pressed', 'false');
      c.addEventListener('click', function () { scegli(k); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scegli(k); } });
    });
    ORDINE.forEach(function (k) {
      TESTI[k].style.cursor = 'pointer';
      TESTI[k].addEventListener('click', function () { if (!giroFatto) scegli(k); });
    });
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaG();
    /* perché la firma è partita o no (lo legge il check) */
    window.__gomma.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgG.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFare || ancora) chiudiG();
    else if (inVista) avviaIntro();
    else if ('IntersectionObserver' in window) {
      /* la gomma sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora resta nella posizione d'ingresso */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioG = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioG.disconnect();
        if (faseG === 'fatta' && root.classList.contains('firma-attesa')) avviaIntro();
      }, { threshold: soglie });
      ioG.observe(svgG);
      window.__gomma.avvio.aspetta = true;
    } else chiudiG();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseG !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioG) <= 1) return;
      chiudiG();
    });
    rileggiB.addEventListener('click', rileggi);
    ruota.addEventListener('pointerdown', prendiGomma);
    svgG.addEventListener('pointermove', giraGomma);
    svgG.addEventListener('pointerup', lasciaGomma);
    svgG.addEventListener('pointercancel', lasciaGomma);
  }
})();
