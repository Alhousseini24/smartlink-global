/* ============================================
   SMARTLINK GLOBAL - FORM.JS
   Gestion des formulaires
   Version 1.0
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const FORM_CONFIG = {
        endpoint: '/api/contact', // À adapter selon votre backend
        recaptchaSiteKey: 'VOTRE_CLE_RECAPTCHA',
        validationRules: {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-ZÀ-ÿ\s\-']+$/
            },
            company: {
                required: false,
                maxLength: 100
            },
            phone: {
                required: true,
                pattern: /^[0-9\+\-\s\(\)]{8,20}$/
            },
            email: {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            },
            subject: {
                required: true
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 2000
            }
        },
        errorMessages: {
            name: {
                required: 'Veuillez entrer votre nom',
                minLength: 'Le nom doit contenir au moins 2 caractères',
                maxLength: 'Le nom ne peut pas dépasser 50 caractères',
                pattern: 'Veuillez entrer un nom valide'
            },
            company: {
                maxLength: 'Le nom de la société ne peut pas dépasser 100 caractères'
            },
            phone: {
                required: 'Veuillez entrer votre numéro de téléphone',
                pattern: 'Veuillez entrer un numéro de téléphone valide'
            },
            email: {
                required: 'Veuillez entrer votre email',
                pattern: 'Veuillez entrer une adresse email valide'
            },
            subject: {
                required: 'Veuillez sélectionner un sujet'
            },
            message: {
                required: 'Veuillez entrer votre message',
                minLength: 'Le message doit contenir au moins 10 caractères',
                maxLength: 'Le message ne peut pas dépasser 2000 caractères'
            }
        }
    };

    // ============================================
    // FORMULAIRE DE CONTACT
    // ============================================
    
    function initContactForm() {
        const form = document.querySelector('#contactForm, .contact-form');
        if (!form) return;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        
        // Validation en temps réel
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Supprimer l'erreur en cours de frappe
                const errorEl = this.parentElement.querySelector('.form-text.error');
                if (errorEl) {
                    errorEl.remove();
                }
                this.classList.remove('is-invalid');
            });
        });
        
        // Soumission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Valider tous les champs
            let isValid = true;
            const formData = new FormData(form);
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                // Focus sur le premier champ invalide
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }
            
            // Désactiver le bouton
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Envoi en cours...';
            }
            
            try {
                // Envoyer les données
                const response = await submitForm(formData);
                
                if (response.success) {
                    showToast('Votre message a été envoyé avec succès !', 'success');
                    form.reset();
                    
                    // Réinitialiser les validations
                    inputs.forEach(input => {
                        input.classList.remove('is-valid', 'is-invalid');
                        const errorEl = input.parentElement.querySelector('.form-text.error');
                        if (errorEl) {
                            errorEl.remove();
                        }
                    });
                    
                    // Redirection ou autre action
                    if (response.redirect) {
                        setTimeout(() => {
                            window.location.href = response.redirect;
                        }, 2000);
                    }
                } else {
                    showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
                }
            } catch (error) {
                console.error('Erreur:', error);
                showToast('Erreur de connexion. Veuillez vérifier votre réseau.', 'error');
            } finally {
                // Réactiver le bouton
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }

    // ============================================
    // VALIDATION DE CHAMP
    // ============================================
    
    function validateField(input) {
        const name = input.name || input.id;
        const rules = FORM_CONFIG.validationRules[name];
        const errors = FORM_CONFIG.errorMessages[name];
        
        if (!rules) return true;
        
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Supprimer l'erreur existante
        const existingError = input.parentElement.querySelector('.form-text.error');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        
        // Required
        if (rules.required && !value) {
            isValid = false;
            errorMessage = errors.required;
        }
        
        // Min length
        if (isValid && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = errors.minLength;
        }
        
        // Max length
        if (isValid && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = errors.maxLength;
        }
        
        // Pattern
        if (isValid && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = errors.pattern;
        }
        
        // Afficher l'erreur
        if (!isValid) {
            input.classList.add('is-invalid');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-text error';
            errorDiv.textContent = errorMessage;
            input.parentElement.appendChild(errorDiv);
            
            // ARIA
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', errorDiv.id || '');
        } else if (value) {
            input.classList.add('is-valid');
            input.removeAttribute('aria-invalid');
        }
        
        return isValid;
    }

    // ============================================
    // SOUMISSION AJAX
    // ============================================
    
    async function submitForm(formData) {
        const url = FORM_CONFIG.endpoint;
        
        // Convertir FormData en objet JSON
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Ajouter un token CSRF (si présent dans le DOM)
        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (csrfToken) {
            data._csrf = csrfToken.content;
        }
        
        // Simuler un appel API (à remplacer par votre endpoint réel)
        // return fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-Requested-With': 'XMLHttpRequest'
        //     },
        //     body: JSON.stringify(data)
        // }).then(response => response.json());
        
        // SIMULATION (à supprimer en production)
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Données envoyées:', data);
                resolve({
                    success: true,
                    message: 'Formulaire envoyé avec succès'
                });
            }, 1500);
        });
    }

    // ============================================
    // FORMULAIRE DE DEVIS (Quote)
    // ============================================
    
    function initQuoteForm() {
        const form = document.querySelector('#quoteForm, .quote-form');
        if (!form) return;
        
        // Ajouter des champs spécifiques au devis
        const needsSelect = form.querySelector('select[name="needs"]');
        if (needsSelect) {
            needsSelect.addEventListener('change', function() {
                // Afficher des champs supplémentaires en fonction du besoin
                const additionalFields = form.querySelector('.additional-fields');
                if (additionalFields) {
                    if (this.value === 'other') {
                        additionalFields.style.display = 'block';
                    } else {
                        additionalFields.style.display = 'none';
                    }
                }
            });
        }
        
        // Utiliser la même logique que le formulaire de contact
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validation similaire
            let isValid = true;
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Envoi en cours...';
            }
            
            try {
                const formData = new FormData(form);
                // Ajouter le type de formulaire
                formData.append('formType', 'quote');
                
                const response = await submitForm(formData);
                
                if (response.success) {
                    showToast('Votre demande de devis a été envoyée !', 'success');
                    form.reset();
                    
                    // Réinitialiser les validations
                    inputs.forEach(input => {
                        input.classList.remove('is-valid', 'is-invalid');
                        const errorEl = input.parentElement.querySelector('.form-text.error');
                        if (errorEl) {
                            errorEl.remove();
                        }
                    });
                } else {
                    showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
                }
            } catch (error) {
                console.error('Erreur:', error);
                showToast('Erreur de connexion. Veuillez vérifier votre réseau.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }

    // ============================================
    // FORMULAIRE D'INSCRIPTION NEWSLETTER
    // ============================================
    
    function initNewsletterForm() {
        const form = document.querySelector('#newsletterForm, .newsletter-form');
        if (!form) return;
        
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput) return;
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validation email
            const email = emailInput.value.trim();
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            if (!email || !emailPattern.test(email)) {
                showToast('Veuillez entrer une adresse email valide', 'error');
                emailInput.focus();
                return;
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : '';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span>';
            }
            
            try {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('formType', 'newsletter');
                
                const response = await submitForm(formData);
                
                if (response.success) {
                    showToast('Inscription à la newsletter réussie !', 'success');
                    emailInput.value = '';
                } else {
                    showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
                }
            } catch (error) {
                console.error('Erreur:', error);
                showToast('Erreur de connexion.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        });
    }

    // ============================================
    // PROTECTION ANTI-SPAM (Honeypot)
    // ============================================
    
    function initHoneypot() {
        // Ajouter un champ honeypot à tous les formulaires
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Vérifier si le champ honeypot existe déjà
            if (form.querySelector('.honeypot')) return;
            
            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'honeypot';
            honeypot.className = 'honeypot';
            honeypot.style.position = 'absolute';
            honeypot.style.left = '-9999px';
            honeypot.style.top = '-9999px';
            honeypot.setAttribute('aria-hidden', 'true');
            honeypot.tabIndex = -1;
            
            form.appendChild(honeypot);
            
            // Vérifier le honeypot à la soumission
            form.addEventListener('submit', function(e) {
                const hp = this.querySelector('.honeypot');
                if (hp && hp.value !== '') {
                    e.preventDefault();
                    console.warn('Honeypot détecté - Formulaire bloqué');
                    return false;
                }
            });
        });
    }

    // ============================================
    // INITIALISATION
    // ============================================
    
    function init() {
        initContactForm();
        initQuoteForm();
        initNewsletterForm();
        initHoneypot();
        
        console.log('Formulaires initialisés ✅');
    }

    // Démarrer au DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // EXPOSER LES FONCTIONS
    // ============================================
    
    window.SmartLinkForms = {
        validateField: validateField,
        submitForm: submitForm,
        showToast: showToast
    };

})();