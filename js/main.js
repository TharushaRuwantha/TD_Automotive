'use strict';

const WA_NUMBER = '94XXXXXXXXX'; // Replace with real number e.g. 94771234567

// ==============================
// BENTO CAROUSEL
// ==============================
const slides    = document.querySelectorAll('.c-slide');
const dots      = document.querySelectorAll('.c-dot');
const prevBtn   = document.getElementById('cPrev');
const nextBtn   = document.getElementById('cNext');
const TOTAL     = slides.length;
let current     = 0;
let autoTimer   = null;

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
    d.addEventListener('click', () => { goTo(Number(d.dataset.idx)); resetAuto(); });
});

function startAuto() { autoTimer = setInterval(next, 5500); }
function resetAuto()  { clearInterval(autoTimer); startAuto(); }
startAuto();

// Touch swipe on carousel
let touchX = 0;
const bentoC = document.getElementById('bentoCarousel');
bentoC.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
bentoC.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) { diff > 0 ? next() : prev(); resetAuto(); }
});

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
    navbar.classList.toggle('scrolled', window.scrollY > 20);
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
function openWhatsApp(message) {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
}

function defaultWaMsg() {
    return `Hi TD Automotive! I'm interested in your battery services. Could you help me?`;
}

// Floating WhatsApp button
document.getElementById('waFloat').addEventListener('click', e => {
    e.preventDefault();
    openWhatsApp(defaultWaMsg());
});

// Contact section WhatsApp button
const waContactBtn = document.getElementById('waContactBtn');
if (waContactBtn) {
    waContactBtn.addEventListener('click', () => openWhatsApp(defaultWaMsg()));
}

// ==============================
// BATTERY FINDER — WhatsApp
// ==============================
document.getElementById('waFinderBtn').addEventListener('click', () => {
    const vtypeEl = document.querySelector('input[name="vtype"]:checked');
    const model   = document.getElementById('vehicleModel').value.trim();

    const vtype = vtypeEl ? vtypeEl.value : null;

    if (!vtype && !model) {
        shakeCard();
        return;
    }

    let msg = `Hi TD Automotive! I'm looking for a battery.`;
    if (vtype)  msg += `\n🚗 Vehicle type: ${vtype}`;
    if (model)  msg += `\n📋 Vehicle: ${model}`;
    msg += `\n\nCould you check availability and pricing for me? Thanks!`;

    openWhatsApp(msg);
});

function shakeCard() {
    const card = document.querySelector('.finder-card');
    card.style.animation = 'none';
    card.offsetHeight; // reflow
    card.style.animation = 'shake .4s ease';
}

// ==============================
// PRODUCT WhatsApp quick-buttons
// ==============================
document.querySelectorAll('.wa-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type    = btn.dataset.type;
        const product = btn.dataset.product;
        const msg =
            `Hi TD Automotive! I'm interested in a ${product} for my ${type}.\n` +
            `Could you check availability and pricing? Thanks!`;
        openWhatsApp(msg);
    });
});

// ==============================
// INTERSECTION OBSERVER — fade-in
// ==============================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ==============================
// ACTIVE NAV HIGHLIGHT
// ==============================
const sectionEls = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');

const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navAs.forEach(a => {
                const active = a.getAttribute('href') === `#${e.target.id}`;
                a.style.color = active ? 'var(--blue)' : '';
                a.style.fontWeight = active ? '700' : '';
            });
        }
    });
}, { threshold: 0.45 });

sectionEls.forEach(s => secObs.observe(s));
