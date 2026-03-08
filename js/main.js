

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     MOBILE NAVIGATION
     -------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.mobile-overlay');
  const navAnchors = navLinks.querySelectorAll('a');

  function openNav() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeNav() : openNav();
  });

  overlay.addEventListener('click', closeNav);

  navAnchors.forEach(a => a.addEventListener('click', closeNav));

  /* --------------------------------------------------------
     STICKY HEADER SHADOW
     -------------------------------------------------------- */
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* --------------------------------------------------------
     ACTIVE NAV HIGHLIGHTING (IntersectionObserver)
     -------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const observerOpts = {
    rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 20}px 0px -40% 0px`,
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOpts);

  sections.forEach(sec => navObserver.observe(sec));

  /* --------------------------------------------------------
     HERO SLIDESHOW
     -------------------------------------------------------- */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  const prevBtn = document.querySelector('.slide-prev');
  const nextBtn = document.querySelector('.slide-next');
  const slideshowEl = document.querySelector('.slideshow');
  let currentSlide = 0;
  let slideInterval;
  const SLIDE_DELAY = 4500;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startSlideshow() {
    slideInterval = setInterval(nextSlide, SLIDE_DELAY);
  }

  function stopSlideshow() { clearInterval(slideInterval); }

  nextBtn.addEventListener('click', () => { stopSlideshow(); nextSlide(); startSlideshow(); });
  prevBtn.addEventListener('click', () => { stopSlideshow(); prevSlide(); startSlideshow(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopSlideshow(); goToSlide(i); startSlideshow(); });
  });

  slideshowEl.addEventListener('mouseenter', stopSlideshow);
  slideshowEl.addEventListener('mouseleave', startSlideshow);

  slideshowEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { stopSlideshow(); nextSlide(); startSlideshow(); }
    if (e.key === 'ArrowLeft') { stopSlideshow(); prevSlide(); startSlideshow(); }
  });

  startSlideshow();

  /* --------------------------------------------------------
     COACH FILTER
     -------------------------------------------------------- */
  const coachFilter = document.getElementById('coachFilter');
  const coachCards = document.querySelectorAll('.coach-card');

  if (coachFilter) {
    coachFilter.addEventListener('change', () => {
      const val = coachFilter.value;
      coachCards.forEach(card => {
        if (val === 'all' || card.dataset.specialty === val) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  /* --------------------------------------------------------
     TESTIMONIALS CAROUSEL
     -------------------------------------------------------- */
  const track = document.querySelector('.testimonials-track');
  const testimonials = document.querySelectorAll('.testimonial-card');
  const carouselPrev = document.querySelector('.carousel-prev');
  const carouselNext = document.querySelector('.carousel-next');
  let currentTestimonial = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentTestimonial * 100}%)`;
  }

  if (carouselNext) {
    carouselNext.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      updateCarousel();
    });
  }

  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      updateCarousel();
    });
  }

  /* --------------------------------------------------------
     GALLERY LIGHTBOX
     -------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let lightboxIndex = 0;

  const gallerySrcs = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img') || item.querySelector('svg');
    if (img && img.tagName === 'IMG') return img.src;
    if (img && img.tagName === 'svg') {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(img);
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
    }
    return '';
  });

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = gallerySrcs[lightboxIndex];
    lightboxImg.alt = `Gallery image ${lightboxIndex + 1}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLightbox(i); });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex + 1) % gallerySrcs.length;
      lightboxImg.src = gallerySrcs[lightboxIndex];
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
      lightboxImg.src = gallerySrcs[lightboxIndex];
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
      if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    });
  }

  /* --------------------------------------------------------
     FAQ ACCORDION
     -------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* --------------------------------------------------------
     ENQUIRY FORM VALIDATION & SUBMISSION
     -------------------------------------------------------- */
  const form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();

    const name = form.querySelector('#fullName');
    const phone = form.querySelector('#phone');
    const email = form.querySelector('#email');
    const age = form.querySelector('#traineeAge');
    const program = form.querySelector('#programSelect');
    const callback = form.querySelector('#callbackTime');
    const message = form.querySelector('#message');
    const consent = form.querySelector('#consent');

    let valid = true;

    if (!name.value.trim()) {
      showFieldError(name, 'Full name is required');
      valid = false;
    }

    if (!phone.value.trim()) {
      showFieldError(phone, 'Phone number is required');
      valid = false;
    } else if (!/^[\d\s\-+()]{7,15}$/.test(phone.value.trim())) {
      showFieldError(phone, 'Enter a valid phone number');
      valid = false;
    }

    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showFieldError(email, 'Enter a valid email address');
      valid = false;
    }

    if (!age.value.trim()) {
      showFieldError(age, 'Age is required');
      valid = false;
    } else if (isNaN(age.value) || +age.value < 3 || +age.value > 60) {
      showFieldError(age, 'Enter a valid age (3–60)');
      valid = false;
    }

    if (!consent.checked) {
      showToast('Please agree to the consent checkbox', 'error');
      valid = false;
    }

    if (!valid) return;

    const data = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      age: age.value.trim(),
      program: program.value,
      callbackTime: callback.value,
      message: message.value.trim(),
      submittedAt: new Date().toISOString()
    };

    saveToLocalStorage(data);
    showToast('Enquiry submitted successfully! We will call you back soon.', 'success');
    form.reset();
  }

  function showFieldError(field, msg) {
    field.classList.add('error');
    const errEl = field.parentElement.querySelector('.error-msg');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('show');
    }
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
  }

  function saveToLocalStorage(data) {
    const existing = JSON.parse(localStorage.getItem('fca_enquiries') || '[]');
    existing.push(data);
    localStorage.setItem('fca_enquiries', JSON.stringify(existing));
  }

  /* Mailto fallback */
  const mailtoBtn = document.getElementById('mailtoFallback');
  if (mailtoBtn) {
    mailtoBtn.addEventListener('click', () => {
      const name = form.querySelector('#fullName').value || '';
      const phone = form.querySelector('#phone').value || '';
      const email = form.querySelector('#email').value || '';
      const age = form.querySelector('#traineeAge').value || '';
      const program = form.querySelector('#programSelect').value || '';
      const message = form.querySelector('#message').value || '';

      const subject = encodeURIComponent('Enquiry from Website');
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAge: ${age}\nProgram: ${program}\nMessage: ${message}`
      );

      window.location.href = `mailto:info@.example.com?subject=${subject}&body=${body}`;
    });
  }

  /* --------------------------------------------------------
     TOAST NOTIFICATIONS
     -------------------------------------------------------- */
  function showToast(msg, type = 'info') {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 4200);
  }

  window.showToast = showToast;

  /* --------------------------------------------------------
     SCROLL-TO-TOP BUTTON
     -------------------------------------------------------- */
  const scrollTopBtn = document.querySelector('.scroll-top');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --------------------------------------------------------
     SMOOTH SCROLL POLYFILL (anchor links)
     -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
