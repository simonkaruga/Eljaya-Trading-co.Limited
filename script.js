/**
 * Eljaya Trading Co. - WordPress Standard JavaScript
 * Version: 1.0
 * Description: Clean, modular JavaScript for brand website
 */

(function() {
    'use strict';

    /* ===== PRELOADER ===== */
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
    });

    /* ===== HEADER SCROLL EFFECT ===== */
    const header = document.querySelector('.site-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    /* ===== MOBILE MENU TOGGLE ===== */
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('site-navigation');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            const isExpanded = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu on link click
        const menuLinks = mainNav.querySelectorAll('.menu-item a');
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    /* ===== SMOOTH SCROLL ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /* ===== SCROLL TO TOP BUTTON ===== */
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Make scrollToTop available globally
    window.scrollToTop = scrollToTop;
    
    /* ===== ANIMATED COUNTER ===== */
    function animateCounter(element, target, duration) {
        duration = duration || 2000;
        const startTime = performance.now();
        function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            element.textContent = Math.floor(easeOut(progress) * target);
            if (progress < 1) requestAnimationFrame(tick);
            else element.textContent = target;
        }
        requestAnimationFrame(tick);
    }
    
    /* ===== INTERSECTION OBSERVER FOR STATS ===== */
    const statElements = document.querySelectorAll('.stat-value');
    
    if (statElements.length > 0) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    animateCounter(entry.target, target);
                }
            });
        }, { threshold: 0.5 });
        
        statElements.forEach(function(stat) {
            statsObserver.observe(stat);
        });
    }
    
    /* ===== AOS (ANIMATE ON SCROLL) ===== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(function(element) {
        observer.observe(element);
    });
    
    /* ===== TESTIMONIALS CAROUSEL ===== */
    const testimonialTrack = document.getElementById('testimonialTrack');
    const carouselDots = document.getElementById('carouselDots');
    let currentTestimonial = 0;
    let testimonialInterval;

    function initDots() {
        if (!testimonialTrack || !carouselDots) return;
        const items = testimonialTrack.querySelectorAll('.testimonial-item');
        carouselDots.innerHTML = '';
        items.forEach(function(_, index) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', function() { goToTestimonial(index); });
            carouselDots.appendChild(dot);
        });
    }

    function showTestimonial(index) {
        if (!testimonialTrack) return;
        const width = testimonialTrack.parentElement.offsetWidth;
        testimonialTrack.style.transform = `translateX(-${index * width}px)`;
        document.querySelectorAll('.carousel-dot').forEach(function(dot, i) {
            dot.classList.toggle('active', i === index);
        });
    }

    function prevTestimonial() {
        const count = testimonialTrack ? testimonialTrack.querySelectorAll('.testimonial-item').length : 0;
        currentTestimonial = (currentTestimonial - 1 + count) % count;
        showTestimonial(currentTestimonial);
        resetTestimonialInterval();
    }

    function nextTestimonial() {
        const count = testimonialTrack ? testimonialTrack.querySelectorAll('.testimonial-item').length : 0;
        currentTestimonial = (currentTestimonial + 1) % count;
        showTestimonial(currentTestimonial);
        resetTestimonialInterval();
    }

    function goToTestimonial(index) {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
        resetTestimonialInterval();
    }

    function startTestimonialInterval() {
        testimonialInterval = setInterval(function() { nextTestimonial(); }, 5000);
    }

    function resetTestimonialInterval() {
        clearInterval(testimonialInterval);
        startTestimonialInterval();
    }

    window.prevTestimonial = prevTestimonial;
    window.nextTestimonial = nextTestimonial;

    if (testimonialTrack && carouselDots) {
        initDots();
        startTestimonialInterval();
        
        // Update on resize
        window.addEventListener('resize', function() {
            showTestimonial(currentTestimonial);
        });
    }
    

    
    /* ===== NOTIFICATION SYSTEM ===== */
    function showNotification(message, type) {
        type = type || 'success';
        
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? 'var(--color-primary)' : '#f44336'};
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            animation: slideInRight 0.4s ease;
            font-size: 1rem;
            max-width: 400px;
        `;
        
        // Add notification styles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(500px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(500px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(function() {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 400);
        }, 4000);
    }
    
    /* ===== ACTIVE NAV HIGHLIGHTING ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.menu-item a');
    
    function highlightNav() {
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
    
    const debouncedHighlight = debounce(highlightNav, 100);
    window.addEventListener('scroll', debouncedHighlight);
    
    /* ===== CONTACT FORM HANDLING ===== */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            if (!data.name || !data.email || !data.phone || !data.service || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            if (typeof emailjs === 'undefined') {
                showNotification('Email service unavailable. Please call us at +254 718 146 386.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }

            emailjs.send('YOUR_EMAILJS_SERVICE_ID', 'YOUR_EMAILJS_TEMPLATE_ID', {
                from_name: data.name,
                from_email: data.email,
                phone: data.phone,
                company: data.company || 'Not provided',
                service: data.service,
                message: data.message
            }).then(function() {
                showNotification('Message sent! We\'ll be in touch shortly.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, function(error) {
                console.error('EmailJS error:', error);
                showNotification('Failed to send message. Please call us at +254 718 146 386.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    /* ===== LAZY LOAD IMAGES ===== */
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(function(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
    
    /* ===== CONSOLE BRANDING ===== */
    console.log('%c🚀 Eljaya Trading Co. Limited', 'color: #00a859; font-size: 24px; font-weight: bold;');
    console.log('%cStrategic Brand Development', 'color: #4CAF50; font-size: 18px; font-style: italic;');
    console.log('%cInterested in elevating your brand? Contact: eljayasupplies@gmail.com | +254 718 146 386', 'color: #FFD700; font-size: 14px;');
    
    /* ===== INITIALIZATION ===== */
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ Website initialized successfully');
        
        // Add loaded class to body
        setTimeout(function() {
            document.body.classList.add('loaded');
        }, 500);
    });
    
})();

/* ===== END OF SCRIPT ===== */

/* ===== END OF SCRIPT ===== */