import './style.css';
import QRCode from 'qrcode';

/* ============================================================
   CORE EVENT METRICS & CONSTANTS
   ============================================================ */

// Sunday, 29th November 2026 at 7:00 PM IST (UTC+05:30)
const WEDDING_TIMESTAMP = new Date('2026-11-29T19:00:00+05:30');
const VENUE_NAME = "Grand Wedding Hall";
const VENUE_MAPS_URL = "https://maps.app.goo.gl/7CWHe2UekRWbMbiVA?g_st=aw";
const VENUE_ADDRESS_TEXT = "Grand Wedding Hall, Bengaluru (Google Maps: https://maps.app.goo.gl/7CWHe2UekRWbMbiVA?g_st=aw)";

/* ============================================================
   1. AMBIENT GOLD DUST CANVAS ENGINE
   ============================================================ */

function initGoldDustCanvas() {
  const canvas = document.getElementById('ambient-gold-canvas');
  if (!canvas) return { burst: () => {} };

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const particles = [];
  const bursts = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 35 : 70;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.55 + 0.25;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      this.pulseVal = Math.random() * Math.PI;
      const hue = Math.random() > 0.4 ? 40 : 45;
      this.color = `hsl(${hue}, 50%, ${Math.random() * 20 + 70}%)`;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.pulseVal += this.pulseSpeed;
      this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.pulseVal));

      if (this.y < -10 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.currentOpacity;
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.45)';
      ctx.fill();
      ctx.restore();
    }
  }

  function createBurst(x, y, count = 55) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      bursts.push({
        x: x || width / 2,
        y: y || height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.2,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.012,
        color: Math.random() > 0.3 ? '#FFF2DF' : '#C5A880'
      });
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.08;
      b.alpha -= b.decay;

      if (b.alpha <= 0) {
        bursts.splice(i, 1);
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(255, 242, 223, 0.8)';
        ctx.fill();
        ctx.restore();
      }
    }

    animationId = requestAnimationFrame(loop);
  }

  loop();

  return {
    burst: createBurst,
    stop: () => cancelAnimationFrame(animationId)
  };
}

const goldCanvasEngine = initGoldDustCanvas();

/* ============================================================
   2. ROYAL CEREMONIAL ENVELOPE CONTROLLER
   ============================================================ */

function initEnvelopeController() {
  const envelopeScreen = document.getElementById('envelope-screen');
  const waxSealBtn = document.getElementById('wax-seal-trigger');
  const replayBtn = document.getElementById('replay-envelope-btn');

  if (!envelopeScreen || !waxSealBtn) return;

  function openEnvelope() {
    envelopeScreen.classList.add('opened');
    
    // Play sound & burst particles
    audioSynth.playChime();
    const rect = waxSealBtn.getBoundingClientRect();
    goldCanvasEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

    setTimeout(() => {
      envelopeScreen.classList.add('hidden');
    }, 900);
  }

  function closeAndReplay() {
    envelopeScreen.classList.remove('hidden');
    envelopeScreen.classList.remove('opened');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  waxSealBtn.addEventListener('click', openEnvelope);
  if (replayBtn) replayBtn.addEventListener('click', closeAndReplay);
}

/* ============================================================
   3. WEB AUDIO SERENITY SYNTHESIZER (HARP / CELESTA AMBIENCE)
   ============================================================ */

class AmbientSerenitySynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.gainNode = null;
    // Pentatonic royal chord notes in Hz (D4, E4, F#4, A4, B4, D5, E5, F#5, A5)
    this.scale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq, timeOffset = 0, duration = 3.5) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Warm sine + subtle triangle for delicate acoustic harp feel
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + timeOffset);

    const startTime = this.ctx.currentTime + timeOffset;
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.18, startTime + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  playChime() {
    this.initContext();
    if (!this.ctx) return;
    // Pleasant 3-note arpeggio chime for seal break
    [this.scale[3], this.scale[5], this.scale[8]].forEach((freq, idx) => {
      this.playNote(freq, idx * 0.12, 2.5);
    });
  }

  start() {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;

    const playArpeggio = () => {
      if (!this.isPlaying) return;
      // Pick 3-4 gentle harmonious notes from scale
      const chord = [
        this.scale[Math.floor(Math.random() * 3)],
        this.scale[3 + Math.floor(Math.random() * 3)],
        this.scale[6 + Math.floor(Math.random() * 3)]
      ];

      chord.forEach((note, idx) => {
        this.playNote(note, idx * 0.45, 4.0);
      });

      const nextInterval = 4500 + Math.random() * 2500;
      this.timerId = setTimeout(playArpeggio, nextInterval);
    };

    playArpeggio();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) clearTimeout(this.timerId);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

const audioSynth = new AmbientSerenitySynth();

function initAudioController() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    const isPlaying = audioSynth.toggle();
    if (isPlaying) {
      audioBtn.classList.add('playing');
      showToast("Ambient Serenity Accompaniment Enabled");
    } else {
      audioBtn.classList.remove('playing');
      showToast("Ambient Audio Paused");
    }
  });
}

/* ============================================================
   4. TOAST NOTIFICATION CAPSULE
   ============================================================ */

let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('luxury-toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('active');
  toast.setAttribute('aria-hidden', 'false');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
    toast.setAttribute('aria-hidden', 'true');
  }, 3200);
}

/* ============================================================
   5. REAL-TIME COUNTDOWN VAULT (Sunday, 29th Nov 2026, 7:00 PM IST)
   ============================================================ */

function initCountdownVault() {
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  function update() {
    const now = new Date().getTime();
    const diff = WEDDING_TIMESTAMP.getTime() - now;

    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elDays.textContent = String(days).padStart(2, '0');
    elHours.textContent = String(hours).padStart(2, '0');
    elMinutes.textContent = String(minutes).padStart(2, '0');
    elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   6. CALENDAR SYNCHRONIZATION (GOOGLE & APPLE .ICS)
   ============================================================ */

function initCalendarSync() {
  const btnGoogle = document.getElementById('btn-add-google-cal');
  const btnIcal = document.getElementById('btn-export-ical');

  // Google Calendar parameters
  // Event: 20261129T133000Z to 20261129T183000Z (7:00 PM IST is 13:30 UTC)
  const gcalTitle = encodeURIComponent("Nikkah Ceremony — Abdhul Raheem & Shadab Fatima");
  const gcalDetails = encodeURIComponent(
    "Auspicious Ceremony of Nikkah of Abdhul Raheem & Shadab Fatima.\nTiming: 7:00 PM Onwards.\nSanctuary: Grand Wedding Hall.\nLocation: " + VENUE_MAPS_URL
  );
  const gcalLocation = encodeURIComponent(VENUE_NAME + " (Google Maps: " + VENUE_MAPS_URL + ")");
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=20261129T133000Z/20261129T183000Z&details=${gcalDetails}&location=${gcalLocation}`;

  if (btnGoogle) {
    btnGoogle.href = gcalUrl;
  }

  if (btnIcal) {
    btnIcal.addEventListener('click', () => {
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Abdhul Raheem & Shadab Fatima//Nikkah Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:nikkah-abdhul-shadab-20261129@wedding.app",
        "DTSTAMP:20261030T090000Z",
        "DTSTART:20261129T133000Z",
        "DTEND:20261129T183000Z",
        "SUMMARY:Nikkah Ceremony — Abdhul Raheem & Shadab Fatima",
        "DESCRIPTION:Auspicious Ceremony of Nikkah of Abdhul Raheem & Shadab Fatima at Grand Wedding Hall from 7:00 PM onwards. Google Maps: " + VENUE_MAPS_URL,
        "LOCATION:Grand Wedding Hall\\, Bengaluru (Google Maps: " + VENUE_MAPS_URL + ")",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Nikkah_Abdhul_Raheem_Shadab_Fatima.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Ceremony Added to Calendar File (.ics)");
    });
  }
}

/* ============================================================
   7. VENUE ADDRESS COPY TO CLIPBOARD
   ============================================================ */

function initVenueActions() {
  const btnCopy = document.getElementById('btn-copy-address');
  if (!btnCopy) return;

  btnCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(VENUE_ADDRESS_TEXT);
      showToast("Sanctuary Address Copied to Clipboard");
    } catch {
      showToast("Venue Address: Grand Wedding Hall, Bengaluru");
    }
  });
}

/* ============================================================
   8. BENEDICTIONS & DUAS WALL (INTERACTIVE CHIPS)
   ============================================================ */

function initBenedictionsWall() {
  const chips = document.querySelectorAll('.dua-chip-btn');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const rect = chip.getBoundingClientRect();
      goldCanvasEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
      audioSynth.playChime();

      showToast("Jazakallahu Khair for Your Heartfelt Dua!");
    });
  });
}

/* ============================================================
   10. CUSTOM INTERACTIVE CURSOR (FINE POINTERS)
   ============================================================ */

function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || !window.matchMedia('(pointer: fine)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }

  renderRing();

  const interactives = 'a, button, input, select, textarea, label, [role="button"]';
  document.querySelectorAll(interactives).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   11. 3D TILT ON MOORISH HERO PORTAL
   ============================================================ */

function initHeroPortal3DTilt() {
  const portal = document.getElementById('hero-portal-card');
  if (!portal || !window.matchMedia('(pointer: fine)').matches) return;

  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = portal.getBoundingClientRect();
    const portalCenterX = rect.left + rect.width / 2;
    const portalCenterY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - portalCenterX) / (window.innerWidth / 2);
    const deltaY = (e.clientY - portalCenterY) / (window.innerHeight / 2);

    const rotateX = -deltaY * 5;
    const rotateY = deltaX * 6;

    portal.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    portal.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* ============================================================
   12. MOBILE NAVIGATION DRAWER & SCROLL SPY
   ============================================================ */

function initNavigation() {
  const header = document.getElementById('luxury-header');
  const hamBtn = document.getElementById('hamburger-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('editorial-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('[data-drawer-link]');
  const desktopLinks = document.querySelectorAll('[data-nav-item]');

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Drawer Toggle
  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamBtn) hamBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Scrollspy for desktop navigation
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ============================================================
   MASTER INITIALIZATION
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelopeController();
  initAudioController();
  initCountdownVault();
  initCalendarSync();
  initVenueActions();
  initBenedictionsWall();
  initCustomCursor();
  initHeroPortal3DTilt();
  initNavigation();
});
