/* ============================================
   SMARTLINK GLOBAL - ANIMATIONS.JS
   Animations GSAP et AOS
   Version 1.0
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // AOS INITIALISATION
    // ============================================
    
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 50,
                easing: 'ease-in-out',
                disable: window.innerWidth < 768 ? true : false,
                startEvent: 'DOMContentLoaded'
            });
            
            // Rafraîchir AOS après chargement des images
            window.addEventListener('load', function() {
                AOS.refresh();
            });
        }
    }

    // ============================================
    // GSAP ANIMATIONS
    // ============================================
    
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined') return;
        if (typeof ScrollTrigger === 'undefined') return;
        
        // Enregistrer le plugin ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // ==========================================
        // HERO ANIMATIONS
        // ==========================================
        
        // Animation du texte du hero
        const heroTitle = document.querySelector('.hero h1');
        const heroText = document.querySelector('.hero p');
        const heroActions = document.querySelector('.hero-actions');
        const heroBadge = document.querySelector('.hero-badge');
        const heroFloating = document.querySelector('.hero-floating');
        const heroTrust = document.querySelector('.hero-trust');
        
        if (heroTitle) {
            // Timeline pour le hero
            const heroTL = gsap.timeline({
                defaults: { ease: 'power3.out' }
            });
            
            heroTL
                .from(heroBadge, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8
                })
                .from(heroTitle, {
                    opacity: 0,
                    y: 40,
                    duration: 1,
                    delay: 0.2
                })
                .from(heroText, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    delay: 0.2
                })
                .from(heroActions, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    delay: 0.3
                })
                .from(heroTrust, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    delay: 0.3
                })
                .from(heroFloating, {
                    opacity: 0,
                    x: 100,
                    duration: 1,
                    delay: 0.5
                });
        }

        // ==========================================
        // STATISTIQUES - COUNTER ANIMATION
        // ==========================================
        
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const suffix = stat.querySelector('.suffix')?.textContent || '';
            
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                textContent: 0,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                onUpdate: function() {
                    const value = Math.round(this.targets()[0].textContent);
                    const suffixText = suffix || '';
                    stat.innerHTML = value + suffixText;
                },
                onComplete: function() {
                    const finalValue = target + (suffix || '');
                    stat.innerHTML = finalValue;
                }
            });
        });

        // ==========================================
        // SOLUTION CARDS - STAGGER
        // ==========================================
        
        const solutionCards = document.querySelectorAll('.solution-card');
        
        if (solutionCards.length) {
            gsap.from(solutionCards, {
                scrollTrigger: {
                    trigger: '.solutions-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }

        // ==========================================
        // SERVICE CARDS - STAGGER
        // ==========================================
        
        const serviceCards = document.querySelectorAll('.service-card');
        
        if (serviceCards.length) {
            gsap.from(serviceCards, {
                scrollTrigger: {
                    trigger: '.services-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }

        // ==========================================
        // WHY ITEMS - STAGGER
        // ==========================================
        
        const whyItems = document.querySelectorAll('.why-item');
        
        if (whyItems.length) {
            gsap.from(whyItems, {
                scrollTrigger: {
                    trigger: '.why-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: -30,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }

        // ==========================================
        // PORTFOLIO ITEMS - STAGGER
        // ==========================================
        
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        if (portfolioItems.length) {
            gsap.from(portfolioItems, {
                scrollTrigger: {
                    trigger: '.portfolio-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }

        // ==========================================
        // TESTIMONIALS - FADE
        // ==========================================
        
        const testimonialsSection = document.querySelector('.testimonials-swiper');
        
        if (testimonialsSection) {
            gsap.from(testimonialsSection, {
                scrollTrigger: {
                    trigger: testimonialsSection,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out'
            });
        }

        // ==========================================
        // CTA SECTION - PARALLAX
        // ==========================================
        
        const ctaSection = document.querySelector('.cta-section');
        
        if (ctaSection) {
            // Effet de parallaxe sur le fond
            const ctaBg = ctaSection.querySelector('.cta-bg');
            
            if (ctaBg) {
                gsap.to(ctaBg, {
                    scrollTrigger: {
                        trigger: ctaSection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    },
                    y: 100,
                    opacity: 0.3,
                    ease: 'none'
                });
            }
        }

        // ==========================================
        // FAQ ACCORDION - ANIMATION
        // ==========================================
        
        const accordionItems = document.querySelectorAll('.accordion-item');
        
        accordionItems.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: -20,
                duration: 0.5,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        });

        // ==========================================
        // FLOATING ELEMENTS - CONTINUOUS
        // ==========================================
        
        const floatingCards = document.querySelectorAll('.hero-floating .float-card');
        
        floatingCards.forEach((card, index) => {
            gsap.to(card, {
                y: -10,
                duration: 2 + index * 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.3
            });
        });

        // ==========================================
        // STAT ICONS - PULSE
        // ==========================================
        
        const statIcons = document.querySelectorAll('.stat-icon');
        
        statIcons.forEach(icon => {
            gsap.to(icon, {
                scale: 1.1,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
    }

    // ============================================
    // PARALLAX EFFECT - MOUSE
    // ============================================
    
    function initMouseParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        hero.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const elements = this.querySelectorAll('.hero-floating .float-card');
            
            elements.forEach((el, index) => {
                const speed = 20 + index * 10;
                const moveX = x * speed;
                const moveY = y * speed;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            // Fond avec parallaxe
            const bg = this.querySelector('.hero-bg .overlay');
            if (bg) {
                const moveX = x * 10;
                const moveY = y * 10;
                bg.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        
        // Reset sur mouse leave
        hero.addEventListener('mouseleave', function() {
            const elements = this.querySelectorAll('.hero-floating .float-card');
            elements.forEach(el => {
                el.style.transform = 'translate(0, 0)';
            });
            
            const bg = this.querySelector('.hero-bg .overlay');
            if (bg) {
                bg.style.transform = 'translate(0, 0)';
            }
        });
    }

    // ============================================
    // INITIALISATION
    // ============================================
    
    function init() {
        initAOS();
        
        // Attendre que AOS soit initialisé avant GSAP
        if (typeof gsap !== 'undefined') {
            // Attendre le chargement complet
            if (document.readyState === 'complete') {
                initGSAPAnimations();
            } else {
                window.addEventListener('load', initGSAPAnimations);
            }
        }
        
        // Parallax souris
        initMouseParallax();
    }

    // Démarrer au DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();