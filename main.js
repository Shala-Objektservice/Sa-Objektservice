/* ============================================================
   SHALA OBJEKTSERVICE – Main JS
   ============================================================ */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ── Mobile burger menu ──
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !burger.contains(e.target) && !navLinks.contains(e.target)) {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Intersection Observer for scroll reveal animations ──
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Service cards
document.querySelectorAll('.service-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
  revealObserver.observe(card);
});

// Coming soon section
const csInner = document.querySelector('.cs-inner');
if (csInner) {
  csInner.style.opacity = '0';
  csInner.style.transform = 'translateY(20px)';
  csInner.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(csInner);
}

// ── Logo click scrolls to top on index page ──
const logoWrap = document.querySelector('.logo-wrap');
if (logoWrap) {
  logoWrap.addEventListener('click', () => {
    if (!window.location.pathname.includes('impressum.html')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ============================================================
// ── Cookie Consent Management (DSGVO / TTDSG) ──
// ============================================================
const COOKIE_NAME = 'shala_cookie_consent';

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function getConsent() {
  try {
    const fromStorage = localStorage.getItem(COOKIE_NAME);
    if (fromStorage) return JSON.parse(fromStorage);
  } catch (e) {}

  const fromCookie = getCookie(COOKIE_NAME);
  if (fromCookie) {
    try {
      return JSON.parse(fromCookie);
    } catch (e) {}
  }
  return null;
}

function saveConsent(consent) {
  const json = JSON.stringify(consent);
  setCookie(COOKIE_NAME, json, 365);
  try {
    localStorage.setItem(COOKIE_NAME, json);
  } catch (e) {}
}

const cookieBanner = document.getElementById('cookie-banner');
const cookieDetails = document.getElementById('cookie-details');
const cookieBtnToggle = document.getElementById('cookie-btn-toggle');
const cookieBtnAccept = document.getElementById('cookie-btn-accept');
const cookieBtnReject = document.getElementById('cookie-btn-reject');
const cookieBtnSave = document.getElementById('cookie-btn-save');
const cookieOptFunctional = document.getElementById('cookie-opt-functional');
const cookieOptAnalytics = document.getElementById('cookie-opt-analytics');
const cookieSettingsBtn = document.getElementById('cookie-settings-btn');

function showCookieBanner(expandDetails = false) {
  if (!cookieBanner) return;
  const currentConsent = getConsent();
  if (currentConsent) {
    if (cookieOptFunctional) cookieOptFunctional.checked = !!currentConsent.functional;
    if (cookieOptAnalytics) cookieOptAnalytics.checked = !!currentConsent.analytics;
  }
  if (expandDetails) {
    setDetailsExpanded(true);
  }
  cookieBanner.style.display = 'flex';
}

function hideCookieBanner() {
  if (!cookieBanner) return;
  const card = cookieBanner.querySelector('.cookie-card');
  if (card) {
    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
  }
  setTimeout(() => {
    cookieBanner.style.display = 'none';
    if (card) {
      card.style.opacity = '';
      card.style.transform = '';
    }
  }, 250);
}

function setDetailsExpanded(expanded) {
  if (!cookieDetails || !cookieBtnToggle || !cookieBtnSave) return;
  if (expanded) {
    cookieDetails.style.display = 'flex';
    cookieBtnToggle.textContent = 'Weniger anzeigen';
    cookieBtnSave.style.display = 'inline-block';
  } else {
    cookieDetails.style.display = 'none';
    cookieBtnToggle.textContent = 'Einstellungen';
    cookieBtnSave.style.display = 'none';
  }
}

if (cookieBtnToggle) {
  cookieBtnToggle.addEventListener('click', () => {
    const isHidden = cookieDetails.style.display === 'none';
    setDetailsExpanded(isHidden);
  });
}

if (cookieBtnAccept) {
  cookieBtnAccept.addEventListener('click', () => {
    saveConsent({
      essential: true,
      functional: true,
      analytics: true,
      timestamp: Date.now()
    });
    hideCookieBanner();
  });
}

if (cookieBtnReject) {
  cookieBtnReject.addEventListener('click', () => {
    saveConsent({
      essential: true,
      functional: false,
      analytics: false,
      timestamp: Date.now()
    });
    hideCookieBanner();
  });
}

if (cookieBtnSave) {
  cookieBtnSave.addEventListener('click', () => {
    saveConsent({
      essential: true,
      functional: cookieOptFunctional ? cookieOptFunctional.checked : false,
      analytics: cookieOptAnalytics ? cookieOptAnalytics.checked : false,
      timestamp: Date.now()
    });
    hideCookieBanner();
  });
}

if (cookieSettingsBtn) {
  cookieSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showCookieBanner(true);
  });
}

// Initial check on load (handles both loading and already loaded DOM)
function initCookieCheck() {
  if (!getConsent()) {
    setTimeout(() => {
      showCookieBanner(false);
    }, 400);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieCheck);
} else {
  initCookieCheck();
}
