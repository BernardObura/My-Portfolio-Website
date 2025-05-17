// Selectors for DOM elements
const SELECTORS = {
  PRELOADER: '#preloader',
  CURRENT_YEAR: '#current-year',
  BACK_TO_TOP: '#back-to-top',
  HEADER: '#header',
  THEME_TOGGLE: '#theme-toggle',
  NAV_LINKS: '.nav-link',
  NAVBAR_COLLAPSE: '.navbar-collapse',
  SECTIONS: 'section',
  PARTICLES: '#particles-js',
  TYPEWRITER: '#typewriter',
  FILTER_BUTTONS: '.filter-btn',
  PROJECT_ITEMS: '.project-item',
  PHONE: '#phone',
  CONTACT_FORM: '#contact-form',
};

// Scroll offsets for UI behavior
const SCROLL_OFFSETS = {
  BACK_TO_TOP_VISIBLE: 300,
  HEADER_SCROLLED: 100,
  SECTION_ACTIVE_OFFSET: 50,
};

// Debounce utility to limit function calls
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS animation library
  try {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  } catch (error) {
    console.error('AOS initialization failed:', error);
  }

  // Preloader
  const preloader = document.querySelector(SELECTORS.PRELOADER);
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  // Current year for footer
  const currentYear = document.querySelector(SELECTORS.CURRENT_YEAR);
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Back to top button
  const backToTopButton = document.querySelector(SELECTORS.BACK_TO_TOP);
  if (backToTopButton) {
    const handleScroll = debounce(() => {
      // Show/hide back-to-top button
      if (window.scrollY > SCROLL_OFFSETS.BACK_TO_TOP_VISIBLE) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }

      // Header scroll class
      const header = document.querySelector(SELECTORS.HEADER);
      if (header) {
        if (window.scrollY > SCROLL_OFFSETS.HEADER_SCROLLED) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // Theme Toggle
  const themeToggle = document.querySelector(SELECTORS.THEME_TOGGLE);
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-label', 'Switch to light theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.setAttribute(
        'aria-label',
        `Switch to ${newTheme === 'light' ? 'dark' : 'light'} theme`
      );
    });
  }

  // Menu navigation scrolling
  const navLinks = document.querySelectorAll(SELECTORS.NAV_LINKS);
  const navbarCollapse = document.querySelector(SELECTORS.NAVBAR_COLLAPSE);

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.hash) {
        e.preventDefault();
        const hash = link.hash;
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          const header = document.querySelector(SELECTORS.HEADER);
          const headerHeight = header ? header.offsetHeight : 0;

          window.scrollTo({
            top: targetElement.offsetTop - headerHeight,
            behavior: 'smooth',
          });

          // Collapse mobile menu
          if (navbarCollapse?.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
          }

          // Update active link
          navLinks.forEach((navLink) => {
            navLink.classList.remove('active');
            navLink.removeAttribute('aria-current');
          });
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');

          window.history.pushState(null, null, hash);
        }
      }
    });
  });

  // Set active nav link based on scroll position
  const updateActiveNav = debounce(() => {
    const scrollPosition =
      window.scrollY +
      (document.querySelector(SELECTORS.HEADER)?.offsetHeight || 0) +
      SCROLL_OFFSETS.SECTION_ACTIVE_OFFSET;

    document.querySelectorAll(SELECTORS.SECTIONS).forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }, 100);

  window.addEventListener('scroll', updateActiveNav);

  // Initialize Particles.js
  if (document.querySelector(SELECTORS.PARTICLES)) {
    try {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#3b82f6' },
          shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
          opacity: { value: 0.5, random: false, anim: { enable: false } },
          size: { value: 3, random: true, anim: { enable: false } },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#3b82f6',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 },
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 },
          },
        },
        retina_detect: true,
      });
    } catch (error) {
      console.error('Particles.js initialization failed:', error);
    }
  }

  // Initialize Typed.js
  if (document.querySelector(SELECTORS.TYPEWRITER)) {
    try {
      new Typed(SELECTORS.TYPEWRITER, {
        strings: [
          'Software Developer',
          'Full Stack Developer',
          'Frontend Specialist',
          'Backend Developer',
          'UI/UX Enthusiast',
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });
    } catch (error) {
      console.error('Typed.js initialization failed:', error);
    }
  }

  // Projects filtering
  const filterButtons = document.querySelectorAll(SELECTORS.FILTER_BUTTONS);
  const projectItems = document.querySelectorAll(SELECTORS.PROJECT_ITEMS);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectItems.forEach((item) => {
        if (
          filterValue === 'all' ||
          item.getAttribute('data-category') === filterValue
        ) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });

      setTimeout(() => AOS.refresh(), 500);
    });
  });

  // Initialize International Telephone Input
  const phoneInput = document.querySelector(SELECTORS.PHONE);
  let iti = null;
  if (phoneInput) {
    try {
      if (window.intlTelInput) {
        iti = window.intlTelInput(phoneInput, {
          utilsScript:
            'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
          preferredCountries: ['ke', 'us', 'gb'],
          separateDialCode: true,
        });
      } else {
        console.warn('intlTelInput not loaded; phone validation disabled');
        phoneInput.type = 'text'; // Fallback to text input
      }
    } catch (error) {
      console.error('intlTelInput initialization failed:', error);
      phoneInput.type = 'text'; // Fallback
    }
  }

  // Lazy loading images
  const lazyLoad = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            image.classList.add('loaded');
            imageObserver.unobserve(image);
          }
        });
      });

      lazyImages.forEach((image) => imageObserver.observe(image));
    } else {
      // Fallback for older browsers
      let lazyLoadThrottleTimeout;
      const lazyLoadImages = () => {
        if (lazyLoadThrottleTimeout) {
          clearTimeout(lazyLoadThrottleTimeout);
        }

        lazyLoadThrottleTimeout = setTimeout(() => {
          const scrollTop = window.pageYOffset;

          lazyImages.forEach((img) => {
            if (img.offsetTop < window.innerHeight + scrollTop) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
            }
          });

          if (lazyImages.length === 0) {
            document.removeEventListener('scroll', lazyLoadImages);
            window.removeEventListener('resize', lazyLoadImages);
            window.removeEventListener('orientationChange', lazyLoadImages);
          }
        }, 20);
      };

      document.addEventListener('scroll', lazyLoadImages);
      window.addEventListener('resize', lazyLoadImages);
      window.addEventListener('orientationChange', lazyLoadImages);
      lazyLoadImages(); // Initial call
    }
  };

  lazyLoad();

  // Form validation and submission
  const initializeFormEventListeners = () => {
    const contactForm = document.querySelector(SELECTORS.CONTACT_FORM);

    if (contactForm) {
      const formInputs = contactForm.querySelectorAll('input, textarea');
      formInputs.forEach((input) => {
        input.addEventListener('blur', function () {
          validateInput(this);
        });
      });

      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
          submitForm();
        }
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const form = document.querySelector(SELECTORS.CONTACT_FORM);
    const formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach((input) => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const validateInput = (input) => {
    let isValid = true;

    // Allow empty optional fields
    if (!input.required && input.value.trim() === '') {
      setValid(input);
      return true;
    }

    // Check required fields
    if (input.required && input.value.trim() === '') {
      setInvalid(input, 'This field is required');
      return false;
    }

    // Validate email
    if (input.type === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(input.value.trim())) {
        setInvalid(input, 'Please enter a valid email address');
        return false;
      }
    }

    // Validate phone (optional, only if non-empty and intlTelInput is available)
    if (input.type === 'tel' && input.value.trim() !== '' && iti) {
      if (!iti.isValidNumber()) {
        setInvalid(input, 'Please enter a valid phone number');
        return false;
      }
    }

    setValid(input);
    return true;
  };

  const setInvalid = (input, message) => {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    const feedbackEl = input.nextElementSibling;
    if (feedbackEl && feedbackEl.classList.contains('invalid-feedback')) {
      feedbackEl.textContent = message;
    }
  };

  const setValid = (input) => {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  };

  const submitForm = () => {
    const form = document.querySelector(SELECTORS.CONTACT_FORM);
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Create or reuse success message
    let successMessage = document.querySelector('.success-message');
    if (!successMessage) {
      successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.innerHTML =
        '<i class="fas fa-check-circle"></i> Your message has been sent successfully. I\'ll get back to you soon!';
      form.parentNode.insertBefore(successMessage, form);
    }

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        successMessage.classList.add('show');
        form.style.display = 'none';
        form.reset();
        form.querySelectorAll('input, textarea').forEach((input) => {
          input.classList.remove('is-valid', 'is-invalid');
        });
        setTimeout(() => {
          form.style.display = 'block';
          successMessage.classList.remove('show');
        }, 5000);
      })
      .catch((error) => {
        console.error('Form submission error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger mt-3';
        errorMessage.textContent =
          'There was an error submitting the form. Please try again later.';
        form.parentNode.insertBefore(errorMessage, form.nextSibling);
        form.style.display = 'block';
        form.querySelectorAll('input, textarea').forEach((input) => {
          input.classList.remove('is-valid', 'is-invalid');
        });
        setTimeout(() => {
          errorMessage.remove();
        }, 5000);
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
      });
  };

  initializeFormEventListeners();
});