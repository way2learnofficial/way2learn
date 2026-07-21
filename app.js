// Scroll Progress Bar
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
});

// Countdown Timer
(function() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);
  endDate.setHours(23, 59, 59, 0);

  function update() {
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(d).padStart(2, '0');
    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();

// Animated Counters
(function() {
  const counters = document.querySelectorAll('[data-count]');
  let counted = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const start = performance.now();

      function step(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(eased * target);
        counter.textContent = current.toLocaleString() + '+';
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  }

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) heroObserver.observe(statsSection);
})();

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.textContent = isOpen ? '✕' : '☰';
  menuToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// Scroll Animations
const fadeEls = document.querySelectorAll('.fade-up, .fade-scale');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
fadeEls.forEach(el => observer.observe(el));

// Form Validation
const form = document.getElementById('registerForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  let isValid = true;

  form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
  document.getElementById('termsError').style.display = 'none';

  const name = document.getElementById('firstName');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  const college = document.getElementById('college');
  const gradYear = document.getElementById('gradYear');
  const city = document.getElementById('city');
  const terms = document.getElementById('terms');

  if (!name.value.trim()) { name.closest('.form-group').classList.add('error'); isValid = false; }
  if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 10) { phone.closest('.form-group').classList.add('error'); isValid = false; }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.closest('.form-group').classList.add('error'); isValid = false; }
  if (!college.value.trim()) { college.closest('.form-group').classList.add('error'); isValid = false; }
  if (!gradYear.value) { gradYear.closest('.form-group').classList.add('error'); isValid = false; }
  if (!city.value.trim()) { city.closest('.form-group').classList.add('error'); isValid = false; }
  if (!terms.checked) { document.getElementById('termsError').style.display = 'block'; isValid = false; }

  if (isValid) {
    form.style.display = 'none';
    document.querySelector('.form-header').style.display = 'none';
    successMessage.classList.add('show');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

form.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => el.closest('.form-group')?.classList.remove('error'));
  el.addEventListener('change', () => el.closest('.form-group')?.classList.remove('error'));
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Load Global SEO Settings dynamically
(function() {
  fetch('settings.json')
    .then(response => {
      if (!response.ok) throw new Error('Settings load failed');
      return response.json();
    })
    .then(settings => {
      if (settings.siteTitle) document.title = settings.siteTitle;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && settings.siteDescription) {
        metaDescription.setAttribute('content', settings.siteDescription);
      }
      
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords && settings.siteKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      if (metaKeywords && settings.siteKeywords) {
        metaKeywords.setAttribute('content', settings.siteKeywords);
      }
    })
    .catch(error => console.warn('Could not load global SEO settings:', error));
})();
