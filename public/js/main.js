// ── Title blur-lift reveal ──────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── CTA parallax ─────────────────────────────────────────
const ctaBg = document.getElementById('ctaBg');
if (ctaBg) {
  gsap.to(ctaBg, {
    y: '28%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#ctaBand',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
}

function splitText(el) {
  // Recursive split that preserves <br> and <em> wrappers
  function splitNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      [...node.textContent].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        frag.appendChild(span);
      });
      return frag;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') return node.cloneNode();
      const clone = node.cloneNode(false);
      node.childNodes.forEach(child => clone.appendChild(splitNode(child)));
      return clone;
    }
    return node.cloneNode(true);
  }
  const frag = document.createDocumentFragment();
  el.childNodes.forEach(child => frag.appendChild(splitNode(child)));
  el.innerHTML = '';
  el.appendChild(frag);
  return el.querySelectorAll('.char');
}

document.querySelectorAll('[data-blur-text]').forEach(el => {
  const chars = splitText(el);
  const tag = el.tagName.toLowerCase();
  const isH1 = tag === 'h1';

  gsap.fromTo(chars,
    {
      opacity: 0,
      y: isH1 ? 20 : 14,
      filter: 'blur(12px)'
    },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: isH1 ? 0.04 : 0.025,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: isH1 ? 'top 80%' : 'top 88%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

// FAQ
function toggleFaq(el) {
  const item = el.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// Bar active state on focus
(function() {
  const bar = document.querySelector('.bottom-bar');
  const inp = document.getElementById('barInput');
  if (!bar || !inp) return;
  inp.addEventListener('focus', () => bar.classList.add('focused'));
  inp.addEventListener('blur', () => { if (!inp.value.trim()) bar.classList.remove('focused'); });
})();

// Bar tabs
function setTab(el, s) {
  document.querySelectorAll('.bar-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const ph = {work:'Ask about our case studies…',about:'Ask anything about Fivecube…',thinking:'Explore our insights…',careers:'Looking to join Fivecube?',contacts:'How can we reach you?'};
  document.getElementById('barInput').placeholder = ph[s] || 'Curious about anything?';
}

// Suggestions
const sugs = ['What services does Fivecube offer?','How fast can you build an MVP?','What industries do you work in?','How do I start a project?','Do you do development too?'];
let si = 0;
function insertSug() {
  const inp = document.getElementById('barInput');
  inp.value = sugs[si++ % sugs.length];
  onInput(inp); inp.focus();
}

// Knowledge
const kb = {
  services: { k:['service','offer','do ','help','build','design','develop','ux','ui','visual','platform','startup','mvp','scal'],
    a:`Fivecube offers six core services:\n\n• **UX Research & Strategy** — flows, research, IA\n• **UI & Visual Design** — brand, design systems\n• **Development** — frontend, backend, QA\n• **Scaling & Optimization** — redesigns, dedicated teams\n• **Platform-Specific Design** — iOS, Android, Web\n• **Startup MVP** — zero to launch\n\nFull-cycle. One team. No handoffs.`,
    c:['How fast can you build an MVP?','What industries do you work in?','How do I start?']},
  mvp: { k:['mvp','fast','quick','week','time','long','launch'],
    a:`Most MVPs take **3–6 weeks** depending on scope.\n\nThe biggest variable is how fast decisions get made on your side — and we'll help you structure that process too.\n\nProjects start from **$5k**.`,
    c:['What does discovery involve?','Do you do development too?','How do I start?']},
  industries: { k:['industr','saas','fintech','edtech','real','estate','ecommerce','igaming','web3','ai','ml','sector'],
    a:`Fivecube designs & builds for:\n\n• **SaaS** — complex workflows, onboarding\n• **Fintech** — compliance, trust signals, conversion\n• **AI / ML** — interfaces that feel intelligent, not intimidating\n• **Web3** — UX that removes blockchain complexity\n• **EdTech, Real Estate, E-commerce, iGaming**\n\nStartups and mid-market, EU · UK · North America.`,
    c:['What services do you offer?','How do I start?','Tell me about your process']},
  about: { k:['about','who','founded','2016','lviv','team','agency','story','size','company'],
    a:`Fivecube is a digital product design agency founded in **2016** in Lviv, Ukraine.\n\nStarted as a team of 5. Now a focused studio — neither too big nor too small.\n\n**100+ founders** trust us · **32 Clutch reviews** · **9+ years** shipping products.\n\n*"Light that builds logic."*`,
    c:['What services do you offer?','Why choose Fivecube?','How do I start?']},
  start: { k:['start','begin','contact','hire','budget','price','cost','collaborate','quote'],
    a:`Starting is simple:\n\n1. **30-min call** — no pitch, no pressure, just clarity\n2. **Discovery** — we define scope, goals, constraints\n3. **Proposal** — timeline + milestone-based pricing\n4. **Kickoff** — research → design → build → ship\n\nProjects from **$5k**. Hit "See if we're a fit →" above.`,
    c:['How fast is an MVP?','What services do you offer?','What industries do you work in?']},
  process: { k:['process','work','step','discover','how','method','approach'],
    a:`Our process in 6 steps:\n\n1. **Discovery** — market analysis, user research, competitor audit\n2. **UX Planning** — flows, prototypes, edge cases\n3. **Visual Direction** — 2 directions A/B tested with real users\n4. **UI Design & Handoff** — high-fi screens + design system\n5. **Development** — frontend, backend, QA, one team\n6. **Launch & Support** — we stay in the room`,
    c:['How fast can you build an MVP?','Do you do development too?','How do I start?']},
  default: { a:`I'm the Fivecube AI — ask me anything about our services, process, team, or how to get started.\n\nTry:\n• "What services do you offer?"\n• "How fast can you build an MVP?"\n• "What industries do you work in?"`,
    c:['What services do you offer?','Who is Fivecube?','How do I start?']}
};

function getAns(q) {
  const ql = q.toLowerCase();
  for (const [,e] of Object.entries(kb)) {
    if (e.k && e.k.some(k => ql.includes(k))) return e;
  }
  return kb.default;
}

async function askAI() {
  const inp = document.getElementById('barInput');
  const q = inp.value.trim(); if (!q) return;
  const panel = document.getElementById('barAnswer');
  const txt = document.getElementById('ansText');
  const chips = document.getElementById('ansChips');
  const dot = document.getElementById('ansDot');
  const statusEl = document.querySelector('.bar-brand-status');
  const bar = document.querySelector('.bottom-bar');

  txt.innerHTML = '<div class="loading"><span></span><span></span><span></span></div>';
  chips.innerHTML = ''; dot.classList.remove('done');
  panel.classList.add('open');
  bar.classList.add('focused', 'thinking');
  if (statusEl) statusEl.textContent = 'Thinking…';
  inp.value = '';

  await new Promise(r => setTimeout(r, 850));

  const e = getAns(q);
  const formatted = e.a.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/^• (.+)$/gm,'<span style="display:block;padding-left:12px;text-indent:-12px">• $1</span>').replace(/^\d+\. \*\*(.+?)\*\* — (.+)$/gm,'<span style="display:block;margin-bottom:4px"><strong>$1</strong> — $2</span>').replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>');
  const raw = (new DOMParser().parseFromString(e.a,'text/html')).body.textContent;
  txt.innerHTML = '<span id="tw"></span><span class="cursor"></span>';
  const tw = document.getElementById('tw');
  let i = 0;
  await new Promise(r => { (function tick(){ if(i<raw.length){i+=Math.ceil(Math.random()*2);i=Math.min(i,raw.length);tw.textContent=raw.slice(0,i);setTimeout(tick,13);}else r(); })(); });

  txt.innerHTML = formatted;
  dot.classList.add('done');
  bar.classList.remove('thinking');
  if (statusEl) statusEl.textContent = 'Ready to help';

  const followUps = (e.c || []).map(c => `<button class="chip" onclick="askChip('${c.replace(/'/g, "\\'")}')">${c}</button>`).join('');
  chips.innerHTML = followUps + `<a href="#contact" class="chip chip-cta" onclick="closeAns()">Book a call →</a>`;
}

function askChip(q) {
  document.getElementById('barInput').value = q;
  askAI();
}

function closeAns() {
  document.getElementById('barAnswer').classList.remove('open');
}
