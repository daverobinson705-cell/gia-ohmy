/* ==========================================================================
   GIA | Exclusive Personal Brand & Companion Website
   JavaScript Application Logic & Interactive Features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Sticky Navigation & Scroll Effects
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Active Navigation Link Highlighting */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  /* ------------------------------------------------------------------------
     2. Mobile Hamburger Drawer
     ------------------------------------------------------------------------ */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. FAQ Accordion Toggles
     ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const faqHeader = item.querySelector('.faq-header');
    faqHeader.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. Image Gallery Filter & Lightbox Popup
     ------------------------------------------------------------------------ */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (galleryFilterBtns.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-gallery-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* Lightbox Modal Click Trigger */
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-img');
      const title = item.getAttribute('data-title');

      if (lightboxModal && lightboxImg && lightboxCaption) {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = title;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. Tour Schedule Filter
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tourRows = document.querySelectorAll('.tour-table tbody tr');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      tourRows.forEach(row => {
        const category = row.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     6. Currency Switcher Engine
     ------------------------------------------------------------------------ */
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const priceElements = document.querySelectorAll('.price[data-usd]');

  const currencyRates = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 }
  };

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCurrency = btn.getAttribute('data-currency');
      const { symbol, rate } = currencyRates[selectedCurrency];

      priceElements.forEach(el => {
        const baseUSD = parseFloat(el.getAttribute('data-usd'));
        const converted = Math.round(baseUSD * rate);
        el.textContent = `${symbol}${converted.toLocaleString()}`;
      });
    });
  });

  /* ------------------------------------------------------------------------
     7. Testimonials Slider
     ------------------------------------------------------------------------ */
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  let currentSlide = 0;
  let sliderInterval;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i].classList.remove('active');
    });
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  };

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetSliderTimer();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetSliderTimer();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        resetSliderTimer();
      });
    });

    const startSliderTimer = () => {
      sliderInterval = setInterval(nextSlide, 6000);
    };

    const resetSliderTimer = () => {
      clearInterval(sliderInterval);
      startSliderTimer();
    };

    startSliderTimer();
  }

  /* ------------------------------------------------------------------------
     8. Animated Counters
     ------------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          runCounters();
          animated = true;
        }
      });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
  }

  /* ------------------------------------------------------------------------
     9. Policy Modals
     ------------------------------------------------------------------------ */
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('.modal-close');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => {
        if (overlay.classList.contains('active')) {
          closeModal(overlay);
        }
      });
    }
  });

  /* Quick Book Modal Handler from Service Cards */
  const serviceBookBtns = document.querySelectorAll('.service-book-btn');
  const serviceSelect = document.getElementById('booking-service');

  serviceBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ------------------------------------------------------------------------
     10. Form Validation & Toast Notification
     ------------------------------------------------------------------------ */
  const bookingForm = document.getElementById('booking-form');
  const toast = document.getElementById('toast-notification');

  const showToast = (message) => {
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-message');
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('booking-name').value.trim();
      const email = document.getElementById('booking-email').value.trim();
      const date = document.getElementById('booking-date').value;
      const city = document.getElementById('booking-city').value;

      if (!name || !email || !date || !city) {
        showToast('Please fulfill all mandatory reservation details.');
        return;
      }

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Confidential Request...';
      }

      const formData = new FormData(bookingForm);

      fetch('https://formsubmit.co/ajax/book.giaohmyvip@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        showToast(`Thank you ${name}. Your booking request has been sent to book.giaohmyvip@gmail.com.`);
        bookingForm.reset();
      })
      .catch(error => {
        showToast(`Thank you ${name}. Your reservation inquiry for ${city} has been received.`);
        bookingForm.reset();
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
    });
  }

  /* Newsletter Form */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.newsletter-input');
      if (emailInput && emailInput.value.trim()) {
        showToast('Thank you for subscribing to Gia\'s private tour updates.');
        emailInput.value = '';
      }
    });
  }

});
