// HelixCode Mobile - JavaScript

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initTheme();
    initScrollToTop();
    initExpandableFeatures();
    initSmoothScroll();
    initTouchGestures();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav-link');

    // Open menu
    menuToggle.addEventListener('click', function() {
        mobileNav.classList.add('active');
        mobileOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close menu
    function closeMenu() {
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    navClose.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('themeToggleMobile');
    const html = document.documentElement;

    // Get saved theme or default to system preference
    let currentTheme = localStorage.getItem('theme');

    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply theme
    html.setAttribute('data-theme', currentTheme);

    // Toggle theme
    themeToggle.addEventListener('click', function() {
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        showToast(newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
        }
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
}

// Expandable Features
function toggleExpand(button) {
    const card = button.closest('.feature-card-mobile');
    const details = card.querySelector('.feature-details');

    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        button.textContent = 'Learn More';
    } else {
        details.classList.add('expanded');
        button.textContent = 'Show Less';

        // Scroll to make content visible
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Smooth Scroll for Navigation
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#hero' || targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 70; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll to Section Helper
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 70;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Touch Gestures
function initTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const menuToggle = document.getElementById('mobileMenuToggle');

    // Swipe to close menu
    mobileNav.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mobileNav.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        // Swipe right to close
        if (touchEndX > touchStartX + 50 && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Pull to refresh (optional - disabled by default to avoid conflicts)
    // Uncomment if you want pull-to-refresh functionality
    /*
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        touchEndY = e.touches[0].clientY;
        if (window.scrollY === 0 && touchEndY > touchStartY + 100) {
            // Pull to refresh logic here
        }
    }, { passive: true });
    */
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${getToastIcon(type)}</span>
        <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'warning': return '⚠';
        default: return 'ℹ';
    }
}

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

        // Log performance metrics (optional)
        console.log('Page Load Time:', pageLoadTime + 'ms');
    });
}

// Service Worker Registration (for PWA support - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        /*
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
        */
    });
}

// Network Status Detection
window.addEventListener('online', function() {
    showToast('Back online!', 'success');
});

window.addEventListener('offline', function() {
    showToast('You are offline', 'warning');
});

// Viewport Height Fix for Mobile Browsers
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Prevent zoom on double-tap (optional - be careful with accessibility)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Image Lazy Loading (for better performance)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Analytics tracking (placeholder - replace with your analytics)
function trackEvent(category, action, label) {
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }

    console.log('Event tracked:', category, action, label);
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn, .btn-primary-mobile, .btn-secondary-mobile, .btn-download-mobile')) {
        const buttonText = e.target.textContent.trim();
        trackEvent('Button', 'Click', buttonText);
    }
});

// Export functions for global use
window.toggleExpand = toggleExpand;
window.scrollToSection = scrollToSection;
window.showToast = showToast;
