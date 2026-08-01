document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const mainContent = document.getElementById('main-content');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            const icon = navToggle.querySelector('i');
            if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            
            if (isOpen) {
                const firstLink = navMenu.querySelector('a');
                if (firstLink) firstLink.focus();
            } else {
                navToggle.focus();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                navToggle.focus();
            }
        });
        
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealItems = document.querySelectorAll('.service-premium-card, .gallery-item-large, .gallery-item-medium, .gallery-item-small, .contact-info, .form-container');
    
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    } else {
        revealItems.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        revealItems.forEach(el => observer.observe(el));
    }

    const waCta = document.getElementById('waCta');
    if (waCta) {
        let hideTimer;
        const showCta = () => {
            waCta.style.opacity = '1';
            waCta.style.transform = 'translateX(0)';
        };
        const dimCta = () => {
            if (window.innerWidth > 768) waCta.style.opacity = '0.7';
        };
        showCta();
        window.addEventListener('scroll', () => {
            showCta();
            clearTimeout(hideTimer);
            hideTimer = setTimeout(dimCta, 3000);
        }, { passive: true });
        waCta.addEventListener('mouseenter', () => waCta.style.opacity = '1');
        waCta.addEventListener('mouseleave', dimCta);
    }

    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    
    if (form && status) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (submitBtn) submitBtn.disabled = true;
            status.textContent = 'Envoi en cours...';
            status.className = 'form-status';
            
            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form)
                });
                
                if (res.ok) {
                    status.textContent = '✅ Votre demande a bien été envoyée. Nous vous contacterons rapidement.';
                    status.className = 'form-status success';
                    form.reset();
                } else {
                    status.textContent = '❌ Une erreur est survenue. Veuillez réessayer.';
                    status.className = 'form-status error';
                }
            } catch {
                status.textContent = '❌ Erreur réseau. Veuillez vérifier votre connexion et réessayer.';
                status.className = 'form-status error';
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    const reviewTexts = document.querySelectorAll('.review-text');
    reviewTexts.forEach(text => {
        const full = text.innerText.trim();
        if (full.length > 130) {
            const shortText = full.substring(0, 130) + '...';
            const moreBtn = document.createElement('button');
            moreBtn.type = 'button';
            moreBtn.innerText = 'Lire la suite';
            moreBtn.className = 'read-more-btn';
            moreBtn.setAttribute('aria-expanded', 'false');
            let isExpanded = false;
            
            const render = () => {
                text.innerText = isExpanded ? full : shortText;
                text.appendChild(moreBtn);
                moreBtn.innerText = isExpanded ? 'Réduire' : 'Lire la suite';
                moreBtn.setAttribute('aria-expanded', String(isExpanded));
            };
            
            moreBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                render();
            });
            
            render();
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // === NAVIGATION MOBILE ===
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.querySelector('i').classList.add('fa-bars');
                navToggle.querySelector('i').classList.remove('fa-times');
            });
        });
    }

    // === FORMSPREE HANDLING ===
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            formStatus.textContent = 'Envoi en cours...';
            formStatus.className = 'form-status';

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    formStatus.textContent = 'Merci ! Votre message a été envoyé avec succès.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Une erreur est survenue. Veuillez réessayer.';
                    formStatus.classList.add('error');
                }
            })
            .catch(error => {
                formStatus.textContent = 'Une erreur est survenue. Veuillez réessayer.';
                formStatus.classList.add('error');
            });
        });
    }

    // === LIGHTBOX GALLERY ===
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.intervention-gallery-item');

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function openLightbox(index) {
        currentIndex = index;
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const caption = item.querySelector('.intervention-caption');

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(currentIndex);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        openLightbox(currentIndex);
    }

    if (lightboxModal && galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrev);
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNext);
        }

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });

        lightboxModal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightboxModal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                showNext();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                showPrev();
            }
        }
    }

    // === SCROLL ANIMATIONS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-premium-card, .gallery-item-large, .gallery-item-medium, .gallery-item-small, .intervention-gallery-item, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
