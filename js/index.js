// Funcionalidad para el menú de navegación en celulares
const mobileMenuButton = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

mobileMenuButton.addEventListener('click', () => {
    // Agrega o quita la clase 'active' para mostrar/ocultar el menú
    navLinks.classList.toggle('active');
});
