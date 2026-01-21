/**
 * skills-page-animations.js
 * Flipping animations for tech stack on dedicated skills page
 */

document.addEventListener('DOMContentLoaded', function () {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    // Observe all animated elements
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });

    // Enhanced 3D flip effect for skill items
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.skill-icon-3d');
            if (icon) {
                icon.style.transform = 'rotateY(360deg) scale(1.15)';
            }
        });

        item.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.skill-icon-3d');
            if (icon) {
                icon.style.transform = 'rotateY(0deg) scale(1)';
            }
        });
    });
});
