document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    // ======== INITIALIZATION ========
    
    // Initialize AOS animation
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        disable: 'mobile'
    });

    // ======== THEME TOGGLE FUNCTIONALITY ========
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check for saved theme preference or default to user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.textContent = '🌙';
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        // Check user preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-theme');
            themeIcon.textContent = '🌙';
        }
    }

    // Theme toggle click event with animation
    themeToggle.addEventListener('click', function() {
        themeToggle.classList.add('rotate-animation');
        
        setTimeout(() => {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                themeIcon.textContent = '☀️';
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.add('dark-theme');
                themeIcon.textContent = '🌙';
                localStorage.setItem('theme', 'dark');
            }
            
            setTimeout(() => {
                themeToggle.classList.remove('rotate-animation');
            }, 300);
        }, 150);
    });

    // ======== TYPEWRITER EFFECT ========
    // Array of roles for typewriter effect
    const roles = [
        "Software Engineer",
        "Technical Solutions Architect",
        "Frontend Engineer",
        "Backend Engineer",
        "API Integration Specialist",
        "Mobile Application Developer",
        "Creative Web Designer",
        "UI/UX Engineer",
        "Full Stack Web Developer"
    ];
    
    // Initialize Typed.js
    if (document.getElementById('typewriter')) {
        const typed = new Typed('#typewriter', {
            strings: roles,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 1000,
            loop: true,
            smartBackspace: true
        });
    }

    // ======== PROJECT FILTERING FUNCTIONALITY ========
    // Project filtering functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    // Initialize with 'All Projects' selected
    filterProjects('all');
    
    // Add click event to filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and add to clicked button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            filterProjects(filterValue);
        });
    });
    
    // Filter projects function
    function filterProjects(category) {
        projectItems.forEach(item => {
            // If 'all' is selected or item has the selected category class
            if (category === 'all' || item.classList.contains(category)) {
                // Show the item with animation
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 200);
            } else {
                // Hide the item with animation
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Refresh AOS animations after filtering
        setTimeout(() => {
            AOS.refresh();
        }, 500);
    }
    
    // Animate project items on load
    setTimeout(() => {
        projectItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        });
    }, 200);

    // ======== NAVIGATION AND SCROLL EFFECTS ========
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // Active link updating on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced back to top button with smooth animation
    const backToTopButton = document.querySelector('.back-to-top');
    
    // Show/hide back to top button with smooth fade effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            if (!backToTopButton.classList.contains('active')) {
                backToTopButton.classList.add('active');
                backToTopButton.style.transition = 'all 0.4s cubic-bezier(0.5, 0, 0.3, 1.5)';
            }
        } else {
            if (backToTopButton.classList.contains('active')) {
                backToTopButton.style.transition = 'all 0.3s ease-out';
                backToTopButton.classList.remove('active');
            }
        }
    });

    // Back to top button click handler with elegant animation
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add pulse animation effect before scrolling
        backToTopButton.classList.add('pulse-animation');
        
        // Get current scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const duration = 800; // ms
        const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        // Smooth scroll with custom easing
        const scrollToTop = (timestamp) => {
            const start = performance.now();
            
            const step = (timestamp) => {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                
                window.scrollTo(0, scrollTop * (1 - easeInOutQuad(progress)));
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    // Animation complete - remove pulse effect
                    setTimeout(() => {
                        backToTopButton.classList.remove('pulse-animation');
                    }, 300);
                }
            };
            
            window.requestAnimationFrame(step);
        };
        
        window.requestAnimationFrame(scrollToTop);
    });

    // ======== CONTACT FORM HANDLING ========
    // Handle contact form submission with Formspree
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        // Input animation for form fields
        const formInputs = contactForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('input-focused');
            });
            
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('input-focused');
                }
            });
            
            // Check if input already has value (e.g., on page refresh)
            if (input.value !== '') {
                input.parentElement.classList.add('input-focused');
            }
        });
        
        // Form validation and submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple client-side validation
            let isValid = true;
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
                
                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value.trim())) {
                        isValid = false;
                        input.classList.add('is-invalid');
                    }
                }
            });
            
            if (!isValid) {
                formMessage.textContent = 'Please fill all required fields correctly.';
                formMessage.classList.add('error');
                return;
            }
            
            const formData = new FormData(contactForm);
            const action = contactForm.getAttribute('action');
            
            // Show loading spinner
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            submitBtn.disabled = true;
            
            formMessage.textContent = 'Sending message...';
            formMessage.classList.remove('success', 'error');
            
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                // Show success message
                formMessage.textContent = 'Message sent successfully!';
                formMessage.classList.add('success');
                
                // Add success animation to form
                contactForm.classList.add('form-success-animation');
                
                // Reset form
                contactForm.reset();
                
                // Reset form input styles
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('input-focused');
                });
                
                // Clear success message and animation after delay
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.classList.remove('success');
                    contactForm.classList.remove('form-success-animation');
                }, 5000);
            })
            .catch(error => {
                // Show error message
                formMessage.textContent = 'Error sending message. Please try again.';
                formMessage.classList.add('error');
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // ======== GENERAL UI ENHANCEMENTS ========
    // Set current year in footer copyright
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Handle mobile navigation collapse
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarMenuLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navbarMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                navbarCollapse.classList.remove('show');
            }
        });
    });

    // Navbar accessible keyboard navigation
    navbarMenuLinks.forEach(link => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                link.click();
            }
        });
    });

    // ======== SKILL ANIMATION ========
    // Animate skill progress bars when they come into view
    const progressBars = document.querySelectorAll('.progress-bar');
    const animateProgress = () => {
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isInView = (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
            
            if (isInView && !bar.classList.contains('animated')) {
                const value = bar.getAttribute('aria-valuenow') + '%';
                bar.classList.add('animated');
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = value;
                }, 100);
            }
        });
    };
    
    // Initial check and scroll listener for progress animation
    animateProgress();
    window.addEventListener('scroll', animateProgress);

    // ======== LAZY LOADING IMAGES ========
    // Enhanced lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.removeAttribute('data-src');
                        lazyImage.classList.add('fade-in-image');
                    }
                    observer.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(lazyImage => {
            imageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers without intersection observer
        let active = false;
        
        const lazyLoad = () => {
            if (active === false) {
                active = true;
                
                setTimeout(() => {
                    lazyImages.forEach(lazyImage => {
                        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== 'none') {
                            if (lazyImage.dataset.src) {
                                lazyImage.src = lazyImage.dataset.src;
                                lazyImage.removeAttribute('data-src');
                                lazyImage.classList.add('fade-in-image');
                            }
                            
                            lazyImages = Array.from(lazyImages).filter(image => image !== lazyImage);
                            
                            if (lazyImages.length === 0) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationchange', lazyLoad);
                            }
                        }
                    });
                    
                    active = false;
                }, 200);
            }
        };
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
    }
    
    // ======== PORTFOLIO ITEM HOVER EFFECTS ========
    // Enhanced hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
    });
    
    // ======== PRELOADER ========
    // Hide preloader after page load
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('preloader-hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        });
    }
});