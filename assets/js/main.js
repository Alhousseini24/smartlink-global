/* ============================================
   SMARTLINK GLOBAL - MAIN.JS
   Fonctionnalités principales du site
   Version 1.0
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const CONFIG = {
        headerHeight: 80,
        mobileBreakpoint: 991,
        scrollOffset: 100,
        animationDelay: 200,
        toastDuration: 5000
    };

    // ============================================
    // DOM RÉFÉRENCES
    // ============================================
    
    const DOM = {
        navbar: document.getElementById('navbar'),
        navbarToggler: document.getElementById('navbarToggler'),
        navbarCollapse: document.getElementById('navbarCollapse'),
        backToTop: document.getElementById('backToTop'),
        scrollProgress: document.getElementById('scrollProgress'),
        mainContent: document.getElementById('main-content'),
        dropdownToggles: document.querySelectorAll('.dropdown-toggle'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        portfolioItems: document.querySelectorAll('.portfolio-item')
    };

    // ============================================
    // NAVBAR - SCROLL EFFECT
    // ============================================
    
    function handleNavbarScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > CONFIG.scrollOffset) {
            DOM.navbar.classList.add('scrolled');
        } else {
            DOM.navbar.classList.remove('scrolled');
        }
    }

    // ============================================
    // NAVBAR - MOBILE MENU
    // ============================================
    
    function toggleMobileMenu() {
        const isOpen = DOM.navbarCollapse.classList.toggle('active');
        DOM.navbarToggler.setAttribute('aria-expanded', isOpen);
        
        const icon = DOM.navbarToggler.querySelector('i');
        if (isOpen) {
            icon.className = 'fas fa-times';
            document.body.style.overflow = 'hidden';
        } else {
            icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    }

    function closeMobileMenu() {
        DOM.navbarCollapse.classList.remove('active');
        DOM.navbarToggler.setAttribute('aria-expanded', 'false');
        DOM.navbarToggler.querySelector('i').className = 'fas fa-bars';
        document.body.style.overflow = '';
    }

    // Fermer le menu sur resize (passage en desktop)
    function handleResize() {
        if (window.innerWidth > CONFIG.mobileBreakpoint) {
            closeMobileMenu();
        }
    }

    // ============================================
    // NAVBAR - DROPDOWNS MOBILE
    // ============================================
    
    function handleDropdownToggles() {
        DOM.dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                // Ne fonctionne qu'en mobile
                if (window.innerWidth <= CONFIG.mobileBreakpoint) {
                    e.preventDefault();
                    const parent = this.closest('.dropdown');
                    const menu = parent.querySelector('.dropdown-menu');
                    
                    // Fermer les autres dropdowns
                    DOM.dropdownToggles.forEach(other => {
                        if (other !== this) {
                            const otherParent = other.closest('.dropdown');
                            const otherMenu = otherParent.querySelector('.dropdown-menu');
                            if (otherMenu) {
                                otherMenu.classList.remove('active');
                                other.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });
                    
                    if (menu) {
                        const isOpen = menu.classList.toggle('active');
                        this.setAttribute('aria-expanded', isOpen);
                    }
                }
            });
        });
    }

    // ============================================
    // BACK TO TOP
    // ============================================
    
    function handleBackToTop() {
        const scrollY = window.scrollY;
        
        if (scrollY > window.innerHeight) {
            DOM.backToTop.classList.add('visible');
        } else {
            DOM.backToTop.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    
    function updateScrollProgress() {
        const scrollY = window.scrollY;
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;
        
        DOM.scrollProgress.style.width = progress + '%';
        DOM.scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
    }

    // ============================================
    // PORTFOLIO FILTER
    // ============================================
    
    function initPortfolioFilter() {
        if (!DOM.filterBtns.length) return;

        DOM.filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Retirer la classe active de tous les filtres
                DOM.filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.filter;
                
                DOM.portfolioItems.forEach(item => {
                    const category = item.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        // Animation d'apparition
                        item.style.animation = 'scaleIn 0.4s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ============================================
    // ACTIVE LINK DETECTION
    // ============================================
    
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href)) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    // ============================================
    // COOKIE CONSENT
    // ============================================
    
    function initCookieConsent() {
        const hasConsent = localStorage.getItem('cookieConsent');
        
        if (!hasConsent) {
            const consentBanner = document.createElement('div');
            consentBanner.id = 'cookieConsent';
            consentBanner.setAttribute('role', 'dialog');
            consentBanner.setAttribute('aria-label', 'Gestion des cookies');
            consentBanner.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--black-premium);
                color: var(--gray-300);
                padding: var(--space-4);
                z-index: var(--z-toast);
                border-top: 1px solid rgba(255,255,255,0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: var(--space-3);
            `;
            
            consentBanner.innerHTML = `
                <div style="flex: 1; min-width: 250px;">
                    <p style="margin: 0; font-size: var(--text-sm);">
                        Nous utilisons des cookies pour améliorer votre expérience sur notre site.
                        <a href="pages/politique-confidentialite.html" style="color: var(--primary-gold);">En savoir plus</a>
                    </p>
                </div>
                <div style="display: flex; gap: var(--space-3);">
                    <button id="cookieAccept" class="btn btn-primary btn-sm">Accepter</button>
                    <button id="cookieDecline" class="btn btn-secondary btn-sm">Refuser</button>
                </div>
            `;
            
            document.body.appendChild(consentBanner);
            
            document.getElementById('cookieAccept').addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'accepted');
                consentBanner.remove();
                // Activer les analytics ici
                console.log('Cookies acceptés');
            });
            
            document.getElementById('cookieDecline').addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'declined');
                consentBanner.remove();
                console.log('Cookies refusés');
            });
        }
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    
    function initKeyboardNavigation() {
        // Escape pour fermer les menus
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (DOM.navbarCollapse.classList.contains('active')) {
                    closeMobileMenu();
                }
                
                // Fermer les dropdowns ouverts
                document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                    menu.classList.remove('active');
                    const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                });
            }
        });
        
        // Focus trap pour le menu mobile
        DOM.navbarToggler.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
    }

    // ============================================
    // PERFORMANCE - LAZY LOADING
    // ============================================
    
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // ============================================
    // SMOOTH SCROLL ANCHOR LINKS
    // ============================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const headerOffset = CONFIG.headerHeight;
                    
                    window.scrollTo({
                        top: offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                    
                    // Fermer le menu mobile si ouvert
                    if (DOM.navbarCollapse.classList.contains('active')) {
                        closeMobileMenu();
                    }
                }
            });
        });
    }

    // ============================================
    // TOAST NOTIFICATIONS
    // ============================================
    
    function showToast(message, type = 'info', duration = CONFIG.toastDuration) {
        const container = document.querySelector('.toast-container') || (() => {
            const div = document.createElement('div');
            div.className = 'toast-container';
            document.body.appendChild(div);
            return div;
        })();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="toast-close" aria-label="Fermer la notification">&times;</button>
        `;
        
        container.appendChild(toast);
        
        // Fermer au clic
        toast.querySelector('.toast-close').addEventListener('click', function() {
            removeToast(toast);
        });
        
        // Auto fermeture
        setTimeout(() => {
            removeToast(toast);
        }, duration);
        
        // Swipe pour fermer (mobile)
        let startX = 0;
        toast.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        toast.addEventListener('touchend', function(e) {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) {
                removeToast(toast);
            }
        });
    }
    
    function removeToast(toast) {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    // ============================================
    // INITIALISATION
    // ============================================
    
    function init() {
        // Navbar
        handleNavbarScroll();
        window.addEventListener('scroll', () => {
            handleNavbarScroll();
            handleBackToTop();
            updateScrollProgress();
        });
        
        // Mobile menu
        DOM.navbarToggler.addEventListener('click', toggleMobileMenu);
        window.addEventListener('resize', handleResize);
        
        // Dropdowns
        handleDropdownToggles();
        
        // Back to top
        DOM.backToTop.addEventListener('click', scrollToTop);
        
        // Portfolio filter
        initPortfolioFilter();
        
        // Active nav link
        setActiveNavLink();
        
        // Cookie consent
        initCookieConsent();
        
        // Keyboard navigation
        initKeyboardNavigation();
        
        // Lazy loading
        initLazyLoading();
        
        // Smooth scroll
        initSmoothScroll();
        
        // Expose toast globally
        window.showToast = showToast;
        
        console.log('SMARTLINK GLOBAL - Site initialisé avec succès ✅');
        console.log(`Version: 1.0 | ${new Date().toLocaleDateString()}`);
    }

    // Démarrer au DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ============================================
// NAVBAR SIMPLIFIÉE - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // 1. Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile toggle
    if (navToggle && navMenu) {
        // Créer l'overlay
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('open');
            this.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        overlay.addEventListener('click', function() {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Fermer sur resize (passage desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 3. Dropdowns mobiles (accordéon)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Ne fonctionne qu'en mobile
            if (window.innerWidth <= 991) {
                e.preventDefault();
                const parent = this.closest('.dropdown');
                const menu = parent.querySelector('.dropdown-menu');
                
                // Fermer les autres dropdowns
                dropdownToggles.forEach(other => {
                    if (other !== this) {
                        const otherParent = other.closest('.dropdown');
                        const otherMenu = otherParent.querySelector('.dropdown-menu');
                        if (otherMenu) {
                            otherMenu.classList.remove('open');
                            other.classList.remove('open');
                        }
                    }
                });
                
                if (menu) {
                    menu.classList.toggle('open');
                    this.classList.toggle('open');
                }
            }
        });
    });

    // 4. Fermer le menu sur clic d'un lien (mobile)
    document.querySelectorAll('.nav-list a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 991) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                document.querySelector('.nav-overlay').classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
});