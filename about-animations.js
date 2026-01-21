/**
 * about-animations.js
 * 3D card animations for the About page
 */

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Add 3D tilt effect on mouse move
    const cards = document.querySelectorAll('.about-card-3d');

    cards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            const inner = card.querySelector('.card-3d-inner');
            if (inner) {
                inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            }
        });

        card.addEventListener('mouseleave', function () {
            const inner = card.querySelector('.card-3d-inner');
            if (inner) {
                inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }
        });
    });

    // Trigger animations on scroll/view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
});
