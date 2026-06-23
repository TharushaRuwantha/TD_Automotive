'use strict';

const WA_NUMBER = '94707200033';

// ==============================
// CAROUSEL — fade + split-slide
// ==============================
const slides   = document.querySelectorAll('.slide');
const dots     = document.querySelectorAll('.dot');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');
const TOTAL    = slides.length;
let current    = 0;
let autoTimer  = null;

function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + TOTAL) % TOTAL;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
nextBtn.addEventListener('click', () => { next(); resetAuto(); });

dots.forEach(d => {
    d.addEventListener('click', () => { goTo(Number(d.dataset.index)); resetAuto(); });
});

function startAuto() { autoTimer = setInterval(next, 5500); }
function resetAuto()  { clearInterval(autoTimer); startAuto(); }
startAuto();

// Touch / swipe
let touchX = 0;
const hero  = document.querySelector('.hero');
hero.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
hero.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) { diff > 0 ? next() : prev(); resetAuto(); }
});

// Keyboard arrows
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
    if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
});

// ==============================
// NAVBAR
// ==============================
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    scrollTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
    });
});

scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ==============================
// WHATSAPP HELPERS
// ==============================
function openWhatsApp(msg) {
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
}

const defaultMsg = () => `Hi TD Automotive! I'm interested in your battery services. Could you help me?`;

document.getElementById('waFloat').addEventListener('click', e => {
    e.preventDefault();
    openWhatsApp(defaultMsg());
});

const waContactBtn = document.getElementById('waContactBtn');
if (waContactBtn) {
    waContactBtn.addEventListener('click', () => openWhatsApp(defaultMsg()));
}

// ==============================
// BATTERY FINDER
// ==============================
document.getElementById('waFinderBtn').addEventListener('click', () => {
    const vtypeEl = document.querySelector('input[name="vtype"]:checked');
    const model   = document.getElementById('vehicleModel').value.trim();

    if (!vtypeEl && !model) {
        const card = document.querySelector('.finder-card');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'shake .4s ease';
        return;
    }

    let msg = `Hi TD Automotive! I'm looking for a battery.`;
    if (vtypeEl) msg += `\n🚗 Vehicle type: ${vtypeEl.value}`;
    if (model)   msg += `\n📋 Vehicle: ${model}`;
    msg += `\n\nCould you check availability and pricing? Thanks!`;

    openWhatsApp(msg);
});

// ==============================
// PRODUCT — WhatsApp quick send
// ==============================
document.querySelectorAll('.wa-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const msg =
            `Hi TD Automotive! I'm interested in a ${btn.dataset.product} for my ${btn.dataset.type}.\n` +
            `Could you check availability and pricing? Thanks!`;
        openWhatsApp(msg);
    });
});

// ==============================
// INTERSECTION OBSERVER — fade-in
// ==============================
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ==============================
// ACTIVE NAV HIGHLIGHT
// ==============================
const secEls = document.querySelectorAll('section[id]');
const navAs  = document.querySelectorAll('.nav-links a');

new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navAs.forEach(a => {
                const active = a.getAttribute('href') === `#${e.target.id}`;
                a.style.color      = active ? 'var(--red)'  : '';
                a.style.fontWeight = active ? '700' : '';
            });
        }
    });
}, { threshold: 0.45 }).observe && secEls.forEach(s => {
    new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navAs.forEach(a => {
                    const active = a.getAttribute('href') === `#${e.target.id}`;
                    a.style.color      = active ? 'var(--red)' : '';
                    a.style.fontWeight = active ? '700' : '';
                });
            }
        });
    }, { threshold: 0.45 }).observe(s);
});
