// HelixCode Website JavaScript

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getSystemTheme();
        this.init();
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    init() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('helixcode-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }

        // Set initial theme
        this.setTheme(this.currentTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (document.documentElement.getAttribute('data-theme') === 'auto') {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Theme toggle button (in navigation)
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Floating theme toggle button (top right)
        const floatingThemeToggle = document.getElementById('floatingThemeToggle');
        if (floatingThemeToggle) {
            floatingThemeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Update theme icons
        this.updateThemeIcons();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('helixcode-theme', theme);
        this.updateThemeIcons();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);

        // Show theme change toast
        showToast(`Switched to ${newTheme} theme`, 'info');
    }

    updateThemeIcons() {
        // Update floating theme toggle icons
        const sunIcons = document.querySelectorAll('.theme-icon-floating.sun');
        const moonIcons = document.querySelectorAll('.theme-icon-floating.moon');

        if (this.currentTheme === 'light') {
            // Show moon icon (to switch to dark)
            sunIcons.forEach(icon => icon.style.display = 'none');
            moonIcons.forEach(icon => icon.style.display = 'inline-block');
        } else {
            // Show sun icon (to switch to light)
            sunIcons.forEach(icon => icon.style.display = 'inline-block');
            moonIcons.forEach(icon => icon.style.display = 'none');
        }
    }
}

// Toast System
class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        this.toasts = [];
    }

    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);

        return toast;
    }

    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        // Scroll event for navbar
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Smooth scrolling for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Navbar background on scroll
        if (scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Update active nav link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120; // Updated offset to match hero padding

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 120; // Updated offset to match hero padding
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Particle System


// Animation Observer
class AnimationObserver {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);

        // Observe elements with data-aos attribute
        document.querySelectorAll('[data-aos]').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        const animation = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'all 0.6s ease-out';
        }, parseInt(delay));
    }
}

// Global Functions
function showToast(message, type = 'info') {
    if (window.toastManager) {
        window.toastManager.show(message, type);
    }
}

function scrollToSection(sectionId) {
    if (window.navigationManager) {
        window.navigationManager.scrollToSection(sectionId);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Detect low-performance devices and enable lightweight mode
    const isLowPerformanceDevice = 
        navigator.hardwareConcurrency < 4 || 
        !navigator.gpu ||
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isLowPerformanceDevice) {
        document.body.classList.add('low-performance-mode');
        console.log('📱 Lightweight mode enabled for better performance');
    }

    // Initialize managers
    window.themeManager = new ThemeManager();
    window.toastManager = new ToastManager();
    window.navigationManager = new NavigationManager();
    window.animationObserver = new AnimationObserver();

    // Add initial styles for animated elements
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });

    // Demo terminal typing effect
    const terminalLines = document.querySelectorAll('.terminal-line');
    let delay = 0;
    
    terminalLines.forEach((line, index) => {
        if (line.classList.contains('terminal-output')) {
            setTimeout(() => {
                line.style.animation = 'typewriter 0.5s ease-in-out';
            }, delay);
            delay += 500;
        }
    });

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.className = 'ripple';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    console.log('🚀 HelixCode website initialized successfully!');
});

// Add ripple effect styles and floating button hover styles dynamically
const rippleStyles = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

#floatingThemeToggle:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 6px 16px rgba(14, 165, 233, 0.6) !important;
}

#floatingThemeToggle:active {
    transform: scale(0.95) !important;
}

.scroll-to-top:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 6px 16px rgba(14, 165, 233, 0.6) !important;
}

.scroll-to-top:active {
    transform: scale(0.95) !important;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);