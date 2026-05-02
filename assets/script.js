/* =================================================================
   EGELAND.DEV — GUI PORTFOLIO SCRIPTS
   ================================================================= */

/* === CANVAS PARTICLE NETWORK === */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const NODES    = 55;
  const MAX_DIST = 140;
  const RGB      = '0, 255, 179';
  let nodes      = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawn() {
    nodes = [];
    for (let i = 0; i < NODES; i++) {
      nodes.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        r:  Math.random() * 1.4 + 0.7,
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* connections */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < MAX_DIST) {
          ctx.globalAlpha = (1 - d / MAX_DIST) * 0.22;
          ctx.strokeStyle = `rgb(${RGB})`;
          ctx.lineWidth   = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    /* nodes */
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${RGB}, 0.42)`;
      ctx.fill();

      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    }

    requestAnimationFrame(tick);
  }

  resize();
  spawn();
  tick();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); spawn(); }, 150);
  });
})();


/* === TYPING ANIMATION === */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'network explorer',
    'script kiddie™',
    'CTF enthusiast',
    'Python automator',
    'ethical hacker',
  ];

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    el.textContent = deleting
      ? phrase.slice(0, --ci)
      : phrase.slice(0, ++ci);

    let delay = deleting ? 55 : 105;

    if (!deleting && ci === phrase.length) {
      delay    = 2400;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      pi       = (pi + 1) % phrases.length;
      delay    = 380;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 700);
})();


/* === MOCK TERMINAL ANIMATION (HERO) === */
(function initMockTerminal() {
  const body = document.getElementById('mt-body');
  if (!body) return;

  const PROMPT = '<span class="mt-p">visitor@egeland.dev</span>'
               + '<span class="mt-d">:~$ </span>';

  const sequence = [
    { t: 0,    h: PROMPT + '<span class="mt-cmd">nmap -sV -p 22,80,443 egeland.dev</span>' },
    { t: 520,  h: '<span class="mt-dim">Starting Nmap 7.94 ( https://nmap.org )</span>' },
    { t: 950,  h: '<span class="mt-dim">Scanning egeland.dev [3 ports]...</span>' },
    { t: 1300, h: '' },
    { t: 1420, h: '<span class="mt-dim">PORT    STATE  SERVICE  VERSION</span>' },
    { t: 1680, h: '<span class="mt-port">22/tcp </span> <span class="mt-open">open</span>  <span class="mt-svc"> ssh    </span> <span class="mt-ver">OpenSSH 8.9p1</span>' },
    { t: 1940, h: '<span class="mt-port">80/tcp </span> <span class="mt-open">open</span>  <span class="mt-svc"> http   </span> <span class="mt-ver">nginx 1.18.0</span>' },
    { t: 2180, h: '<span class="mt-port">443/tcp</span> <span class="mt-open">open</span>  <span class="mt-svc"> https  </span> <span class="mt-ver">nginx 1.18.0</span>' },
    { t: 2430, h: '' },
    { t: 2600, h: '<span class="mt-dim">Nmap done: 1 host up (0.82s latency)</span>' },
    { t: 3100, h: PROMPT + '<span class="mt-cursor">█</span>' },
  ];

  let timers = [];

  function run() {
    body.innerHTML = '';
    timers.forEach(clearTimeout);
    timers = [];

    sequence.forEach(({ t, h }) => {
      const id = setTimeout(() => {
        const line = document.createElement('div');
        line.className   = 'mt-line';
        line.innerHTML   = h;
        body.appendChild(line);
      }, t);
      timers.push(id);
    });

    /* restart loop */
    const loopId = setTimeout(run, 3100 + 3800);
    timers.push(loopId);
  }

  run();
})();


/* === SCROLL REVEAL === */
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  /* stagger siblings in the same parent */
  const parentMap = new Map();
  els.forEach(el => {
    const p = el.parentElement;
    if (!parentMap.has(p)) parentMap.set(p, []);
    parentMap.get(p).push(el);
  });
  parentMap.forEach(siblings => {
    siblings.forEach((el, i) => { el.dataset.stagger = String(i * 90); });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.stagger || '0');
      setTimeout(() => entry.target.classList.add('revealed'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
})();


/* === NAVBAR === */
(function initNavbar() {
  const nav        = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  /* scroll shadow + active link */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  /* hamburger toggle */
  hamburger?.addEventListener('click', () => {
    const isOpen = !mobileNav.hidden;
    mobileNav.hidden = isOpen;
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    hamburger.classList.toggle('open', !isOpen);
  });

  /* close on mobile link click */
  mobileNav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.hidden = true;
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('open');
    });
  });
})();
