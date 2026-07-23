/* ============================================
   SMARTLINK GLOBAL - SLIDER.JS
   Configuration SwiperJS
   Version 1.0
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // INITIALISATION DES SLIDERS
    // ============================================
    
    function initSliders() {
        if (typeof Swiper === 'undefined') {
            console.warn('SwiperJS non chargé');
            return;
        }

        // ==========================================
        // TÉMOIGNAGES CAROUSEL
        // ==========================================
        
        const testimonialsSwiperEl = document.querySelector('.testimonials-swiper');
        
        if (testimonialsSwiperEl) {
            const swiper = new Swiper(testimonialsSwiperEl, {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                },
                grabCursor: true,
                slideToClickedSlide: true,
                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },
                // Accessibility
                a11y: {
                    prevSlideMessage: 'Témoignage précédent',
                    nextSlideMessage: 'Témoignage suivant',
                    firstSlideMessage: 'Premier témoignage',
                    lastSlideMessage: 'Dernier témoignage',
                    paginationBulletMessage: 'Aller au témoignage {{index}}'
                }
            });
            
            // Pause sur hover
            testimonialsSwiperEl.addEventListener('mouseenter', function() {
                swiper.autoplay.stop();
            });
            
            testimonialsSwiperEl.addEventListener('mouseleave', function() {
                swiper.autoplay.start();
            });
            
            // Exposer pour usage externe
            window.testimonialsSwiper = swiper;
            
            console.log('Carousel témoignages initialisé ✅');
        }

        // ==========================================
        // PARTENAIRES CAROUSEL (optionnel)
        // ==========================================
        
        const partnersSwiperEl = document.querySelector('.partners-swiper');
        
        if (partnersSwiperEl) {
            new Swiper(partnersSwiperEl, {
                slidesPerView: 2,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                breakpoints: {
                    576: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 40
                    },
                    992: {
                        slidesPerView: 6,
                        spaceBetween: 50
                    }
                },
                grabCursor: true,
                slideToClickedSlide: false,
                a11y: {
                    prevSlideMessage: 'Partenaire précédent',
                    nextSlideMessage: 'Partenaire suivant'
                }
            });
            
            console.log('Carousel partenaires initialisé ✅');
        }

        // ==========================================
        // PRODUITS/GALERIE CAROUSEL
        // ==========================================
        
        const gallerySwiperEl = document.querySelector('.gallery-swiper');
        
        if (gallerySwiperEl) {
            new Swiper(gallerySwiperEl, {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                },
                a11y: {
                    prevSlideMessage: 'Image précédente',
                    nextSlideMessage: 'Image suivante'
                }
            });
            
            console.log('Carousel galerie initialisé ✅');
        }
    }

    // ============================================
    // DYNAMIC SLIDER LOADING
    // ============================================
    
    function initDynamicSliders() {
        // Observer les changements DOM pour les sliders ajoutés dynamiquement
        if ('MutationObserver' in window) {
            const observer = new MutationObserver(function(mutations) {
                let shouldInit = false;
                
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                if (node.classList && 
                                    (node.classList.contains('testimonials-swiper') ||
                                     node.classList.contains('partners-swiper') ||
                                     node.classList.contains('gallery-swiper'))) {
                                    shouldInit = true;
                                }
                                // Vérifier les enfants
                                if (node.querySelector && 
                                    (node.querySelector('.testimonials-swiper') ||
                                     node.querySelector('.partners-swiper') ||
                                     node.querySelector('.gallery-swiper'))) {
                                    shouldInit = true;
                                }
                            }
                        });
                    }
                });
                
                if (shouldInit) {
                    // Attendre que le DOM soit prêt
                    setTimeout(initSliders, 100);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // ============================================
    // RECYCLAGE DES SLIDERS (cleanup)
    // ============================================
    
    function cleanupSliders() {
        // Détruire les instances Swiper existantes
        if (window.testimonialsSwiper) {
            window.testimonialsSwiper.destroy(true, true);
            delete window.testimonialsSwiper;
        }
        
        // Nettoyer toutes les instances Swiper
        document.querySelectorAll('.swiper').forEach(el => {
            if (el.swiper) {
                el.swiper.destroy(true, true);
            }
        });
    }

    // ============================================
    // INITIALISATION
    // ============================================
    
    function init() {
        // Attendre que le DOM soit complètement chargé
        if (document.readyState === 'complete') {
            initSliders();
            initDynamicSliders();
        } else {
            window.addEventListener('load', function() {
                // Petit délai pour s'assurer que tout est chargé
                setTimeout(initSliders, 100);
                initDynamicSliders();
            });
        }
        
        // Nettoyer sur la navigation (SPA)
        window.addEventListener('pagehide', cleanupSliders);
        
        // Rafraîchir sur redimensionnement
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.testimonialsSwiper) {
                    window.testimonialsSwiper.update();
                }
            }, 250);
        });
    }

    // Démarrer
    init();

})();