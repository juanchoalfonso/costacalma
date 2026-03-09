document.addEventListener('DOMContentLoaded', () => {
    // 1. Efecto Glassmorphism al scrollear la Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Menú Off-Canvas para Celulares
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');
    const navItems = document.querySelectorAll('.nav-item'); 

    function toggleMenu() {
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    // Cerrar el menú si hacen clic en un link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});

// 3. Scroll Reveal (Animaciones al bajar)
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: Descomentar la línea de abajo si querés que la animación ocurra solo 1 vez
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        root: null,
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });