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
// SERVICES DECK — fan on desktop, swipe stack on mobile
// ==============================
const svcDeck     = document.querySelector('.svc-deck');
const deckHintTxt = document.querySelector('.deck-hint-text');

if (svcDeck) {
    const isMobile = () => window.innerWidth <= 768;

    if ('ontouchstart' in window && deckHintTxt) {
        deckHintTxt.textContent = isMobile()
            ? 'Swipe left or right to browse'
            : 'Tap to explore all services';
    }

    // Desktop: click toggles fan; click outside closes
    svcDeck.addEventListener('click', () => {
        if (!isMobile()) svcDeck.classList.toggle('active');
    });
    document.addEventListener('click', e => {
        if (!isMobile() && !svcDeck.contains(e.target)) svcDeck.classList.remove('active');
    });

    // Mobile: Tinder-style swipe-to-dismiss card stack
    if (isMobile()) {
        const cards = Array.from(svcDeck.querySelectorAll('.svc-dc'));
        const total = cards.length;
        let topIdx = 0, dragging = false, startX = 0, startY = 0;

        function updateStack(animate, skipIdx) {
            cards.forEach((card, i) => {
                const rel = (i - topIdx + total) % total;
                const doAnim = animate && i !== skipIdx;
                card.style.transition = doAnim ? 'transform 0.35s ease, opacity 0.35s ease' : 'none';
                if (rel === 0) {
                    card.style.zIndex = total;
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.opacity = '1';
                } else if (rel === 1) {
                    card.style.zIndex = total - 1;
                    card.style.transform = 'translateY(10px) scale(0.96)';
                    card.style.opacity = '1';
                } else if (rel === 2) {
                    card.style.zIndex = total - 2;
                    card.style.transform = 'translateY(18px) scale(0.92)';
                    card.style.opacity = '1';
                } else {
                    card.style.zIndex = total - rel;
                    card.style.transform = 'translateY(22px) scale(0.88)';
                    card.style.opacity = '0';
                }
            });
        }

        updateStack(false);

        svcDeck.addEventListener('touchstart', e => {
            const target = e.target.closest('.svc-dc');
            if (!target || target !== cards[topIdx]) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            dragging = true;
            cards[topIdx].style.transition = 'none';
        }, { passive: true });

        svcDeck.addEventListener('touchmove', e => {
            if (!dragging) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            cards[topIdx].style.transform = `translate(${dx}px,${dy * 0.4}px) rotate(${dx * 0.08}deg) scale(1)`;
        }, { passive: true });

        svcDeck.addEventListener('touchend', e => {
            if (!dragging) return;
            dragging = false;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 90) {
                const dir = dx > 0 ? 1 : -1;
                const swipedCard = cards[topIdx];
                const swipedIdx = topIdx;
                swipedCard.style.transition = 'transform 0.4s ease, opacity 0.35s ease';
                swipedCard.style.transform = `translate(${dir * 450}px,-40px) rotate(${dir * 28}deg) scale(1)`;
                swipedCard.style.opacity = '0';
                setTimeout(() => {
                    topIdx = (topIdx + 1) % total;
                    updateStack(true, swipedIdx);
                }, 420);
            } else {
                // Snap back
                cards[topIdx].style.transition = 'transform 0.3s ease';
                cards[topIdx].style.transform = 'translateY(0) scale(1)';
            }
        }, { passive: true });
    }
}

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
