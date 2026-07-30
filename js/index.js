document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. Scroll: navbar glassmorphism + botón "arriba" + cerrar menú
    //    (un solo listener passive para todo lo que depende del scroll)
    // ============================================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');
    const scrollTopBtn = document.getElementById('scroll-top');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
    }

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        navbar.classList.toggle('scrolled', y > 50);

        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', y > 400);
        }

        // Cerrar el menú lateral si el usuario scrollea con el menú abierto
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
    }, { passive: true });

    // ============================================================
    // 2. Menú off-canvas (mobile)
    // ============================================================
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const navItems = document.querySelectorAll('.nav-item');

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    // Cerrar el menú al hacer clic en un link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ============================================================
    // 3. Botón "Volver arriba"
    // ============================================================
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // 4. Scroll reveal (animaciones al entrar en viewport)
    // ============================================================
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // una sola vez
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ============================================================
    // 5. Lightbox de la galería
    // ============================================================
    const galeriaItems = document.querySelectorAll('.galeria-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const images = Array.from(galeriaItems).map(item => item.querySelector('img'));
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const img = images[currentIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function navigate(dir) {
        currentIndex = (currentIndex + dir + images.length) % images.length;
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = images[currentIndex].src;
            lightboxImg.alt = images[currentIndex].alt || '';
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    galeriaItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
        // Accesible por teclado
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(i);
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigate(-1));
    lightboxNext.addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // Swipe táctil
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    }, { passive: true });

    // ============================================================
    // 6. Resaltado de la sección activa en el nav
    // ============================================================
    const sections = document.querySelectorAll('section[id]');
    const navHashLinks = document.querySelectorAll('.nav-links a.nav-item[href^="#"]');

    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navHashLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(section => activeSectionObserver.observe(section));

    // ============================================================
    // 7. Galería "Ver más / Ver menos"
    // ============================================================
    const verMasBtn = document.getElementById('galeria-ver-mas');
    const galeriaExtras = document.querySelectorAll('.galeria-extra');
    let galeriaExpanded = false;

    if (verMasBtn) {
        verMasBtn.addEventListener('click', () => {
            galeriaExpanded = !galeriaExpanded;
            galeriaExtras.forEach(item => item.classList.toggle('visible', galeriaExpanded));
            verMasBtn.textContent = galeriaExpanded ? 'VER MENOS' : 'VER MÁS FOTOS';
        });
    }

    // ============================================================
    // 8. Acordeón de FAQs
    // ============================================================
    document.querySelectorAll('.faq-pregunta').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(el => {
                el.classList.remove('open');
                el.querySelector('.faq-pregunta').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ============================================================
    // 9. Preloader (se oculta apenas termina de cargar la página)
    // ============================================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('hidden'), 400);
        });
    }
});
