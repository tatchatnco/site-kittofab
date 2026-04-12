/* =============================================
   KittOFab — Main JavaScript (Optimisé)
   ============================================= */

/* ─── Language Switcher ─── */
function changeLanguage(lang) {
  // Détecte le dossier actuel (racine, en/, ou es/)
  const path = window.location.pathname;
  const isEn = path.includes('/en/');
  const isEs = path.includes('/es/');
  
  const routes = {
    'fr': isEn ? '../index.html' : (isEs ? '../index.html' : 'index.html'),
    'en': isEn ? 'index.html' : (isEs ? '../en/index.html' : 'en/index.html'),
    'es': isEs ? 'index.html' : (isEn ? '../es/index.html' : 'es/index.html')
  };
  
  if (routes[lang]) {
    window.location.href = routes[lang];
  }
}

/* ─── Pharma Counter Animation ─── */
function initPharmaCounter() {
  const counterElement = document.getElementById("pharma-counter");
  if (!counterElement) return;

  const targetNumber = 250;
  const duration = 2000;
  let startTimestamp = null;
  let hasStarted = false;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const currentNumber = Math.floor(easeProgress * targetNumber);

    counterElement.innerText = currentNumber + "+";

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      counterElement.innerText = "250+";
    }
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasStarted) {
      hasStarted = true;
      requestAnimationFrame(step);
    }
  }, { threshold: 0.5 });

  observer.observe(counterElement);
}

/* ─── Benefit Counters (1, 2, 3 cards) ─── */
function initBenefitCounters() {
  const benefitCounters = document.querySelectorAll('.counter-number:not(#pharma-counter)');
  
  benefitCounters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    if (!target) return;
    
    const duration = 2000;
    let startTimestamp = null;
    let hasStarted = false;
    
    const animateCounter = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentNumber = Math.floor(easeProgress * target);
      counter.innerText = currentNumber;
      
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasStarted) {
        hasStarted = true;
        requestAnimationFrame(animateCounter);
      }
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

/* =============================================
   DOMContentLoaded - Initialisation
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize counters
  initPharmaCounter();
  initBenefitCounters();

  /* ─── Scroll Reveal (Intersection Observer) ─── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ─── Scale Reveal for Images ─── */
  const scaleElements = document.querySelectorAll('.reveal-scale');

  const scaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scaleObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  scaleElements.forEach(el => scaleObserver.observe(el));


  /* ─── Mobile Navigation Toggle ─── */
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu on link click and escape key
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.classList.contains('active')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }


  /* ─── Nav Background on Scroll ─── */
  const nav = document.querySelector('.nav');

  if (nav) {
    let scrollTimer = null;
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        nav.style.background = 'rgba(251, 251, 253, 0.95)';
        nav.style.backdropFilter = 'saturate(180%) blur(20px)';
      } else {
        nav.style.background = 'rgba(251, 251, 253, 0.72)';
        nav.style.backdropFilter = 'saturate(180%) blur(25px)';
      }
      
      // Throttling for performance
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(function() {
        scrollTimer = null;
      }, 100);
    }, { passive: true });
  }


  /* ─── FAQ Accordion ─── */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
    
    // Keyboard accessibility
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.setAttribute('aria-expanded', 'false');
    
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });


  /* ─── Animated Counter ─── */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);

          el.textContent = prefix + current.toLocaleString('fr-FR') + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => counterObserver.observe(el));


  /* ─── Smooth Scroll for anchor links  ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Handle Hash Offset on initial load (from another page) ─── */
  if (window.location.hash) {
    const hash = window.location.hash;
    const target = document.querySelector(hash);
    if (target) {
      setTimeout(() => {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 800);
    }
  }

});

// Expose changeLanguage globally for HTML onclick handlers
window.changeLanguage = changeLanguage;
