'use strict';

// ==============================
// CAROUSEL
// ==============================
const track    = document.getElementById('carouselTrack');
const dots     = document.querySelectorAll('.dot');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');
const TOTAL    = 3;
let current    = 0;
let autoTimer  = null;

function goTo(index) {
    current = (index + TOTAL) % TOTAL;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
nextBtn.addEventListener('click', () => { next(); resetAuto(); });

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        goTo(Number(dot.dataset.index));
        resetAuto();
    });
});

function startAuto() { autoTimer = setInterval(next, 5500); }
function resetAuto()  { clearInterval(autoTimer); startAuto(); }

startAuto();

// Touch / swipe support
let touchStartX = 0;
const carousel  = document.querySelector('.carousel');

carousel.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) {
        diff > 0 ? next() : prev();
        resetAuto();
    }
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
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
    scrollTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ==============================
// SCROLL TO TOP
// ==============================
scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==============================
// INTERSECTION OBSERVER — fade-in
// ==============================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ==============================
// SMOOTH ACTIVE NAV LINK
// ==============================
const sections   = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => {
                a.style.color = '';
                if (a.getAttribute('href') === `#${entry.target.id}`) {
                    a.style.color = '#e31e24';
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));
