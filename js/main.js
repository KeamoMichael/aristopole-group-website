/* =========================================================
   ARISTOPOLE GROUP V2 — main.js
   ========================================================= */
'use strict';

/* ─── Navbar: smooth shadow on scroll (rAF-throttled) ───── */
const nav = document.getElementById('nav');
let rafNav = false;
window.addEventListener('scroll', () => {
  if (rafNav) return;
  rafNav = true;
  requestAnimationFrame(() => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
    rafNav = false;
  });
}, { passive: true });

/* ─── Active nav link ────────────────────────────────────── */
const sections = document.querySelectorAll('section[id], div[id]');
const links    = document.querySelectorAll('.nav-links a');

function setActive() {
  const mid = window.scrollY + window.innerHeight / 3;
  sections.forEach(sec => {
    if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) {
      links.forEach(l => {
        l.classList.toggle('on', l.getAttribute('href') === `#${sec.id}`);
      });
    }
  });
}
window.addEventListener('scroll', setActive, { passive: true });

/* ─── Mobile drawer ──────────────────────────────────────── */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
let open = false;

function openDrawer()  {
  open = true;
  burger.classList.add('open');
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
  burger.setAttribute('aria-expanded', 'true');
}
function closeDrawer() {
  open = false;
  burger.classList.remove('open');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', () => open ? closeDrawer() : openDrawer());
document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeDrawer(); });
window.closeDrawer = closeDrawer;

/* ─── Scroll reveal ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.rv, .rv-l, .rv-r');
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
revealEls.forEach(el => ro.observe(el));

/* ─── Counter animation ──────────────────────────────────── */
const counters = document.querySelectorAll('.counter');
let ran = false;

function runCounters() {
  counters.forEach(el => {
    const target = +el.dataset.target;
    const dur    = 1600;
    const step   = target / (dur / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) {
        el.textContent = target;
        clearInterval(t);
      } else {
        el.textContent = Math.floor(cur);
      }
    }, 16);
  });
}

const statsBlock = document.querySelector('.hero-stats');
if (statsBlock) {
  const so = new IntersectionObserver(e => {
    if (e[0].isIntersecting && !ran) {
      ran = true;
      runCounters();
      so.disconnect();
    }
  }, { threshold: 0.4 });
  so.observe(statsBlock);
}

/* ─── Form validation ────────────────────────────────────── */
const form    = document.getElementById('cForm');
const submit  = document.getElementById('f-submit');
const success = document.getElementById('f-success');

const rules = [
  { id: 'f-name',    gid: 'g-name',    test: v => v.trim().length > 0 },
  { id: 'f-email',   gid: 'g-email',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
  { id: 'f-service', gid: 'g-service', test: v => v !== '' },
  { id: 'f-message', gid: 'g-message', test: v => v.trim().length > 0 },
];

function check({ id, gid, test }) {
  const el = document.getElementById(id);
  const gr = document.getElementById(gid);
  const ok = test(el.value);
  el.classList.toggle('err', !ok);
  gr.classList.toggle('has-err', !ok);
  return ok;
}

rules.forEach(r => {
  document.getElementById(r.id).addEventListener('blur', () => check(r));
});

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const allOk = rules.every(r => check(r));
    if (!allOk) {
      form.querySelector('.err')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      submit.disabled = false;
      submit.innerHTML = `Send enquiry <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => success.classList.remove('show'), 6000);
    }, 1200);
  });
}

/* ─── Smooth anchor scroll ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});
