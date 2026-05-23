/* ===================================================
   CloudYantra Technologies — main.js
   =================================================== */

// -------------------------------------------------------
// 0. EmailJS Configuration
//    Sign up FREE at https://www.emailjs.com/
//    Replace the three values below with your own:
// -------------------------------------------------------
const EMAILJS_SERVICE_ID  = 'service_nr04xn5';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_v0126pm';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'rrIhZx7nYXlRAEGid';   // e.g. 'AbCdEfGhIjKlMnOp'

// -------------------------------------------------------
// 1. NAVBAR — scroll effect + mobile toggle
// -------------------------------------------------------
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('.nav-link');

  // Scroll: add/remove .scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    highlightActiveLink();
  }, { passive: true });

  // Mobile toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }
})();

// -------------------------------------------------------
// 2. PARTICLE BACKGROUND
// -------------------------------------------------------
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 60;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = Math.random() * 15 + 8;
    const delay = Math.random() * -15;
    const opacity = Math.random() * 0.5 + 0.1;

    p.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${Math.random() > 0.55 ? '#1e75d8' : Math.random() > 0.4 ? '#2596e8' : '#f07020'};
      left: ${x}%; top: ${y}%;
      opacity: ${opacity};
      animation: particleFloat ${dur}s ${delay}s ease-in-out infinite;
    `;
    container.appendChild(p);
  }

  // Inject particle keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%,100% { transform: translate(0,0) scale(1); opacity: var(--op,0.3); }
      25%  { transform: translate(${rnd()}px, ${rnd()}px) scale(1.2); }
      50%  { transform: translate(${rnd()}px, ${rnd()}px) scale(0.8); }
      75%  { transform: translate(${rnd()}px, ${rnd()}px) scale(1.1); }
    }
  `;
  document.head.appendChild(style);

  function rnd() { return (Math.random() - 0.5) * 60; }
})();

// -------------------------------------------------------
// 3. COUNTER ANIMATION (Hero stats)
// -------------------------------------------------------
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let started = false;

  function animateCounters() {
    counters.forEach(el => {
      const target = +el.dataset.target;
      let start = 0;
      const duration = 2000;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    });
  }

  // Start once hero is visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      animateCounters();
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
})();

// -------------------------------------------------------
// 4. SCROLL REVEAL (service cards, why cards, process steps)
// -------------------------------------------------------
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.service-card, .why-card, .process-step'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, +delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
})();

// -------------------------------------------------------
// 5. TESTIMONIALS SLIDER
// -------------------------------------------------------
(function initTestimonials() {
  const cards  = document.querySelectorAll('.testimonial-card');
  const dotsEl = document.getElementById('tDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');

  if (!cards.length || !dotsEl) return;

  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    cards[current].classList.remove('active');
    dotsEl.children[current].classList.remove('active');
    current = (idx + cards.length) % cards.length;
    cards[current].classList.add('active');
    dotsEl.children[current].classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  resetTimer();
})();

// -------------------------------------------------------
// 6. CONTACT FORM — EmailJS Integration
// -------------------------------------------------------
(function initContactForm() {
  // Init EmailJS with your public key
  emailjs.init(EMAILJS_PUBLIC_KEY);

  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = document.getElementById('btnText');
  const btnLoading = document.getElementById('btnLoading');
  const formContent = document.getElementById('formContent');
  const formSuccess = document.getElementById('formSuccess');
  const formError   = document.getElementById('formError');
  const formErrorMsg = document.getElementById('formErrorMsg');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    formError.classList.add('hidden');
    clearFieldErrors();

    // Validate
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();

    let valid = true;

    if (!name) { showFieldError('name', 'Please enter your full name'); valid = false; }
    if (!email || !isValidEmail(email)) { showFieldError('email', 'Please enter a valid email address'); valid = false; }
    if (!service) { showFieldError('service', 'Please select a service'); valid = false; }
    if (!message) { showFieldError('message', 'Please enter your message'); valid = false; }

    if (!valid) return;

    // Show loading
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');

    // Build template parameters
    const templateParams = {
      from_name:    name,
      from_email:   email,
      phone:        form.phone.value.trim() || 'Not provided',
      company:      form.company.value.trim() || 'Not provided',
      service:      service,
      message:      message,
      reply_to:     email,
    };

    try {
      // Check if EmailJS is configured
      if (
        EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID'  ||
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
        EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY'
      ) {
        // Demo mode: simulate success for testing before EmailJS setup
        await fakeSend();
      } else {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      }

      // Success
      formContent.classList.add('hidden');
      formSuccess.classList.remove('hidden');

    } catch (err) {
      showFormError('Something went wrong. Please try again or email us directly.');
      console.error('EmailJS error:', err);
    } finally {
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
    }
  });

  // Helpers
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add('error');
      const errEl = document.createElement('span');
      errEl.className = 'field-error';
      errEl.style.cssText = 'color:#f87171;font-size:0.78rem;margin-top:4px;display:block;';
      errEl.textContent = msg;
      field.parentNode.appendChild(errEl);
    }
  }

  function clearFieldErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }

  function showFormError(msg) {
    formErrorMsg.textContent = msg;
    formError.classList.remove('hidden');
  }

  function fakeSend() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }
})();

// -------------------------------------------------------
// 7. SMOOTH REVEAL on section headers (fade in)
// -------------------------------------------------------
(function initSectionFade() {
  const sections = document.querySelectorAll('.section-header, .about-grid, .contact-grid');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  sections.forEach(s => {
    s.style.cssText += `
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    `;
    observer.observe(s);
  });
})();

// -------------------------------------------------------
// 8. Scroll to top on logo click (optional UX)
// -------------------------------------------------------
document.querySelectorAll('.logo').forEach(logo => {
  logo.addEventListener('click', (e) => {
    if (logo.getAttribute('href') === '#home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

// -------------------------------------------------------
// 9. MOUSE GLOW EFFECT
// -------------------------------------------------------
(function initMouseGlow() {
  const cards = document.querySelectorAll('.service-card, .why-card, .contact-form-wrapper, .hero-dashboard, .about-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
})();

// -------------------------------------------------------
// 10. MOCK DASHBOARD LIVE SIMULATION
// -------------------------------------------------------
(function initDashboardSimulation() {
  const nodes = document.querySelectorAll('.flow-node');
  const lines = document.querySelectorAll('.flow-line .line-progress');
  const chatCountEl = document.getElementById('chatConversationsCount');
  const taskCountEl = document.getElementById('automatedTasksCount');
  
  if (!nodes.length) return;
  
  let currentNodeIdx = 1; // start at node 2 active
  
  function updateDashboard() {
    nodes.forEach((node, idx) => {
      const statusEl = node.querySelector('.node-status');
      if (!statusEl) return;
      
      if (idx === currentNodeIdx) {
        node.classList.add('active');
        if (idx === 0) {
          statusEl.textContent = 'Triggered';
          statusEl.className = 'node-status text-green';
        } else if (idx === 1) {
          statusEl.textContent = 'Thinking...';
          statusEl.className = 'node-status text-orange';
        } else if (idx === 2) {
          statusEl.textContent = 'WhatsApp Sent';
          statusEl.className = 'node-status text-green';
        }
      } else {
        node.classList.remove('active');
        if (idx < currentNodeIdx) {
          statusEl.textContent = 'Completed';
          statusEl.className = 'node-status text-green';
        } else {
          statusEl.textContent = 'Pending';
          statusEl.className = 'node-status text-muted';
        }
      }
    });

    lines.forEach((line, idx) => {
      if (idx < currentNodeIdx) {
        line.style.transform = 'translateY(0)';
        line.style.animation = 'none';
      } else if (idx === currentNodeIdx) {
        line.style.transform = 'translateY(-100%)';
        line.style.animation = 'fillProgress 2s linear infinite';
      } else {
        line.style.transform = 'translateY(-100%)';
        line.style.animation = 'none';
      }
    });

    currentNodeIdx = (currentNodeIdx + 1) % nodes.length;
  }
  
  // Initialize visual flows
  updateDashboard();
  
  // Cycle every 3.5 seconds
  setInterval(updateDashboard, 3500);
  
  // Increment counters incrementally in the background
  let chatCount = 1482;
  let taskCount = 28940;
  
  setInterval(() => {
    if (chatCountEl) {
      chatCount += Math.floor(Math.random() * 2) + 1;
      chatCountEl.textContent = chatCount.toLocaleString();
    }
    if (taskCountEl) {
      taskCount += Math.floor(Math.random() * 3) + 1;
      taskCountEl.textContent = taskCount.toLocaleString();
    }
  }, 3000);
})();
